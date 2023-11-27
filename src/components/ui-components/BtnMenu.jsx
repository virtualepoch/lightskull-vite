export const BtnMenu = ({ menuOpen, setMenuOpen }) => {
  return (
    <button className="btn-menu" onClick={() => setMenuOpen(!menuOpen)}>
      <div
        className="menu-bar open"
        style={{
          transform: menuOpen ? "scaleX(0)" : "scaleX(1)",
          top: "35%",
          boxShadow: menuOpen ? "none" : "0 0 5px 1px cyan",
          filter: menuOpen ? "none" : "drop-shadow(0 0 5px 1px cyan)",
        }}
      ></div>
      <div
        className="menu-bar open"
        style={{
          transform: menuOpen ? "scaleX(0)" : "scaleX(1)",
          bottom: "35%",
          boxShadow: menuOpen ? "none" : "0 0 5px 1px cyan",
          filter: menuOpen ? "none" : "drop-shadow(0 0 5px 1px cyan)",
        }}
      ></div>
      <div
        className="menu-bar close"
        style={{
          transform: menuOpen ? "scaleX(1) rotate(45deg)" : "scaleX(0)",
          boxShadow: menuOpen ? "0 0 5px 1px red" : "none",
          filter: menuOpen ? "drop-shadow(0 0 5px 1px red)" : "none",
        }}
      ></div>
      <div
        className="menu-bar close"
        style={{
          transform: menuOpen ? "scaleX(1) rotate(-45deg)" : "scaleX(0)",
          boxShadow: menuOpen ? "0 0 5px 1px red" : "none",
          filter: menuOpen ? "drop-shadow(0 0 5px 1px red)" : "none",
        }}
      ></div>
    </button>
  );
};
