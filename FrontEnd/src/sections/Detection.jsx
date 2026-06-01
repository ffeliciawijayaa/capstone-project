import { useState, useRef } from "react";

function Detection() {

  const [image, setImage] = useState(null);
  const [file, setFile] = useState(null);
  const [result, setResult] = useState("Waiting for detection...");
  const [loading, setLoading] = useState(false);

  // Webcam
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [cameraOn, setCameraOn] = useState(false);
  const [streamData, setStreamData] = useState(null);

  const prediction =
    result.split("\n")[0]?.replace("Prediction: ", "") || "-";

  const detectedText =
    result.split("\n")[1]?.replace("Text: ", "") || "-";

  const confidence =
    result.split("\n")[2]?.replace("Confidence: ", "") || "-";

  // Upload image
  const handleImage = (e) => {

    const selectedFile = e.target.files[0];

    if (selectedFile) {

      setFile(selectedFile);
      setImage(URL.createObjectURL(selectedFile));

      if (streamData) {
        streamData.getTracks().forEach((track) => track.stop());
      }

      setCameraOn(false);
      setStreamData(null);
    }
  };

  // Start webcam
  const startCamera = async () => {

    if (cameraOn && streamData) {

      streamData.getTracks().forEach((track) => track.stop());

      setCameraOn(false);
      setStreamData(null);

      return;
    }

    try {

      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      setStreamData(stream);
      setCameraOn(true);

      setTimeout(() => {

        if (videoRef.current) {

          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }

      }, 100);

      setImage(null);

    } catch (error) {

      setResult("Cannot access camera");
    }
  };

  // Capture image
  const captureImage = async () => {

    const canvas = canvasRef.current;
    const video = videoRef.current;

    const context = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    context.drawImage(video, 0, 0);

    const blob = await new Promise((resolve) =>
      canvas.toBlob(resolve, "image/jpeg")
    );

    const capturedFile = new File([blob], "capture.jpg", {
      type: "image/jpeg",
    });

    setFile(capturedFile);
    setImage(URL.createObjectURL(capturedFile));

    if (streamData) {
      streamData.getTracks().forEach((track) => track.stop());
    }

    setCameraOn(false);
    setStreamData(null);

    // Auto Detect
    setLoading(true);

    try {

      const formData = new FormData();

      formData.append("file", capturedFile);

      const response = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      setResult(
        `Prediction: ${data.prediction}
Text: ${data.text}
Confidence: ${data.confidence}`
      );

    } catch (error) {

      setResult("Failed to connect API");
    }

    setLoading(false);
  };

  // Detection API
  const handleDetection = async () => {

    if (!file) {

      setResult("Please upload image first");

      return;
    }

    setLoading(true);

    try {

      const formData = new FormData();

      formData.append("file", file);

      const response = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      setResult(
        `Prediction: ${data.prediction}
Text: ${data.text}
Confidence: ${data.confidence}`
      );

    } catch (error) {

      setResult("Failed to connect API");
    }

    setLoading(false);
  };

  return (
    <section
      id="detection"
      style={{
        padding:
          window.innerWidth < 768
            ? "80px 20px"
            : "120px 80px",
        background: "#F4FFFD",
      }}
    >
      <div
        style={{
          textAlign: "center",
          marginBottom: "70px",
        }}
      >
        <h2
          style={{
            fontSize: window.innerWidth < 768 ? "38px" : "52px",
            color: "#2B2B2B",
            marginBottom: "20px",
          }}
        >
          AI Detection Demo
        </h2>

        <p
          style={{
            color: "#666",
            fontSize: "18px",
          }}
        >
          Upload sign language image or use realtime camera.
        </p>
      </div>

      <div
        style={{
          maxWidth: "700px",
          margin: "auto",
          background: "white",
          position: "relative",
          padding: window.innerWidth < 768 ? "25px" : "50px",
          borderRadius: "30px",
          border: "1px solid #D7F2EB",
          boxShadow: "0 12px 30px rgba(0,0,0,0.05)",
        }}
      >

        {/* Preview */}
        <div
          style={{
            width: "100%",
            height: "320px",
            border: "2px dashed #BDEEE6",
            borderRadius: "24px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            overflow: "hidden",
            marginBottom: "30px",
            background: "#FAFFFE",
            position: "relative",
          }}
        >
          {cameraOn ? (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  background: "#000",
                }}
              />

              <canvas
                ref={canvasRef}
                style={{ display: "none" }}
              />

              <button
                onClick={captureImage}
                style={{
                  position: "absolute",
                  right: "20px",
                  bottom: "20px",
                  width: "70px",
                  height: "70px",
                  borderRadius: "50%",
                  border: "none",
                  background: "#2EC4B6",
                  color: "white",
                  fontSize: "28px",
                  cursor: "pointer",
                  boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
                  transition: "all 0.35s ease",
                }}
                onMouseOver={(e) => {
                  e.target.style.background = "#4FD6CA";
                  e.target.style.transform = "scale(1.08)";
                }}
                onMouseOut={(e) => {
                  e.target.style.background = "#2EC4B6";
                  e.target.style.transform = "scale(1)";
                }}
              >
                📸
              </button>
            </>
          ) : image ? (
            <img
              src={image}
              alt="preview"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
            />
          ) : (
            <p
              style={{
                color: "#999",
                fontSize: "18px",
              }}
            >
              Image / Camera Preview
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div
          style={{
            display: "flex",
            gap: "20px",
            marginBottom: "25px",
            flexDirection:
              window.innerWidth < 768 ? "column" : "row",
          }}
        >
          <label
            style={{
              flex: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "16px",
              background: "#2EC4B6",
              color: "white",
              borderRadius: "14px",
              cursor: "pointer",
              fontWeight: "bold",
              transition: "all 0.35s ease",
            }}
            onMouseOver={(e) => {
              e.target.style.background = "#4FD6CA";
            }}
            onMouseOut={(e) => {
              e.target.style.background = "#2EC4B6";
            }}
          >
            Choose Image

            <input
              type="file"
              accept="image/*"
              onChange={handleImage}
              hidden
            />
          </label>

          <button
            onClick={startCamera}
            style={{
              flex: 1,
              padding: "16px",
              border: "none",
              borderRadius: "14px",
              background: "#2EC4B6",
              color: "white",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "all 0.35s ease",
            }}
            onMouseOver={(e) => {
              e.target.style.background = "#4FD6CA";
            }}
            onMouseOut={(e) => {
              e.target.style.background = "#2EC4B6";
            }}
          >
            {cameraOn ? "Stop Camera" : "Start Camera"}
          </button>
        </div>

        {/* Detect Button */}
        {!cameraOn && file && (
          <button
            onClick={handleDetection}
            disabled={loading}
            style={{
              width: "100%",
              padding: "18px",
              border: "none",
              borderRadius: "14px",
              background: loading ? "#7EDFD6" : "#2EC4B6",
              color: "white",
              fontSize: "18px",
              fontWeight: "bold",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.35s ease",
              opacity: loading ? 0.8 : 1,
            }}
            onMouseOver={(e) => {
              if (!loading) {
                e.target.style.background = "#4FD6CA";
              }
            }}
            onMouseOut={(e) => {
              if (!loading) {
                e.target.style.background = "#2EC4B6";
              }
            }}
          >
            {loading ? "⏳ Detecting..." : "Detect Sign Language"}
          </button>
        )}

        {/* Result */}
        <div
          style={{
            marginTop: "35px",
            padding: "25px",
            borderRadius: "20px",
            background: "#F4FFFD",
            border: "1px solid #D7F2EB",
          }}
        >
          <h3
            style={{
              marginBottom: "20px",
              color: "#2EC4B6",
            }}
          >
            Detection Result
          </h3>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "18px",
            }}
          >
            <div
              style={{
                background: "white",
                padding: "18px",
                borderRadius: "16px",
                border: "1px solid #D7F2EB",
              }}
            >
              <p
                style={{
                  color: "#888",
                  fontSize: "14px",
                  marginBottom: "8px",
                }}
              >
                AI Prediction
              </p>

              <h2
                style={{
                  color: "#2EC4B6",
                  fontSize: "32px",
                  margin: 0,
                }}
              >
                {prediction}
              </h2>
            </div>

            <div
              style={{
                background: "white",
                padding: "18px",
                borderRadius: "16px",
                border: "1px solid #D7F2EB",
              }}
            >
              <p
                style={{
                  color: "#888",
                  fontSize: "14px",
                  marginBottom: "8px",
                }}
              >
                Detected Text
              </p>

              <h3
                style={{
                  color: "#333",
                  margin: 0,
                  fontSize: "24px",
                  wordBreak: "break-word",
                }}
              >
                {detectedText}
              </h3>
            </div>

            <div
              style={{
                background: "white",
                padding: "18px",
                borderRadius: "16px",
                border: "1px solid #D7F2EB",
              }}
            >
              <p
                style={{
                  color: "#888",
                  fontSize: "14px",
                  marginBottom: "8px",
                }}
              >
                Confidence
              </p>

              <h3
                style={{
                  color: "#333",
                  margin: 0,
                  fontSize: "24px",
                }}
              >
                {confidence}
              </h3>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

export default Detection;