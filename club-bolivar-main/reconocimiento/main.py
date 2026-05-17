from fastapi import FastAPI, UploadFile, File
from deepface import DeepFace
import tempfile
import os
from typing import List
import traceback
import cv2

app = FastAPI()


@app.post("/embedding")
async def generar_embedding(file: UploadFile = File(...)):

    path_temp = None

    try:

        with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as temp:

            temp.write(await file.read())
            path_temp = temp.name

        embedding = DeepFace.represent(
            img_path=path_temp,
            model_name="Facenet512",
            enforce_detection=True
        )

        return {
            "success": True,
            "embedding": embedding[0]["embedding"]
        }

    except Exception as e:

        return {
            "success": False,
            "error": str(e)
        }

    finally:

        if path_temp and os.path.exists(path_temp):
            os.remove(path_temp)

def validar_rostro(path_imagen):
    """
    Valida que exista exactamente un rostro
    """

    try:

        faces = DeepFace.extract_faces(
            img_path=path_imagen,
            enforce_detection=False
        )

        # No detectó rostros
        if not faces or len(faces) == 0:
            return False, "No se detectó un rostro"

        # Más de un rostro
        if len(faces) > 1:
            return False, "Solo debe existir una persona"

        return True, None

    except Exception:
        return False, "Imagen inválida o sin rostro"


@app.post("/reconocer")
async def reconocer(
    file_camera: UploadFile = File(...),
    file_db: List[UploadFile] = File(...)
):

    path_camera = None

    try:

        # GUARDAR FOTO CÁMARA
        with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as temp_cam:

            temp_cam.write(await file_camera.read())
            path_camera = temp_cam.name

        # VALIDAR ROSTRO
        valido, mensaje = validar_rostro(path_camera)

        if not valido:

            return {
                "match": False,
                "mensaje": mensaje,
                "distance": None
            }

        # COMPARAR CON BASE DE DATOS
        for socio_file in file_db:

            path_db = None

            try:

                socio_id = os.path.basename(
                    socio_file.filename
                ).split('.')[0]

                with tempfile.NamedTemporaryFile(
                    delete=False,
                    suffix=".jpg"
                ) as temp_db:

                    temp_db.write(await socio_file.read())
                    path_db = temp_db.name

                result = DeepFace.verify(
                    img1_path=path_camera,
                    img2_path=path_db,
                    enforce_detection=False,
                    model_name="Facenet"
                )

                if result["verified"]:

                    return {
                        "match": True,
                        "id": socio_id,
                        "distance": round(
                            float(result["distance"]),
                            4
                        )
                    }

            except Exception:
                traceback.print_exc()
                continue

            finally:

                if path_db and os.path.exists(path_db):
                    os.remove(path_db)

        return {
            "match": False,
            "mensaje": "No identificado",
            "distance": None
        }

    finally:

        if path_camera and os.path.exists(path_camera):
            os.remove(path_camera)