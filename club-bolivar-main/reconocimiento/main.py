from fastapi import FastAPI, UploadFile, File
from deepface import DeepFace
import tempfile
import os
from typing import List

app = FastAPI()
from fastapi import FastAPI, UploadFile, File
from deepface import DeepFace
import tempfile
import os
from typing import List

app = FastAPI()

@app.post("/reconocer")
async def reconocer(
    file_camera: UploadFile = File(...),
    file_db: List[UploadFile] = File(...)
):
    path_camera = None
    try:
        # 1. Guardar imagen de la cámara en un archivo temporal
        with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as temp_cam:
            temp_cam.write(await file_camera.read())
            path_camera = temp_cam.name

        # 2. Iterar sobre la lista de archivos de la base de datos
        for socio_file in file_db:
            path_db = None
            try:
                # Obtener el ID desde el nombre del archivo (ej: "15.jpg" -> "15")
                socio_id = os.path.basename(socio_file.filename).split('.')[0]
                print(f"ID detectado: {socio_id}") # Revisa tu terminal de Uvicorn
                
                with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as temp_db:
                    temp_db.write(await socio_file.read())
                    path_db = temp_db.name

                # 3. Comparación con DeepFace
                result = DeepFace.verify(
                    img1_path=path_camera,
                    img2_path=path_db,
                    enforce_detection=True,
                    model_name="VGG-Face"
                )

                if result["verified"]:
                    return {
                        "match": True,
                        "id": socio_id, # Ahora sí está definido
                        "distance": round(float(result["distance"]), 4)
                    }

            except Exception as e:
                print(f"Error procesando socio {socio_file.filename}: {e}")
                continue
            finally:
                # Limpiar archivo temporal del socio actual
                if path_db and os.path.exists(path_db):
                    os.remove(path_db)

        # Si termina el bucle sin coincidencias
        return {"match": False, "mensaje": "No identificado", "distance": None}

    finally:
        # 4. Limpiar imagen de la cámara (siempre se ejecuta)
        if path_camera and os.path.exists(path_camera):
            os.remove(path_camera)