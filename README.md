<div align="center">

# 🤟 SignBridge

### Realtime Sign Language Recognition System

**Bridging the gap between sign language and text — in real time.**

[Demo](#demo) · [Fitur](#-fitur) · [Instalasi](#-instalasi) · [Struktur Proyek](#-struktur-proyek)

</div>

---

## 📖 Tentang Proyek

**SignBridge** adalah sistem pengenalan bahasa isyarat secara real-time yang dirancang untuk menjembatani komunikasi antara pengguna bahasa isyarat (BISINDO) dan teks. Sistem ini menggabungkan kekuatan **TensorFlow** untuk klasifikasi gesture, **FastAPI** sebagai backend yang cepat, serta **React + Vite** sebagai antarmuka pengguna yang responsif.

Proyek ini terdiri dari tiga komponen utama:
- 🧠 **BackEndAI** — Model TensorFlow + REST API dengan FastAPI
- 🖥️ **FrontEnd** — Antarmuka React + Vite yang interaktif
- 📊 **DataScience** — Pipeline data, augmentasi dataset BISINDO, dan analisis

---

## ✨ Fitur

- 🎥 **Real-time Sign Language Recognition** — Deteksi gesture bahasa isyarat secara langsung melalui kamera
- 🤖 **AI Text Correction** — Koreksi teks otomatis berbasis AI untuk hasil yang lebih akurat
- ⚡ **FastAPI Backend** — API backend yang ringan dan cepat
- 🧩 **TensorFlow Model** — Model deep learning yang dilatih dengan dataset BISINDO
- 📊 **Streamlit Dashboard** — Visualisasi data dan analisis model secara interaktif
- 🔁 **Hot Module Replacement** — Pengembangan frontend yang cepat dengan Vite HMR

---

## 🗂️ Struktur Proyek

```
SignBridge/
├── BackEndAI/                  # Backend AI (FastAPI + TensorFlow)
│   ├── main.py                 # Entry point FastAPI
│   ├── model/                  # TensorFlow saved model
│   ├── requirements.txt        # Dependensi Python backend
│   └── ...
│
├── FrontEnd/                   # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/         # Komponen React
│   │   └── App.jsx             # Root component
│   ├── package.json
│   └── vite.config.js
│
├── DataScience/                # Pipeline data & model training
│   ├── BISINDO-Dataset-1/      # Dataset BISINDO original
│   ├── BISINDO-Augmented-Balanced/ # Dataset setelah augmentasi
│   ├── AB_Testing/             # Pengujian model
│   ├── runs/detect/            # Hasil training
│   ├── dashboard_streamlit/    # Streamlit dashboard
│   ├── analisis_data_gambar_BISINDO (1).ipynb
│   ├── dataset.py              # Script pengolahan dataset
│   ├── streamlit.py            # Streamlit app
│   └── requirements.txt
│
└── README.md
```

---

## 🛠️ Tech Stack

| Layer | Teknologi |
|---|---|
| **Model AI** | TensorFlow, Keras |
| **Computer Vision** | OpenCV |
| **Backend** | FastAPI, Uvicorn |
| **Spell Correction** | PySpellChecker |
| **Frontend** | React 18, Vite, ESLint |
| **Data Analysis** | Streamlit, Jupyter Notebook |
| **Language** | Python 3.8+, JavaScript (ES2022) |

---

## 🚀 Instalasi

### Prasyarat

- Python >= 3.8
- Node.js >= 18
- Webcam (untuk deteksi real-time)

---

### 1. Clone Repository

```bash
git clone https://github.com/Multazam143/SignBridge.git
cd SignBridge
```

---

### 2. Backend AI (FastAPI + TensorFlow)

```bash
cd BackEndAI

# Buat virtual environment
python -m venv venv

# Aktifkan virtual environment
# Windows:
venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

# Install dependensi
pip install -r requirements.txt

# Jalankan server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Backend akan berjalan di: `http://localhost:8000`
Dokumentasi API tersedia di: `http://localhost:8000/docs`

---

### 3. Frontend (React + Vite)

```bash
cd FrontEnd

# Install dependensi
npm install

# Jalankan development server
npm run dev
```

Frontend akan berjalan di: `http://localhost:5173`

---

### 4. DataScience (Opsional — Analisis & Dashboard)

```bash
cd DataScience

# Install dependensi
pip install -r requirements.txt

# Jalankan Streamlit dashboard
streamlit run streamlit.py

# Atau buka Jupyter Notebook untuk analisis
jupyter notebook "analisis_data_gambar_BISINDO (1).ipynb"
```

Dashboard Streamlit akan berjalan di: `http://localhost:8501`

---

## 📊 DataScience Pipeline

Bagian DataScience mencakup seluruh proses dari raw dataset hingga model yang siap digunakan:

| Tahap | Deskripsi |
|---|---|
| **Dataset Collection** | Dataset BISINDO (Bahasa Isyarat Indonesia) |
| **Augmentasi Data** | Balanced augmentation untuk meningkatkan variasi data |
| **Analisis EDA** | Eksplorasi data gambar BISINDO via Jupyter Notebook |
| **A/B Testing** | Perbandingan performa antar model/konfigurasi |
| **Training Runs** | Hasil deteksi tersimpan di `runs/detect/` |
| **Dashboard** | Visualisasi interaktif via Streamlit |

---

## 🔌 API Endpoints

| Method | Endpoint | Deskripsi |
|---|---|---|
| `GET` | `/` | Health check |
| `POST` | `/predict` | Prediksi gesture dari frame kamera |
| `POST` | `/correct` | Koreksi teks hasil prediksi |
| `GET` | `/docs` | Dokumentasi Swagger UI |

---

## 🔧 Konfigurasi Frontend (Vite)

Proyek ini menggunakan dua opsi plugin Vite yang tersedia:

- [`@vitejs/plugin-react`](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) — menggunakan **Oxc** transformer
- [`@vitejs/plugin-react-swc`](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) — menggunakan **SWC** untuk build lebih cepat

Untuk mengintegrasikan TypeScript dengan lint rules yang lebih ketat, lihat [TS template Vite](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts).

---

## 🤝 Kontribusi

Kontribusi sangat disambut! Silakan ikuti langkah berikut:

1. Fork repository ini
2. Buat branch fitur baru: `git checkout -b feature/NamaFitur`
3. Commit perubahan: `git commit -m 'feat: tambah fitur X'`
4. Push ke branch: `git push origin feature/NamaFitur`
5. Buat Pull Request

---

## 👥 Tim Pengembang

Proyek ini dikembangkan oleh tim yang luar biasa:

| ID | Nama | Peran |
|---|---|---|
| CACC278D6Y0717 | **Multazam** | 🤖 AI Engineer |
| CACC245D6X2216 | **Felicia Wijaya** | 🤖 AI Engineer |
| CFCC899D6Y1148 | **Abraham Adhitya Vorana** | 🌐 Full Stack Web Developer |
| CFCC899D6Y2122 | **Pandu Ksatria Jati** | 🌐 Full Stack Web Developer |
| CDCC284D6X2674 | **Shiva Aulia Nazwa** | 📊 Data Scientist |
| CDCC284D6X2711 | **Nabila Agatha Parsa** | 📊 Data Scientist |

---

## 📄 Lisensi

Proyek ini dilisensikan di bawah [MIT License](LICENSE).

---

<div align="center">

Dibuat dengan ❤️ oleh Tim SignBridge

⭐ Jangan lupa beri bintang jika proyek ini bermanfaat!

</div>
