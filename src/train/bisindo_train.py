import os
import numpy as np
import pandas as pd

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder

from tensorflow.keras.models import Sequential # type: ignore
from tensorflow.keras.layers import Dense, Dropout, BatchNormalization, Input# type: ignore
from tensorflow.keras.utils import to_categorical# type: ignore
from tensorflow.keras.optimizers import Adam# type: ignore

CSV_PATH = "data/bisindo_landmarks.csv"
MODEL_PATH = "models/bisindo_model.keras"
CLASSES_PATH = "models/classes.npy"

os.makedirs("models", exist_ok=True)

print("Loading dataset...")

df = pd.read_csv(CSV_PATH)

# =========================
# CLEAN DATA (FIX OBJECT ERROR)
# =========================
df = df.dropna()

X = df.iloc[:, :-1].apply(pd.to_numeric, errors='coerce').values
y = df.iloc[:, -1].values

mask = ~np.isnan(X).any(axis=1)
X = X[mask]
y = y[mask]

X = X.astype(np.float32)

print("X shape:", X.shape)
print("X dtype:", X.dtype)

# =========================
# LABEL ENCODING
# =========================
le = LabelEncoder()
y_enc = le.fit_transform(y)
np.save(CLASSES_PATH, le.classes_)
y_cat = to_categorical(y_enc)

# =========================
# SPLIT
# =========================
X_train, X_test, y_train, y_test = train_test_split(
    X, y_cat,
    test_size=0.2,
    stratify=y_enc,
    random_state=42
)

# =========================
# MODEL
# =========================
model = Sequential([
    Input(shape=(X.shape[1],)),

    Dense(512, activation="relu"),
    BatchNormalization(),
    Dropout(0.3),

    Dense(256, activation="relu"),
    Dropout(0.3),

    Dense(128, activation="relu"),

    Dense(len(le.classes_), activation="softmax")
])

model.compile(
    optimizer=Adam(0.0005),
    loss="categorical_crossentropy",
    metrics=["accuracy"]
)

model.fit(
    X_train,
    y_train,
    epochs=80,
    batch_size=32,
    validation_data=(X_test, y_test)
)

model.save(MODEL_PATH)

print("MODEL SAVED:", MODEL_PATH)