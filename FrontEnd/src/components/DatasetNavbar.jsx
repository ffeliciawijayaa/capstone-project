import { Link } from "react-router-dom";

function DatasetNavbar() {

  const navItemStyle = {
    cursor: "pointer",
    transition: "all 0.3s ease",
  };

  const handleMouseOver = (e) => {
    e.target.style.color = "#2EC4B6";
  };

  const handleMouseOut = (e) => {
    e.target.style.color = "#2B2B2B";
  };

  return (
    <nav
      style={{
        width: "100%",
        padding: "20px 70px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "fixed",
        top: 0,
        background: "rgba(255,255,255,0.45)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid #D7F2EB",
        zIndex: 1000,
      }}
    >
      <Link
        to="/"
        style={{
          textDecoration: "none",
        }}
      >
        <h2
          style={{
            fontSize: "30px",
            fontWeight: "bold",
            color: "#2EC4B6",
            cursor: "pointer",
          }}
        >
          SignBridge
        </h2>
      </Link>

      <ul
        style={{
          listStyle: "none",
          display: "flex",
          alignItems: "center",
          margin: 0,
          padding: 0,
          fontSize: "17px",
          color: "#2B2B2B",
        }}
      >
        <li
          style={navItemStyle}
          onMouseOver={handleMouseOver}
          onMouseOut={handleMouseOut}
        >
          <Link
            to="/"
            style={{
              textDecoration: "none",
              color: "inherit",
            }}
          >
            Beranda
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default DatasetNavbar;