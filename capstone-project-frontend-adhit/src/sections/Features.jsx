function Features() {
  const cardStyle = {
    width: "320px",
    background: "white",
    padding: "40px",
    borderRadius: "28px",
    boxShadow: "0 12px 30px rgba(0,0,0,0.05)",
    border: "1px solid #D7F2EB",
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
      id="features"
      style={{
        padding: "120px 80px",
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
            fontSize: "52px",
            color: "#2B2B2B",
            marginBottom: "20px",
          }}
        >
          Fitur
        </h2>

        <p
          style={{
            fontSize: "18px",
            color: "#666",
          }}
        >
          Fitur cerdas yang dirancang untuk meningkatkan komunikasi dan pembelajaran bahasa isyarat.
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
          style={cardStyle}
          onMouseOver={handleMouseOver}
          onMouseOut={handleMouseOut}
        >
          <h3
            style={{
              color: "#2EC4B6",
              marginBottom: "20px",
              fontSize: "24px",
            }}
          >
            Deteksi AI
          </h3>

          <p
            style={{
              color: "#555",
              lineHeight: "1.9",
            }}
          >
            Real-time AI detection untuk mengenali gesture bahasa isyarat dari gambar atau kamera.
          </p>
        </div>

        <div
          style={cardStyle}
          onMouseOver={handleMouseOver}
          onMouseOut={handleMouseOut}
        >
          <h3
            style={{
              color: "#2EC4B6",
              marginBottom: "20px",
              fontSize: "24px",
            }}
          >
            Pembelajaran Mudah
          </h3>

          <p
            style={{
              color: "#555",
              lineHeight: "1.9",
            }}
          >
            Belajar bahasa isyarat dengan tampilan sederhana dan mudah dipahami.
          </p>
        </div>

        <div
          style={cardStyle}
          onMouseOver={handleMouseOver}
          onMouseOut={handleMouseOut}
        >
          <h3
            style={{
              color: "#2EC4B6",
              marginBottom: "20px",
              fontSize: "24px",
            }}
          >
            Komunikasi Cepat
          </h3>

          <p
            style={{
              color: "#555",
              lineHeight: "1.9",
            }}
          >
            Membantu komunikasi lebih cepat antara pengguna bahasa isyarat dan masyarakat umum.
          </p>
        </div>
      </div>
    </section>
  );
}

export default Features;