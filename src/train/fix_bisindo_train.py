import os
import numpy as np
import pandas as pd
import tensorflow as tf
import datetime

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from tensorflow.keras.utils import to_categorical


CSV_PATH = "C:\\Users\\FELICIA\\Documents\\GitHub\\Local\\capstone-project\\data\\bisindo_landmarks.csv"
MODEL_PATH = "C:\\Users\\FELICIA\\Documents\\GitHub\\Local\\capstone-project\\models\\fix_bisindo_model.keras"
CLASSES_PATH = "C:\\Users\\FELICIA\\Documents\\GitHub\\Local\\capstone-project\\models\\fix_classes.npy"

os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
os.makedirs("logs/fit", exist_ok=True)


# load data
df = pd.read_csv(CSV_PATH)
df = df.dropna()

X = df.iloc[:, :-1].apply(pd.to_numeric, errors='coerce').values
y = df.iloc[:, -1].values

mask = ~np.isnan(X).any(axis=1)
X = X[mask].astype(np.float32)
y = y[mask]

print("X shape:", X.shape)


#label encoding
le = LabelEncoder()
y_enc = le.fit_transform(y)

np.save(CLASSES_PATH, le.classes_)
y_cat = to_categorical(y_enc)


#split data
X_train, X_test, y_train, y_test = train_test_split(
    X, y_cat,
    test_size=0.2,
    stratify=y_enc,
    random_state=42
)


#custom layer
@tf.keras.utils.register_keras_serializable(package="Custom")
class LandmarkNormalizationLayer(tf.keras.layers.Layer):
    def call(self, inputs):
        return tf.cast(inputs, tf.float32)


#model
inputs = tf.keras.Input(shape=(X.shape[1],), name="input_utama")

x = LandmarkNormalizationLayer(name="LandmarkNormalizationLayer")(inputs)

x = tf.keras.layers.Dense(512, activation='relu')(x)
x = tf.keras.layers.BatchNormalization()(x)
x = tf.keras.layers.Dropout(0.2)(x)

x = tf.keras.layers.Dense(256, activation='relu')(x)
x = tf.keras.layers.Dropout(0.2)(x)

x = tf.keras.layers.Dense(128, activation='relu')(x)

outputs = tf.keras.layers.Dense(len(le.classes_), activation='softmax')(x)

model = tf.keras.Model(inputs, outputs)


#tensorboard
log_dir = "logs/fit/" + datetime.datetime.now().strftime("%Y%m%d-%H%M%S")

tensorboard_cb = tf.keras.callbacks.TensorBoard(
    log_dir=log_dir,
    histogram_freq=1
)


#compile model
model.compile(
    optimizer=tf.keras.optimizers.Adam(0.0005),
    loss='categorical_crossentropy',
    metrics=[
        'accuracy',
        tf.keras.metrics.MeanAbsoluteError(name='mae')
    ]
)

#train
history = model.fit(
    X_train, y_train,
    validation_data=(X_test, y_test),
    epochs=30,
    batch_size=32,
    shuffle=True,
    callbacks=[tensorboard_cb],
    verbose=1
)


#save model
model.save(MODEL_PATH)
np.save(CLASSES_PATH, le.classes_)

print("\nTraining selesai")
print("Model saved:", MODEL_PATH)
print("Classes saved:", CLASSES_PATH)
print("TensorBoard logs:", log_dir)