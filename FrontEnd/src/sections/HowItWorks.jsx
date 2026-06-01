function HowItWorks() {
  const stepStyle = {
    width: "300px",
    background: "white",
    padding: "40px",
    borderRadius: "28px",
    border: "1px solid #D7F2EB",
    boxShadow: "0 12px 30px rgba(0,0,0,0.05)",
    transition: "all 0.35s ease",
    cursor: "pointer",
  };

  const handleMouseOver = (e) => {
    e.currentTarget.style.transform = "translateY(-10px)";
    e.currentTarget.style.boxShadow =
      "0 20px 40px rgba(46, 196, 182, 0.15)";
  };

  const handleMouseOut = (e) => {
    e.currentTarget.style.transform = "translateY(0)";
    e.currentTarget.style.boxShadow =
      "0 12px 30px rgba(0,0,0,0.05)";
  };

  return (
    <section
      style={{
        padding: "120px 80px",
        background: "white",
      }}
    >
      <div
        style={{
          textAlign: "center",
          marginBottom: "80px",
        }}
      >
        <h2
          style={{
            fontSize: "52px",
            color: "#2B2B2B",
            marginBottom: "20px",
          }}
        >
          How It Works
        </h2>

        <p
          style={{
            fontSize: "18px",
            color: "#666",
          }}
        >
          Simple steps to use AI sign language detection.
        </p>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "35px",
          flexWrap: "wrap",
        }}
      >
        <div
          style={stepStyle}
          onMouseOver={handleMouseOver}
          onMouseOut={handleMouseOut}
        >
          <div
            style={{
              width: "70px",
              height: "70px",
              borderRadius: "20px",
              background: "#E7FBF7",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "28px",
              fontWeight: "bold",
              color: "#2EC4B6",
              marginBottom: "25px",
            }}
          >
            1
          </div>

          <h3
            style={{
              fontSize: "24px",
              marginBottom: "18px",
              color: "#2B2B2B",
            }}
          >
            Upload Image
          </h3>

          <p
            style={{
              color: "#555",
              lineHeight: "1.9",
            }}
          >
           Upload gambar gesture bahasa isyarat dari perangkat anda.
          </p>
        </div>

        <div
          style={stepStyle}
          onMouseOver={handleMouseOver}
          onMouseOut={handleMouseOut}
        >
          <div
            style={{
              width: "70px",
              height: "70px",
              borderRadius: "20px",
              background: "#E7FBF7",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "28px",
              fontWeight: "bold",
              color: "#2EC4B6",
              marginBottom: "25px",
            }}
          >
            2
          </div>

          <h3
            style={{
              fontSize: "24px",
              marginBottom: "18px",
              color: "#2B2B2B",
            }}
          >
            AI Detection
          </h3>

          <p
            style={{
              color: "#555",
              lineHeight: "1.9",
            }}
          >
            AI akan menganalisis gesture menggunakan model machine learning.
          </p>
        </div>

        <div
          style={stepStyle}
          onMouseOver={handleMouseOver}
          onMouseOut={handleMouseOut}
        >
          <div
            style={{
              width: "70px",
              height: "70px",
              borderRadius: "20px",
              background: "#E7FBF7",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "28px",
              fontWeight: "bold",
              color: "#2EC4B6",
              marginBottom: "25px",
            }}
          >
            3
          </div>

          <h3
            style={{
              fontSize: "24px",
              marginBottom: "18px",
              color: "#2B2B2B",
            }}
          >
            Get Result
          </h3>

          <p
            style={{
              color: "#555",
              lineHeight: "1.9",
            }}
          >
            Hasil deteksi bahasa isyarat akan langsung ditampilkan.
          </p>
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;