FROM python:3.10-slim

WORKDIR /app

# Instalar dependencias gráficas modernas necesarias para OpenCV y DeepFace
RUN apt-get update && apt-get install -y \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Copiar e instalar requerimientos
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8081

# Ajustamos a host 0.0.0.0 para que escuche peticiones desde fuera del contenedor
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8081"]