import os
import joblib
import numpy as np
import pandas as pd

from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix
)

CSV_PATH = "data/bisindo_landmarks.csv"
MODEL_PATH = "models/bisindo_rf.pkl"
CLASSES_PATH = "models/classes_rf.npy"

os.makedirs("models", exist_ok=True)

print("Loading dataset...")

df = pd.read_csv(CSV_PATH)

df = df.dropna()

X = df.iloc[:, :-1].apply(pd.to_numeric, errors="coerce").values
y = df.iloc[:, -1].values

mask = ~np.isnan(X).any(axis=1)

X = X[mask]
y = y[mask]

X = X.astype(np.float32)

print("X shape:", X.shape)

le = LabelEncoder()

y_enc = le.fit_transform(y)

np.save(CLASSES_PATH, le.classes_)

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y_enc,
    test_size=0.2,
    stratify=y_enc,
    random_state=42
)

print("Training Random Forest...")

rf = RandomForestClassifier(
    n_estimators=300,
    max_depth=None,
    random_state=42,
    n_jobs=-1
)

rf.fit(X_train, y_train)

y_pred = rf.predict(X_test)

acc = accuracy_score(y_test, y_pred)

print("\nAccuracy:", acc)

print("\nClassification Report:")
print(classification_report(
    y_test,
    y_pred,
    target_names=le.classes_
))

print("\nConfusion Matrix:")
print(confusion_matrix(y_test, y_pred))

joblib.dump(rf, MODEL_PATH)

print(f"\nModel saved: {MODEL_PATH}")