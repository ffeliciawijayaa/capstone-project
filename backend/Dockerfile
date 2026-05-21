# Gunakan base image Python 3.12 yang ringan
FROM python:3.12-slim

# Install library sistem yang dibutuhkan oleh OpenCV dan MediaPipe
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Tentukan folder kerja di dalam server cloud
WORKDIR /code

# Copy file requirements dulu agar proses install bisa di-cache
COPY ./requirements.txt /code/requirements.txt

# Install semua library python
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

# Copy semua file proyek (main.py, model .h5, dll) ke dalam server
COPY . .

# Perintah untuk menjalankan FastAPI di server cloud (port 7860 khusus Hugging Face)
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]