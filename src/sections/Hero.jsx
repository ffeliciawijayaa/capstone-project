function Hero() {
  return (
    <section
  id="home"
  style={{
    minHeight: "100vh",
    paddingTop: "120px",
    background: "linear-gradient(to bottom, #F4FFFD, #DDF8F3)",
    display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        padding: "160px 50px 50px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: "500px",
          height: "500px",
          background: "rgba(46, 196, 182, 0.15)",
          borderRadius: "50%",
          filter: "blur(100px)",
          top: "-100px",
          right: "-100px",
        }}
      ></div>

      <div
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: "900px",
        }}
      >
        <div
          style={{
            display: "inline-block",
            padding: "10px 22px",
            background: "#E7FBF7",
            border: "1px solid #BDEEE6",
            borderRadius: "999px",
            marginBottom: "30px",
            color: "#2EC4B6",
            fontWeight: "bold",
            fontSize: "15px",
          }}
        >
          Platform Komunikasi Bahasa Isyarat Berbasis AI
        </div>

        <h1
          style={{
            fontSize: window.innerWidth < 768 ? "42px" : "58px",
            color: "#2B2B2B",
            marginBottom: "30px",
            lineHeight: "1.15",
            fontWeight: "bold",
          }}
        >
          SignBridge
<br />
<span style={{ color: "#2EC4B6" }}>
  Jembatan Komunikasi Penyandang Disabilitas
</span>
        </h1>

        <p
          style={{
            fontSize: window.innerWidth < 768 ? "17px" : "21px",
            color: "#555",
            maxWidth: "760px",
            margin: "auto",
            marginBottom: "45px",
            lineHeight: "1.9",
          }}
        >
          Platform berbasis Artificial Intelligence yang membantu
          masyarakat mempelajari dan mengenali bahasa isyarat
          secara mudah, cepat, dan real-time melalui teknologi
          deteksi visual.
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "20px",
            flexWrap: "wrap",
          }}
        >
        </div>
      </div>
    </section>
  );
}

export default Hero;