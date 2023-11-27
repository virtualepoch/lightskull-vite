import { CSSTransition } from "react-transition-group";

export const Menu = ({ menuOpen, gameMap, setGameMap }) => {
  console.log(window);
  return (
    <CSSTransition in={menuOpen} unmountOnExit timeout={500} classNames="menu">
      <nav className="menu">
        <header className="menu-header">
          <h1>Menu:</h1>
          <h2>Maps</h2>
        </header>
        <section className="maps">
          <button
            className={gameMap === "map-1" ? "map-btn active" : "map-btn"}
            onClick={() => setGameMap("map-1")}
          >
            Map - 1
            <br />
            Tap / Click to Select
          </button>
          <button
            className={gameMap === "map-2" ? "map-btn active" : "map-btn"}
            onClick={() => setGameMap("map-2")}
          >
            Map - 2
            <br />
            Tap / Click to Select
          </button>

          <button
            className={gameMap === "map-3" ? "map-btn active" : "map-btn"}
            onClick={() => setGameMap("map-3")}
          >
            Map - 3
            <br />
            Tap / Click to Select
          </button>
          <button
            className={gameMap === "map-4" ? "map-btn active" : "map-btn"}
            onClick={() => setGameMap("map-4")}
          >
            Map - 4
            <br />
            Tap / Click to Select
          </button>
          <button
            className={gameMap === "map-4" ? "map-btn active" : "map-btn"}
            onClick={() => setGameMap("map-4")}
          >
            Map - 4
            <br />
            Tap / Click to Select
          </button>
          <button
            className={gameMap === "map-4" ? "map-btn active" : "map-btn"}
            onClick={() => setGameMap("map-4")}
          >
            Map - 4
            <br />
            Tap / Click to Select
          </button>
        </section>
      </nav>
    </CSSTransition>
  );
};
