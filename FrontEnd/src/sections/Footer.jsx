function Footer() {
  return (
    <footer
      style={{
        background: "#0F172A",
        color: "white",
        padding: "70px 80px 40px",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "auto",
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "40px",
        }}
      >
        <div>
          <h2
            style={{
              color: "#2EC4B6",
              marginBottom: "20px",
            }}
          >
            SignAI
          </h2>

          <p
            style={{
              color: "#CBD5E1",
              lineHeight: "1.8",
              maxWidth: "350px",
            }}
          >
            Modern AI platform for sign language learning
            and communication.
          </p>
        </div>

        <div>
          <h3 style={{ marginBottom: "20px" }}>
            Navigation
          </h3>

          <ul
            style={{
              listStyle: "none",
              padding: 0,
              color: "#CBD5E1",
              lineHeight: "2",
            }}
          >
            <li>Home</li>
            <li>About</li>
            <li>Features</li>
            <li>Detection</li>
          </ul>
        </div>

        <div>
          <h3 style={{ marginBottom: "20px" }}>
            Contact
          </h3>

          <p style={{ color: "#CBD5E1" }}>
            Email: signai@example.com
          </p>

          <p style={{ color: "#CBD5E1" }}>
            Phone: +62 812-3456-7890
          </p>
        </div>
      </div>

      <div
        style={{
          borderTop: "1px solid rgba(255,255,255,0.1)",
          marginTop: "50px",
          paddingTop: "25px",
          textAlign: "center",
          color: "#94A3B8",
        }}
      >
        © 2026 SignAI. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;