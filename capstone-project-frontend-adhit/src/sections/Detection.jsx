import { useState, useRef, useEffect } from "react";

function Detection() {
  const [image, setImage] = useState(null);
  const [file, setFile] = useState(null);
  const [result, setResult] = useState("Waiting for detection...");
  const [loading, setLoading] = useState(false);
  const [aiStatus, setAiStatus] = useState("ready");

  // Webcam & WebSocket References
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const wsRef = useRef(null);

  const [cameraOn, setCameraOn] = useState(false);
  const [streamData, setStreamData] = useState(null);

  // Ambil nilai teks dari baris hasil pemisah \n secara aman
  const getResultValue = (keyword, fallback = "-") => {
    if (!result || typeof result !== "string") return fallback;
    const lines = result.split("\n");
    const targetLine = lines.find((line) => line.includes(keyword));
    return targetLine ? targetLine.replace(`${keyword}: `, "") : fallback;
  };

  const prediction = getResultValue("Prediction");
  const detectedText = getResultValue("Text");
  const confidence = getResultValue("Confidence");

  // Fungsi pembantu mematikan kamera & pipa WebSocket
  const stopCameraAndWS = () => {
    if (streamData) {
      streamData.getTracks().forEach((track) => track.stop());
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setCameraOn(false);
    setStreamData(null);
    setAiStatus("ready");
  };

  // Pilih file gambar manual lewat folder internal
  const handleImage = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setImage(URL.createObjectURL(selectedFile));
      stopCameraAndWS();
    }
  };

  // Menyalakan/Mematikan Realtime Webcam + Jalur WebSocket
  const toggleCamera = async () => {
    if (cameraOn) {
      stopCameraAndWS();
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      setStreamData(stream);
      setCameraOn(true);
      setImage(null);

      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      }, 100);

      // Inisialisasi koneksi WebSocket
      wsRef.current = new WebSocket("ws://127.0.0.1:8000/bisindo/predict_webcam");

       wsRef.current.onopen = () => {
      console.log("WebSocket Terhubung!");
      console.log(wsRef.current.readyState);
      setAiStatus("ready");
    };

      wsRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setAiStatus("ready");
        setResult(
          `Prediction: ${data.prediction}\nText: -\nConfidence: ${data.confidence}`
        );
      };

      wsRef.current.onerror = () => {
        setResult("WebSocket Connection Error");
        setAiStatus("error");
      };

      wsRef.current.onclose = () => {
        console.log("WebSocket Terputus.");
      };

    } catch {
      // DIPERBAIKI: Mengosongkan parameter catch yang tidak digunakan untuk mematuhi ESLint
      setResult("Cannot access camera");
      setAiStatus("error");
    }
  };

  // LOOPING OTOMATIS: Pengiriman gambar frame demi frame lewat WebSocket
  useEffect(() => {
    let streamingInterval;

    if (cameraOn && streamData) {
      streamingInterval = setInterval(() => {
        if (videoRef.current && canvasRef.current && wsRef.current?.readyState === WebSocket.OPEN) {
          const video = videoRef.current;
          const canvas = canvasRef.current;
          const context = canvas.getContext("2d");

          if (video.videoWidth > 0 && video.videoHeight > 0) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            context.drawImage(video, 0, 0, canvas.width, canvas.height);

            const base64Frame = canvas.toDataURL("image/jpeg", 0.6);

            console.log("MENGIRIM FRAME");

            wsRef.current.send(base64Frame);

            setAiStatus("detecting");
          }
        }
      }, 150);
    }

    return () => {
      if (streamingInterval) clearInterval(streamingInterval);
    };
  }, [cameraOn, streamData]);

  // Antisipasi jika user menutup tab atau pindah halaman secara mendadak
  useEffect(() => {
    return () => {
      if (streamData) streamData.getTracks().forEach((track) => track.stop());
      if (wsRef.current) wsRef.current.close();
    };
  }, [streamData]);

  // Tombol deteksi manual khusus file foto yang diunggah biasa
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
        `Prediction: ${data.prediction}\nText: ${data.text || "-"}\nConfidence: ${data.confidence}`
      );
    } catch {
      // DIPERBAIKI: Mengosongkan parameter catch yang tidak digunakan untuk mematuhi ESLint
      setResult("Failed to connect API");
    }
    setLoading(false);
  };

  return (
    <section
      id="detection"
      style={{
        padding: window.innerWidth < 768 ? "80px 20px" : "120px 80px",
        background: "#F4FFFD",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "70px" }}>
        <h2
          style={{
            fontSize: window.innerWidth < 768 ? "38px" : "52px",
            color: "#2B2B2B",
            marginBottom: "20px",
          }}
        >
          Demo Deteksi AI
        </h2>
        <p style={{ color: "#666", fontSize: "18px" }}>
          Unggah gambar bahasa isyarat atau gunakan kamera langsung.
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
        {/* Preview Screen */}
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
              <div
                style={{
                  position: "absolute",
                  top: "15px",
                  left: "15px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "rgba(0,0,0,0.7)",
                  color: "white",
                  padding: "8px 14px",
                  borderRadius: "10px",
                  fontSize: "14px",
                  fontWeight: "bold",
                }}
              >
                <div
                  className="live-dot"
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    background: "#ff3b30",
                  }}
                />
                LIVE WEBSOCKET ACTIVE
              </div>
              <canvas ref={canvasRef} style={{ display: "none" }} />
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
            <p style={{ color: "#999", fontSize: "18px" }}>
              Pratinjau Gambar / Kamera
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div
          style={{
            display: "flex",
            gap: "20px",
            marginBottom: "25px",
            flexDirection: window.innerWidth < 768 ? "column" : "row",
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
            onMouseOver={(e) => (e.target.style.background = "#4FD6CA")}
            onMouseOut={(e) => (e.target.style.background = "#2EC4B6")}
          >
            Pilih Gambar
            <input
              type="file"
              accept="image/*"
              onChange={handleImage}
              hidden
            />
          </label>

          <button
            onClick={toggleCamera}
            style={{
              flex: 1,
              padding: "16px",
              border: "none",
              borderRadius: "14px",
              background: cameraOn ? "#D93025" : "#2EC4B6",
              color: "white",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "all 0.35s ease",
            }}
          >
            {cameraOn ? "Stop Realtime Cam" : "Mulai Kamera Langsung"}
          </button>
        </div>

        {/* Action Button khusus foto biasa */}
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
            }}
          >
            {loading ? "⏳ Detecting..." : "Detect Sign Language"}
          </button>
        )}

        {/* Kotak Monitoring Hasil Realtime */}
        <div
          style={{
            marginTop: "35px",
            padding: "25px",
            borderRadius: "20px",
            background: "#F4FFFD",
            border: "1px solid #D7F2EB",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <h3 style={{ color: "#2EC4B6", margin: 0 }}>Hasil Deteksi</h3>
            {cameraOn && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  color:
                    aiStatus === "ready"
                      ? "#00A86B"
                      : aiStatus === "detecting"
                      ? "#E09F00"
                      : "#D93025",
                }}
              >
                <div
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    background:
                      aiStatus === "ready"
                        ? "#00A86B"
                        : aiStatus === "detecting"
                        ? "#E09F00"
                        : "#D93025",
                  }}
                />
                {aiStatus === "ready" && "Live Detection Active"}
                {aiStatus === "detecting" && "Processing Frame..."}
                {aiStatus === "error" && "Server Error"}
              </div>
            )}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            <div
              style={{
                background: "white",
                padding: "18px",
                borderRadius: "16px",
                border: "1px solid #D7F2EB",
              }}
            >
              <p style={{ color: "#888", fontSize: "14px", marginBottom: "8px" }}>
                Prediksi AI
              </p>
              <h2 style={{ color: "#2EC4B6", fontSize: "32px", margin: 0 }}>
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
              <p style={{ color: "#888", fontSize: "14px", marginBottom: "8px" }}>
                Teks Terdeteksi
              </p>
              <h3 style={{ color: "#333", margin: 0, fontSize: "24px" }}>
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
              <p style={{ color: "#888", fontSize: "14px", marginBottom: "8px" }}>
                Kepercayaan
              </p>
              <h3 style={{ color: "#333", margin: 0, fontSize: "24px" }}>
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
