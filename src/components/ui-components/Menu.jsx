import { CSSTransition } from "react-transition-group";

export const Menu = ({ menuOpen, gameMap, setGameMap }) => {
  return (
    <CSSTransition in={menuOpen} unmountOnExit timeout={500} classNames="menu">
      <nav className="menu">
        <h1 className="menu-header">Menu</h1>
          <h2 className="sub-menu-header">Maps</h2>
        <section className="maps">
          <button
            className={gameMap === "map-1" ? "map-btn active" : "map-btn"}
            onClick={() => setGameMap("map-1")}
          >
            Map - 1
          </button>
          <button
            className={gameMap === "map-2" ? "map-btn active" : "map-btn"}
            onClick={() => setGameMap("map-2")}
          >
            Map - 2
          </button>

          <button
            className={gameMap === "map-3" ? "map-btn active" : "map-btn"}
            onClick={() => setGameMap("map-3")}
          >
            Map - 3
          </button>
          <button
            className={gameMap === "map-4" ? "map-btn active" : "map-btn"}
            onClick={() => setGameMap("map-4")}
          >
            Map - 4
          </button>
        </section>
      </nav>
    </CSSTransition>
  );
};
