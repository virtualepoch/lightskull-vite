import { BtnMenu } from "./ui-components/BtnMenu";
import { CustomButtons } from "./ui-components/CustomButtons";
import { Leaderboard } from "./ui-components/Leaderboard";
import { Menu } from "./ui-components/Menu";
import { PlayroomControlsOverlay } from "./ui-components/PlayroomControlsOverlay";

export const UI = ({
  menuOpen,
  setMenuOpen,
  zoom,
  setZoom,
  gameMap,
  setGameMap,
}) => {
  return (
    <>
      <h1 className="version">v.0.1.12.7</h1>
      <h1 className="game-title">
        Light<span className="cross-symbol">⁜</span>Skull
      </h1>
      <Leaderboard />
      <BtnMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <Menu menuOpen={menuOpen} gameMap={gameMap} setGameMap={setGameMap} />
      <CustomButtons zoom={zoom} setZoom={setZoom} />
      <PlayroomControlsOverlay />
    </>
  );
};
