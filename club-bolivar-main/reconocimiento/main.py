from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from deepface import DeepFace
import tempfile
import os
import numpy as np
import cv2
from typing import List
from pydantic import BaseModel

app = FastAPI(title="Gym Facial API")

# CORS para que Flutter y Laravel puedan llamarlo
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL_NAME = "Facenet"
UMBRAL_SIMILITUD = 0.40  # Ajusta según pruebas (menor = más estricto)


# ─────────────────────────────────────────────
# UTILIDADES
# ─────────────────────────────────────────────

def leer_imagen(image_bytes: bytes) -> np.ndarray:
    np_arr = np.frombuffer(image_bytes, np.uint8)
    return cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

def guardar_temp(img: np.ndarray) -> str:
    with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as temp:
        cv2.imwrite(temp.name, img)
        return temp.name

def limpiar_temp(path: str):
    if path and os.path.exists(path):
        os.remove(path)

def obtener_embedding(img: np.ndarray) -> List[float]:
    path = guardar_temp(img)
    try:
        rep = DeepFace.represent(
            img_path=path,
            model_name=MODEL_NAME,
            enforce_detection=True,      # ← cambia a True
            detector_backend='opencv',   # ← más rápido y estable
            align=True  
        )
        return rep[0]["embedding"]
    finally:
        limpiar_temp(path)

def cosine_similarity(a: List[float], b: List[float]) -> float:
    a, b = np.array(a), np.array(b)
    return float(np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b)))


# ─────────────────────────────────────────────
# MODELOS
# ─────────────────────────────────────────────

class SocioEmbedding(BaseModel):
    socio_id: int
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


# 1. SOLO genera embedding (ya lo tenías)
@app.post("/embedding")
async def embedding(file: UploadFile = File(...)):
    try:
        image_bytes = await file.read()
        img = leer_imagen(image_bytes)
        emb = obtener_embedding(img)
        return {"success": True, "embedding": emb}
    except ValueError as e:
            # DeepFace lanza ValueError cuando no detecta cara con enforce_detection=True
        raise HTTPException(status_code=422, detail="No se detectó ninguna cara en la imagen. Asegúrate de estar bien iluminado y centrado.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# 2. Genera embedding Y busca el más parecido entre una lista
#    Flutter manda la foto + los embeddings de socios guardados localmente
@app.post("/verificar")
async def verificar(
    file: UploadFile = File(...),
    socios_json: str = ""   # JSON string con lista de SocioEmbedding
):
    import json
    try:
        image_bytes = await file.read()
        img = leer_imagen(image_bytes)
        emb_consulta = obtener_embedding(img)

        if not socios_json:
            return {"success": True, "embedding": emb_consulta, "match": None}

        socios = [SocioEmbedding(**s) for s in json.loads(socios_json)]

        mejor_match = None
        mejor_score = -1.0

        for socio in socios:
            score = cosine_similarity(emb_consulta, socio.embedding)
            if score > mejor_score:
                mejor_score = score
                mejor_match = socio

        if mejor_score >= UMBRAL_SIMILITUD and mejor_match:
            return {
                "success": True,
                "embedding": emb_consulta,
                "match": {
                    "socio_id": mejor_match.socio_id,
                    "nombre": mejor_match.nombre,
                    "score": round(mejor_score, 4)
                }
            }
        else:
            return {
                "success": True,
                "embedding": emb_consulta,
                "match": None,
                "score": round(mejor_score, 4)
            }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# 3. Comparar dos embeddings ya generados (útil para Laravel)
@app.post("/comparar")
async def comparar(req: VerificarRequest):
    try:
        mejor_match = None
        mejor_score = -1.0

        for socio in req.socios:
            score = cosine_similarity(req.embedding_consulta, socio.embedding)
            if score > mejor_score:
                mejor_score = score
                mejor_match = socio

        if mejor_score >= UMBRAL_SIMILITUD and mejor_match:
            return {
                "match": {
                    "socio_id": mejor_match.socio_id,
                    "nombre": mejor_match.nombre,
                    "score": round(mejor_score, 4)
                }
            }
        return {"match": None, "score": round(mejor_score, 4)}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Después de tu endpoint /embedding existente

@app.post("/diagnostico")
async def diagnostico(file: UploadFile = File(...)):
    try:
        image_bytes = await file.read()
        img = leer_imagen(image_bytes)
        path = guardar_temp(img)
        try:
            faces = DeepFace.extract_faces(
                img_path=path,
                enforce_detection=False,
                detector_backend='opencv'
            )
            return {
                "caras_detectadas": len(faces),
                "confianza": round(faces[0]['confidence'], 4) if faces else 0,
                "area_facial": faces[0]['facial_area'] if faces else None,
                "imagen_size": f"{img.shape[1]}x{img.shape[0]}"
            }
        finally:
            limpiar_temp(path)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))