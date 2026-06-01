function About() {
  return (
    <section
     id="about"
      style={{
        padding: "120px 80px",
        background: "white",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "auto",
          display: "flex",
          gap: "60px",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
        }}
      >
        <div style={{ flex: 1 }}>
          <div
            style={{
              width: "120px",
              height: "120px",
              background: "#CDEFE8",
              borderRadius: "25px",
            }}
          ></div>
        </div>

        <div style={{ flex: 1 }}>
          <h2
            style={{
              fontSize: "48px",
              color: "#2B2B2B",
              marginBottom: "25px",
            }}
          >
            About The Project
          </h2>

          <p
            style={{
              fontSize: "18px",
              color: "#555",
              lineHeight: "1.9",
              marginBottom: "20px",
            }}
          >
             SignAI adalah platform berbasis Artificial Intelligence
              yang membantu pengguna mempelajari dan mendeteksi
              bahasa isyarat dengan lebih mudah dan interaktif.
          </p>

          <p
            style={{
              fontSize: "18px",
              color: "#555",
              lineHeight: "1.9",
            }}
          >
            Platform ini dibuat untuk meningkatkan komunikasi
            antara penyandang tunarungu dan masyarakat umum
            menggunakan teknologi AI modern.
          </p>
        </div>
      </div>
    </section>
  );
}

export default About;