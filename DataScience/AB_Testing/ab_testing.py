import numpy as np
import pandas as pd
import tensorflow as tf
import joblib

from tensorflow.keras.models import load_model

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder

from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    classification_report
)

# ==========================
# CUSTOM LAYER
# ==========================

@tf.keras.utils.register_keras_serializable(package="Custom")
class LandmarkNormalizationLayer(tf.keras.layers.Layer):
    def call(self, inputs):
        return tf.cast(inputs, tf.float32)

# ==========================
# LOAD DATA
# ==========================

df = pd.read_csv("data/bisindo_landmarks.csv")
df = df.dropna()

X = df.iloc[:, :-1].apply(
    pd.to_numeric,
    errors="coerce"
).values

y = df.iloc[:, -1].values

mask = ~np.isnan(X).any(axis=1)

X = X[mask].astype(np.float32)
y = y[mask]

# ==========================
# ENCODE LABEL
# ==========================

le = LabelEncoder()
y_enc = le.fit_transform(y)

# ==========================
# SPLIT DATA
# ==========================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y_enc,
    test_size=0.2,
    stratify=y_enc,
    random_state=42
)

# ==========================
# LOAD MODEL
# ==========================

nn_model = load_model(
    "models/bisindo_model.keras",
    compile=False
)

rf_model = joblib.load(
    "models/bisindo_rf.pkl"
)

# ==========================
# PREDIKSI NN
# ==========================

nn_prob = nn_model.predict(X_test)

nn_pred = np.argmax(
    nn_prob,
    axis=1
)

# ==========================
# PREDIKSI RF
# ==========================

rf_pred = rf_model.predict(X_test)

# ==========================
# EVALUASI NN
# ==========================

nn_acc = accuracy_score(
    y_test,
    nn_pred
)

nn_prec = precision_score(
    y_test,
    nn_pred,
    average="weighted"
)

nn_rec = recall_score(
    y_test,
    nn_pred,
    average="weighted"
)

nn_f1 = f1_score(
    y_test,
    nn_pred,
    average="weighted"
)

# ==========================
# EVALUASI RF
# ==========================

rf_acc = accuracy_score(
    y_test,
    rf_pred
)

rf_prec = precision_score(
    y_test,
    rf_pred,
    average="weighted"
)

rf_rec = recall_score(
    y_test,
    rf_pred,
    average="weighted"
)

rf_f1 = f1_score(
    y_test,
    rf_pred,
    average="weighted"
)

# ==========================
# HASIL
# ==========================

print("\n===== A/B TESTING =====")

print("\nNeural Network")
print("Accuracy :", nn_acc)
print("Precision:", nn_prec)
print("Recall   :", nn_rec)
print("F1 Score :", nn_f1)

print("\nRandom Forest")
print("Accuracy :", rf_acc)
print("Precision:", rf_prec)
print("Recall   :", rf_rec)
print("F1 Score :", rf_f1)

print("\n===== REPORT NN =====")
print(classification_report(
    y_test,
    nn_pred,
    target_names=le.classes_
))

print("\n===== REPORT RF =====")
print(classification_report(
    y_test,
    rf_pred,
    target_names=le.classes_
))

# ==========================
# PEMENANG
# ==========================

if nn_f1 > rf_f1:
    print("\n🏆 Model Terbaik : bisindo_model.keras")
else:
    print("\n🏆 Model Terbaik : bisindo_rf.pkl")