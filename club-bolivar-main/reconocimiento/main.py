from fastapi import FastAPI, UploadFile, File, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from deepface import DeepFace
import tempfile
import os
import numpy as np
import cv2
from typing import List, Optional
from pydantic import BaseModel

app = FastAPI(title="Facial API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ArcFace es mucho más robusto que Facenet para variaciones
MODEL_NAME = "ArcFace"
BACKENDS = ['opencv', 'ssd', 'mtcnn', 'retinaface']
UMBRAL_DISTANCIA_COSENO = 0.40  # con <=> pgvector: menor = más parecido


# ─────────────────────────────────────────────
# UTILIDADES
# ─────────────────────────────────────────────

def leer_imagen(image_bytes: bytes) -> np.ndarray:
    np_arr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
    if img is None:
        raise ValueError("No se pudo decodificar la imagen")
    return img

def guardar_temp(img: np.ndarray) -> str:
    with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as temp:
        cv2.imwrite(temp.name, img)
        return temp.name

def limpiar_temp(path: str):
    if path and os.path.exists(path):
        try:
            os.remove(path)
        except:
            pass

def obtener_embedding_robusto(img: np.ndarray) -> dict:
    """
    Intenta detectar cara con múltiples backends.
    Retorna embedding + confianza + backend usado.
    """
    path = guardar_temp(img)
    try:
        # Intentar con cada backend en orden
        for backend in BACKENDS:
            try:
                rep = DeepFace.represent(
                    img_path=path,
                    model_name=MODEL_NAME,
                    enforce_detection=True,
                    detector_backend=backend,
                    align=True
                )
                if rep:
                    confianza = rep[0].get('face_confidence', 0.9)
                    if confianza >= 0.5:
                        return {
                            "embedding": rep[0]["embedding"],
                            "confianza": confianza,
                            "backend": backend,
                            "deteccion": "estricta"
                        }
            except Exception:
                continue

        # Fallback sin enforce_detection
        for backend in ['opencv', 'ssd']:
            try:
                rep = DeepFace.represent(
                    img_path=path,
                    model_name=MODEL_NAME,
                    enforce_detection=False,
                    detector_backend=backend,
                    align=True
                )
                if rep:
                    confianza = rep[0].get('face_confidence', 0)
                    if confianza >= 0.3:
                        return {
                            "embedding": rep[0]["embedding"],
                            "confianza": confianza,
                            "backend": backend,
                            "deteccion": "fallback"
                        }
            except Exception:
                continue

        raise ValueError("No se detectó ninguna cara válida en la imagen")

    finally:
        limpiar_temp(path)

def cosine_similarity(a: List[float], b: List[float]) -> float:
    a, b = np.array(a), np.array(b)
    norma = np.linalg.norm(a) * np.linalg.norm(b)
    if norma == 0:
        return 0.0
    return float(np.dot(a, b) / norma)


# ─────────────────────────────────────────────
# MODELOS
# ─────────────────────────────────────────────

class SocioEmbedding(BaseModel):
    socio_id: str
    nombre: str
    embedding: List[float]

class VerificarRequest(BaseModel):
    embedding_consulta: List[float]
    socios: List[SocioEmbedding]


# ─────────────────────────────────────────────
# ENDPOINTS
# ─────────────────────────────────────────────

@app.get("/")
def root():
    return {"status": "ok", "model": MODEL_NAME}


@app.post("/embedding")
async def embedding(
    file: UploadFile = File(...),
    etiqueta: Optional[str] = Form(default="frontal")
):
    """
    Genera embedding de una foto.
    etiqueta: frontal | lentes | lateral | oscuro (para registrar variaciones)
    """
    try:
        image_bytes = await file.read()
        img = leer_imagen(image_bytes)
        resultado = obtener_embedding_robusto(img)

        return {
            "success": True,
            "embedding": resultado["embedding"],
            "confianza": resultado["confianza"],
            "backend": resultado["backend"],
            "deteccion": resultado["deteccion"],
            "etiqueta": etiqueta,
            "dims": len(resultado["embedding"])
        }

    except ValueError as e:
        raise HTTPException(
            status_code=422,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/diagnostico")
async def diagnostico(file: UploadFile = File(...)):
    try:
        image_bytes = await file.read()
        img = leer_imagen(image_bytes)
        path = guardar_temp(img)
        resultados = []
        try:
            for backend in BACKENDS:
                try:
                    faces = DeepFace.extract_faces(
                        img_path=path,
                        enforce_detection=False,
                        detector_backend=backend
                    )
                    resultados.append({
                        "backend": backend,
                        "caras": len(faces),
                        "confianza": round(faces[0]['confidence'], 4) if faces else 0
                    })
                except Exception as e:
                    resultados.append({"backend": backend, "error": str(e)})
            return {
                "imagen_size": f"{img.shape[1]}x{img.shape[0]}",
                "modelo": MODEL_NAME,
                "backends": resultados
            }
        finally:
            limpiar_temp(path)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
