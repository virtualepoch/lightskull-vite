import * as THREE from "three";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Experience } from "./components/Experience";
import {
  Loader,
  OrbitControls,
  PerformanceMonitor,
  SoftShadows,
  KeyboardControls,
  Stars,
  Sparkles,
} from "@react-three/drei";
import { useMemo, Suspense, useState } from "react";
import { Physics } from "@react-three/rapier";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { Leaderboard } from "./components/ui-components/Leaderboard";
import { UI } from "./components/UI";
import background from "./assets/images/bg-1.jpg";
import { useRef } from "react";

export const KeyControls = {
  forward: "forward",
  back: "back",
  left: "left",
  right: "right",
  fire: "fire",
  jump: "jump",
  zoomIn: "zoom-in",
  zoomOut: "zoom-out",
  rotateLeft: "rotate-left",
  rotateRight: "rotate-right",
};

function App() {
  const map = useMemo(
    () => [
      { name: KeyControls.forward, keys: ["KeyW"] },
      { name: KeyControls.back, keys: ["KeyS"] },
      { name: KeyControls.left, keys: ["KeyA"] },
      { name: KeyControls.right, keys: ["KeyD"] },
      { name: KeyControls.fire, keys: ["ArrowUp"] },
      { name: KeyControls.jump, keys: ["Space"] },
      { name: KeyControls.zoomIn, keys: ["ControlRight"] },
      { name: KeyControls.zoomOut, keys: ["ArrowDown"] },
      { name: KeyControls.rotateLeft, keys: ["ArrowLeft"] },
      { name: KeyControls.rotateRight, keys: ["ArrowRight"] },
    ],
    []
  );

  const Earth = () => {
    // function textureChanger() {
    //   if (window.innerWidth < 700) {
    //     return earth500;
    //   } else {
    //     return earth8k;
    //   }
    // }

    const texture = useLoader(THREE.TextureLoader, background);
    const earthRef = useRef(null);

    // useFrame(() => {
    //   earthRef.current.rotation.y += 0.002;
    // });

    return (
      <mesh ref={earthRef} position={[0, 0, 0]}>
        <sphereGeometry args={[180, 10, 10]} />
        <meshStandardMaterial map={texture} side={THREE.BackSide} />
      </mesh>
    );
  };

  const [menuOpen, setMenuOpen] = useState(false);
  const [gameMap, setGameMap] = useState("map-1");
  const [zoom, setZoom] = useState(0);
  const [downgradedPerformance, setDowngradedPerformance] = useState(false);

  return (
    <>
      <Loader />
      <UI
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        zoom={zoom}
        setZoom={setZoom}
        gameMap={gameMap}
        setGameMap={setGameMap}
      />
      <KeyboardControls map={map}>
        <Canvas shadows camera={{ position: [0, 100, 0], fov: 30, near: 2 }}>
          {/* <ambientLight intensity={1} /> */}
          <Earth />
          {/* <OrbitControls /> */}
          <color attach="background" args={["#000"]} />
          {/* <SoftShadows size={42} /> */}
          <PerformanceMonitor
            onDecline={(fps) => {
              setDowngradedPerformance(true);
            }}
          />

          <Suspense>
            <Physics gravity={[0, -200, 0]} interpolation={false}>
              {/* NOTE: add 'debug' prop to '<Physics>' above to add a wireframe to the rigid bodies */}
              <Experience zoom={zoom} setZoom={setZoom} gameMap={gameMap} />
            </Physics>
          </Suspense>

          {!downgradedPerformance && (
            // disable the postprocessing and stars on low-end devices
            <>
              <EffectComposer disableNormalPass>
                <Bloom luminanceThreshold={1} intensity={1.5} mipmapBlur />
              </EffectComposer>
              {/* <Sparkles
                count={5000}
                speed={0.5}
                opacity={1.5}
                color={50}
                size={5}
                scale={[34, 10, 100]}
                noise={0.5}
                position={[1.6, 6, -20]}
              /> */}
            </>
          )}
        </Canvas>
      </KeyboardControls>
    </>
  );
}

export default App;
