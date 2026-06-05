import streamlit as st
import os
import random
import hashlib
import pandas as pd
import numpy as np
from PIL import Image
import plotly.express as px
import plotly.graph_objects as go

# ======================================================
# CONFIG
# ======================================================

st.set_page_config(
    page_title="EDA BISINDO Dashboard",
    layout="wide",
    page_icon="🤟"
)

st.title("🤟 Dashboard Exploratory Data Analysis (EDA) Dataset BISINDO")
st.markdown("Analisis Dataset BISINDO berdasarkan pertanyaan eksplorasi data (EDA).")

# ======================================================
# DATASET PATH
# ======================================================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

splits = {
    "Train": os.path.join(BASE_DIR, "BISINDO-Dataset-1", "train", "images"),
    "Valid": os.path.join(BASE_DIR, "BISINDO-Dataset-1", "valid", "images"),
    "Test": os.path.join(BASE_DIR, "BISINDO-Dataset-1", "test", "images")
}

# ======================================================
# FUNCTIONS
# ======================================================

@st.cache_data
def get_classes(path):
    files = os.listdir(path)
    classes = sorted(list(set(f.split("-")[0] for f in files)))
    return classes

@st.cache_data
def count_per_class(path):
    classes = get_classes(path)
    counts = {}

    for cls in classes:
        counts[cls] = len(
            [f for f in os.listdir(path) if f.startswith(cls)]
        )
    return counts

@st.cache_data
def corrupt_checker(path):

    corrupt = []

    for f in os.listdir(path):

        fp = os.path.join(path, f)

        try:
            img = Image.open(fp)
            img.verify()
        except:
            corrupt.append(f)

    return corrupt

@st.cache_data
def duplicate_checker(path):

    hashes = {}
    duplicate = []

    for f in os.listdir(path):

        fp = os.path.join(path, f)

        try:
            with open(fp, "rb") as file:
                h = hashlib.md5(file.read()).hexdigest()

            if h in hashes:
                duplicate.append(f)
            else:
                hashes[h] = f
        except:
            pass

    return duplicate

@st.cache_data
def format_checker(path):

    invalid = []

    for f in os.listdir(path):

        if not f.lower().endswith(
            (".jpg", ".jpeg", ".png")
        ):
            invalid.append(f)

    return invalid

# ======================================================
# OVERVIEW
# ======================================================

st.sidebar.title("Navigasi Dashboard")

menu = st.sidebar.radio(
    "Pilih Bagian",
    [
        "🏠 Overview",
        "❓ Pertanyaan 1",
        "❓ Pertanyaan 2",
        "❓ Pertanyaan 3"
    ]
)

if menu == "🏠 Overview":

    st.header("Overview Dataset")

    total_images = 0

    for p in splits.values():
        total_images += len(os.listdir(p))

    classes = get_classes(splits["Train"])

    c1, c2, c3 = st.columns(3)

    c1.metric("📷 Total Images", total_images)
    c2.metric("🔤 Total Classes", len(classes))
    c3.metric("📂 Total Split", 3)

    st.markdown("---")

    st.info("""
Dashboard ini menyajikan hasil Exploratory Data Analysis (EDA)
dataset BISINDO berdasarkan tiga pertanyaan eksplorasi utama:

1. Variasi visual dataset
2. Kualitas data
3. Distribusi kelas
""")

# ======================================================
# Q1
# ======================================================

elif menu == "❓ Pertanyaan 1":

    st.header("❓ Pertanyaan 1 — Variasi Visual Dataset")

    st.warning("""
Bagaimana variasi latar belakang, pencahayaan, dan posisi tangan
pada setiap kelas dalam dataset BISINDO, serta seberapa konsisten
karakteristik visual tersebut berdasarkan analisis 5–10 sampel
gambar yang dipilih secara acak per kelas pada keseluruhan split
(train, valid, dan test)?
""")

    split = st.selectbox(
        "Pilih Split",
        list(splits.keys())
    )

    path = splits[split]

    classes = get_classes(path)

    cls = st.selectbox(
        "Pilih Kelas",
        classes
    )

    files = [
        f for f in os.listdir(path)
        if f.startswith(cls)
    ]

    sample = random.sample(
        files,
        min(9, len(files))
    )

    st.subheader("Gallery Sampel Gambar")

    cols = st.columns(3)

    stds = []

    for i, f in enumerate(sample):

        img_path = os.path.join(path, f)

        img = Image.open(img_path)

        gray = np.array(
            img.convert("L")
        )

        stds.append(gray.std())

        cols[i % 3].image(
            img,
            caption=f,
            use_container_width=True
        )

    mean_std = np.mean(stds)

    st.markdown("---")

    st.subheader("Visual Consistency")

    fig = px.bar(
        x=list(range(1, len(stds)+1)),
        y=stds,
        labels={"x":"Sample","y":"Std Dev"},
        title="Pixel Standard Deviation"
    )

    st.plotly_chart(
        fig,
        use_container_width=True
    )

    st.success(f"""
Rata-rata Std Dev Pixel = {mean_std:.2f}

Interpretasi:
- Nilai tinggi → variasi visual besar
- Nilai rendah → gambar lebih konsisten
""")

