import { BtnMenu } from "./BtnMenu";
import { Menu } from "./Menu";

export const UI = ({ menuOpen, setMenuOpen, zoom, setZoom }) => {
  console.log(menuOpen);
  return (
    <>
      {/* OVERLAY FOR GAME INFO, TITLE, LOGO */}
      <h1 className="version">v.0.1.12.4</h1>
      <h1 className="game-title">
        Light<span className="cross-symbol">⁜</span>Skull
      </h1>
      {/* BUTTONS */}
      <BtnMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <Menu menuOpen={menuOpen} />
      <div className="zoom-btns">
        <button
          className="btn-zoom-out"
          onClick={() => {
            if (zoom > 0) setZoom(zoom - 1);
          }}
        ></button>
        <button
          className="btn-zoom-in"
          onClick={() => {
            if (zoom < 3) setZoom(zoom + 1);
          }}
        ></button>
      </div>
      <div className="controls-overlay">
        <div className="btn jump"></div>
        <div className="btn rotate-right"></div>
        <div className="btn fire"></div>
        <div className="btn rotate-left"></div>
      </div>
    </>
  );
};
