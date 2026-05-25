import os
import datetime
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers

PATH_DATA = 'dataset/asl_alphabet_train'
LOG_DIR = "logs/fit/" + datetime.datetime.now().strftime("%Y%m%d-%H%M%S")
MODEL_SAVE_PATH = 'asl_model_best.keras'

# Load Dataset
train_ds = tf.keras.utils.image_dataset_from_directory(
    PATH_DATA,
    validation_split=0.2,
    subset="training",
    seed=123,
    image_size=(128, 128),
    batch_size=32,
    label_mode='categorical'
)

val_ds = tf.keras.utils.image_dataset_from_directory(
    PATH_DATA,
    validation_split=0.2,
    subset="validation",
    seed=123,
    image_size=(128, 128),
    batch_size=32,
    label_mode='categorical'
)

# Augmentasi Data
augmentation = keras.Sequential([
    layers.RandomFlip("horizontal"),
    layers.RandomRotation(0.15),
    layers.RandomZoom(0.1),
    layers.RandomBrightness(0.2),
    layers.RandomContrast(0.2),
], name="augmentation")

AUTOTUNE = tf.data.AUTOTUNE
train_ds = (train_ds
            .map(lambda x, y: (augmentation(x, training=True), y),
                 num_parallel_calls=AUTOTUNE)
            .shuffle(1000)
            .prefetch(AUTOTUNE))
val_ds = val_ds.prefetch(AUTOTUNE)

# Custom Layer 
class AslNormalization(layers.Layer):
    def call(self, inputs):
        return tf.cast(inputs, tf.float32) / 255.0

# Arsitektur Model
def build_asl_model():
    inputs = keras.Input(shape=(128, 128, 3))
    x = AslNormalization()(inputs)

    # Blok 1
    x = layers.Conv2D(32, (3,3), padding='same')(x)
    x = layers.BatchNormalization()(x)
    x = layers.Activation('relu')(x)
    x = layers.MaxPooling2D()(x)

    # Blok 2
    x = layers.Conv2D(64, (3,3), padding='same')(x)
    x = layers.BatchNormalization()(x)
    x = layers.Activation('relu')(x)
    x = layers.MaxPooling2D()(x)

    # Blok 3
    x = layers.Conv2D(128, (3,3), padding='same')(x)
    x = layers.BatchNormalization()(x)
    x = layers.Activation('relu')(x)
    x = layers.MaxPooling2D()(x)

    # Blok 4
    x = layers.Conv2D(256, (3,3), padding='same')(x)
    x = layers.BatchNormalization()(x)
    x = layers.Activation('relu')(x)
    x = layers.GlobalAveragePooling2D()  (x)

    # Head
    x = layers.Dense(256, activation='relu')(x)
    x = layers.Dropout(0.5)(x)
    outputs = layers.Dense(29, activation='softmax')(x)

    return keras.Model(inputs=inputs, outputs=outputs)

model = build_asl_model()
model.summary()

#Compile
model.compile(
    optimizer=keras.optimizers.Adam(learning_rate=1e-3),
    loss='categorical_crossentropy',
    metrics=['accuracy']
)

# Callbacks 
callbacks = [
    keras.callbacks.ModelCheckpoint(
        MODEL_SAVE_PATH,
        monitor='val_accuracy',
        save_best_only=True,
        verbose=1
    ),
    keras.callbacks.EarlyStopping(
        monitor='val_accuracy',
        patience=5,
        restore_best_weights=True,
        verbose=1
    ),
    keras.callbacks.ReduceLROnPlateau(
        monitor='val_loss',
        factor=0.5,
        patience=3,
        min_lr=1e-6,
        verbose=1
    ),
    keras.callbacks.TensorBoard(log_dir=LOG_DIR)
]

#Training 
history = model.fit(
    train_ds,
    validation_data=val_ds,
    epochs=30,
    callbacks=callbacks
)

print(f"\nTraining selesai. Model terbaik disimpan di: {MODEL_SAVE_PATH}")