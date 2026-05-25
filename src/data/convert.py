import tensorflow as tf
from tensorflow.keras import layers

class AslNormalization(layers.Layer):
    def call(self, inputs):
        return tf.cast(inputs, tf.float32) / 255.0

model_h5 = 'models/sign_language_model.h5' 
model = tf.keras.models.load_model(
    model_h5, 
    custom_objects={'AslNormalization': AslNormalization}
)

model.save('models/asl_model_best.keras')
print("konversi selesai")