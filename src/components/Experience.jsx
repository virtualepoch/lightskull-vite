import { Environment } from "@react-three/drei";
import { Map1 } from "./maps/Map1";
import { useEffect, useState } from "react";
import {
  Joystick,
  insertCoin,
  isHost,
  myPlayer,
  onPlayerJoin,
  useMultiplayerState,
} from "playroomkit";
import { CharacterController } from "./CharacterController";
import { Bullet } from "./Bullet";
import { BulletHit } from "./BulletHit";
import { Map2 } from "./maps/Map2";
import { Map3 } from "./maps/Map3";
import { Map4 } from "./maps/Map4";

export const Experience = ({ zoom, setZoom, gameMap }) => {
  const [players, setPlayers] = useState([]);
  const [bullets, setBullets] = useState([]);
  const [networkBullets, setNetworkBullets] = useMultiplayerState(
    "bullets",
    []
  );
  const [hits, setHits] = useState([]);
  const [networkHits, setNetworkHits] = useMultiplayerState("hits", []);

  const onFire = (bullet) => {
    setBullets((bullets) => [...bullets, bullet]);
  };

  const onHit = (bulletId, position) => {
    setBullets((bullets) => bullets.filter((b) => b.id !== bulletId));
    setHits((hits) => [...hits, { id: bulletId, position }]);
  };

  const onEnded = (hitId) => [
    setHits((hits) => hits.filter((h) => h.id !== hitId)),
  ];

  useEffect(() => {
    setNetworkBullets(bullets);
  }, [bullets]);

  useEffect(() => {
    setNetworkHits(hits);
  }, [hits]);

  const start = async () => {
    // Show Playroom UI, let it handle players joining etc and wait for host to tap "Launch"
    await insertCoin();
    const audio = new Audio("/audios/lucky-punk.mp3");
    audio.play();
    const audio2 = new Audio("/audios/bg-cyber.mp3");
    audio2.volume = 0.5;
    audio2.addEventListener("ended", () => {
      audio2.currentTime = 0;
      audio2.play();
    });
  };

  useEffect(() => {
    start();

    // Create a joystick controller for each joining player
    onPlayerJoin((state) => {
      // Joystick will only create UI for current player (myPlayer)
      // For others, it will only sync their state
      // btn symbols ⨂🥽🎥📽▶
      const joystick = new Joystick(state, {
        type: "angular",
        buttons: [
          { id: "rotateLeft", label: "" },
          { id: "fire", label: "" },
          { id: "rotateRight", label: "" },
          { id: "jump", label: "" },
        ],
      });
      const newPlayer = { state, joystick };
      state.setState("health", 100);
      state.setState("deaths", 0);
      state.setState("kills", 0);
      setPlayers((players) => [...players, newPlayer]);

      state.onQuit(() => {
        setPlayers((players) => players.filter((p) => p.state.id !== state.id));
      });
    });
  }, []);

  const onKilled = (_victim, killer) => {
    const killerState = players.find((p) => p.state.id === killer).state;
    killerState.setState("kills", killerState.state.kills + 1);
  };

  return (
    <>
      {gameMap === "map-2" ? (
        <Map2 />
      ) : gameMap === "map-3" ? (
        <Map3 />
      ) : gameMap === "map-4" ? (
        <Map4 />
      ) : (
        <Map1 />
      )}

      {players.map(({ state, joystick }, idx) => (
        <CharacterController
          key={state.id}
          state={state}
          joystick={joystick}
          userPlayer={state.id === myPlayer()?.id}
          onFire={onFire}
          onKilled={onKilled}
          zoom={zoom}
          setZoom={setZoom}
          gameMap={gameMap}
        />
      ))}

      {(isHost() ? bullets : networkBullets).map((bullet) => (
        <Bullet
          key={bullet.id}
          {...bullet}
          onHit={(position) => onHit(bullet.id, position)}
        />
      ))}

      {(isHost() ? hits : networkHits).map((hit) => (
        <BulletHit key={hit.id} {...hit} onEnded={() => onEnded(hit.id)} />
      ))}


      <Environment preset="sunset" />
    </>
  );
};
