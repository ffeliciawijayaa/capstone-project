import os
import datetime
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers


PATH_DATA = 'dataset/asl_alphabet_train'
LOG_DIR = "logs/fit/" + datetime.datetime.now().strftime("%Y%m%d-%H%M%S")

#load dataset
train_ds = tf.keras.utils.image_dataset_from_directory(
    PATH_DATA,
    validation_split=0.2,
    subset="training",
    seed=123,
    image_size=(128, 128),
    batch_size=16, 
    label_mode='categorical'
)

val_ds = tf.keras.utils.image_dataset_from_directory(
    PATH_DATA,
    validation_split=0.2,
    subset="validation",
    seed=123,
    image_size=(128, 128),
    batch_size=16,
    label_mode='categorical'
)

AUTOTUNE = tf.data.AUTOTUNE
train_ds = train_ds.shuffle(1000).prefetch(buffer_size=AUTOTUNE)
val_ds = val_ds.prefetch(buffer_size=AUTOTUNE)

#arsitektur model (functional API + custom layer)
class AslNormalization(layers.Layer):
    def call(self, inputs):
        return tf.cast(inputs, tf.float32) / 255.0

def build_asl_model():
    inputs = keras.Input(shape=(128, 128, 3))
    x = AslNormalization()(inputs)
    x = layers.Conv2D(32, (3, 3), activation='relu', padding='same')(x)
    x = layers.MaxPooling2D(pool_size=(2, 2))(x)
    x = layers.Conv2D(64, (3, 3), activation='relu', padding='same')(x)
    x = layers.MaxPooling2D(pool_size=(2, 2))(x)
    x = layers.Flatten()(x)
    x = layers.Dense(128, activation='relu')(x)
    outputs = layers.Dense(29, activation='softmax')(x)
    return keras.Model(inputs=inputs, outputs=outputs)

model = build_asl_model()
optimizer = tf.keras.optimizers.Adam(learning_rate=0.001)
loss_fn = tf.keras.losses.CategoricalCrossentropy()

#tensorboard & metrics (Side Quest)
summary_writer = tf.summary.create_file_writer(LOG_DIR)
train_acc_metric = tf.keras.metrics.CategoricalAccuracy()
val_acc_metric = tf.keras.metrics.CategoricalAccuracy()
train_mae_metric = tf.keras.metrics.MeanAbsoluteError()

#custom training loop(tf.GradientTape) 
@tf.function
def train_step(x, y):
    with tf.GradientTape() as tape:
        logits = model(x, training=True)
        loss_value = loss_fn(y, logits)
    grads = tape.gradient(loss_value, model.trainable_weights)
    optimizer.apply_gradients(zip(grads, model.trainable_weights))
    
    train_acc_metric.update_state(y, logits)
    train_mae_metric.update_state(y, logits)
    return loss_value

#training
epochs = 10 
best_acc = 0

for epoch in range(epochs):
    print(f"\nEpoch {epoch+1}/{epochs}")
    for step, (x_batch, y_batch) in enumerate(train_ds):
        loss = train_step(x_batch, y_batch)
        
        if step % 100 == 0:
            print(f"Step {step} | Loss: {loss:.4f} | Acc: {train_acc_metric.result():.4f}")
            with summary_writer.as_default():
                tf.summary.scalar('loss', loss, step=step)
                tf.summary.scalar('train_accuracy', train_acc_metric.result(), step=step)

    #validation & evaluasi loop
    for x_val, y_val in val_ds:
        val_logits = model(x_val, training=False)
        val_acc_metric.update_state(y_val, val_logits)
    
    v_acc = val_acc_metric.result()
    print(f"Validation Acc: {v_acc:.4f} | Train MAE: {train_mae_metric.result():.4f}")
    
    #save model
    if v_acc > best_acc:
        best_acc = v_acc
        model.save('asl_model_best.keras')
        print("Model terbaik berhasil disimpan dalam format .keras!")
    
    #early stopping
    if v_acc > 0.99: 
        print("Target akurasi tercapai. Training dihentikan.")
        break

    train_acc_metric.reset_state()
    val_acc_metric.reset_state()
    train_mae_metric.reset_state()