# ======================================================
# Q2
# ======================================================

elif menu == "❓ Pertanyaan 2":

    st.header("❓ Pertanyaan 2 — Kualitas Data")

    st.warning("""
Apakah terdapat gambar rusak (corrupt), file duplikat,
dan ketidaksesuaian format file pada dataset BISINDO
di setiap split (train, valid, dan test)?
""")

    rows = []

    for split, path in splits.items():

        total = len(os.listdir(path))
        corrupt = len(corrupt_checker(path))
        dup = len(duplicate_checker(path))
        invalid = len(format_checker(path))

        rows.append({
            "Split": split,
            "Total": total,
            "Corrupt": corrupt,
            "Duplicate": dup,
            "Invalid Format": invalid
        })

    df = pd.DataFrame(rows)

    st.dataframe(
        df,
        use_container_width=True
    )

    fig = go.Figure()

    fig.add_bar(
        x=df["Split"],
        y=df["Corrupt"],
        name="Corrupt"
    )

    fig.add_bar(
        x=df["Split"],
        y=df["Duplicate"],
        name="Duplicate"
    )

    fig.add_bar(
        x=df["Split"],
        y=df["Invalid Format"],
        name="Format"
    )

    fig.update_layout(
        barmode="group"
    )

    st.plotly_chart(
        fig,
        use_container_width=True
    )

    st.success("""
Insight:
Dataset berkualitas baik apabila jumlah corrupt,
duplicate, dan invalid format sangat rendah atau nol.
""")

# ======================================================
# Q3
# ======================================================

elif menu == "❓ Pertanyaan 3":

    st.header("❓ Pertanyaan 3 — Distribusi Kelas")

    st.warning("""
Bagaimana distribusi jumlah gambar per kelas pada
masing-masing split (train, valid, dan test)?
Apakah distribusi kelas sudah balanced?
""")

    # =====================================
    # DATA ORIGINAL
    # =====================================

    st.subheader("📊 Data Original (Imbalanced)")

    split1 = st.selectbox(
        "Pilih Split Original",
        list(splits.keys()),
        key="orig"
    )

    counts1 = count_per_class(
        splits[split1]
    )

    df1 = pd.DataFrame(
        counts1.items(),
        columns=["Class","Count"]
    )

    ratio1 = (
        df1["Count"].max() /
        max(df1["Count"].min(),1)
    )

    if ratio1 <= 1.5:
        status1 = "✅ Balanced"
    elif ratio1 <= 3:
        status1 = "⚠ Moderately Balanced"
    else:
        status1 = "❌ Imbalanced"

    st.metric(
        "Balance Ratio Original",
        f"{ratio1:.2f}"
    )

    st.write(status1)

    fig1 = px.bar(
        df1.sort_values(
            "Count",
            ascending=False
        ),
        x="Class",
        y="Count",
        text="Count",
        color="Count",
        title="Distribusi Original"
    )

    fig1.update_traces(
        textposition="outside"
    )

    st.plotly_chart(
        fig1,
        use_container_width=True
    )

    # =====================================
    # DATA BALANCED
    # =====================================

    st.markdown("---")
    st.subheader("📊 Data Balanced")

    balanced_splits = {
        "Train": os.path.join(
            BASE_DIR,
            "BISINDO-Augmented-Balanced",
            "train",
            "images"
        ),
        "Valid": os.path.join(
            BASE_DIR,
            "BISINDO-Augmented-Balanced",
            "valid",
            "images"
        ),
        "Test": os.path.join(
            BASE_DIR,
            "BISINDO-Augmented-Balanced",
            "test",
            "images"
        )
    }

    split2 = st.selectbox(
        "Pilih Split Balanced",
        list(balanced_splits.keys()),
        key="bal"
    )

    counts2 = count_per_class(
        balanced_splits[split2]
    )

    df2 = pd.DataFrame(
        counts2.items(),
        columns=["Class","Count"]
    )

    ratio2 = (
        df2["Count"].max() /
        max(df2["Count"].min(),1)
    )

    if ratio2 <= 1.5:
        status2 = "✅ Balanced"
    elif ratio2 <= 3:
        status2 = "⚠ Moderately Balanced"
    else:
        status2 = "❌ Imbalanced"

    st.metric(
        "Balance Ratio Balanced",
        f"{ratio2:.2f}"
    )

    st.write(status2)

    fig2 = px.bar(
        df2.sort_values(
            "Count",
            ascending=False
        ),
        x="Class",
        y="Count",
        text="Count",
        color="Count",
        title="Distribusi Balanced"
    )

    fig2.update_traces(
        textposition="outside"
    )

    st.plotly_chart(
        fig2,
        use_container_width=True
    )

    st.success(f"""
Insight:

Original:
{status1} (ratio {ratio1:.2f})

Balanced:
{status2} (ratio {ratio2:.2f})

Perbandingan menunjukkan pengaruh proses
balancing terhadap distribusi kelas dataset.
""")