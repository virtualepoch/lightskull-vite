import { Canvas } from "@react-three/fiber";
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
import { Leaderboard } from "./components/Leaderboard";
import { ControlsOverlay } from "./components/ControlsOverlay";

export const KeyControls = {
  forward: "forward",
  back: "back",
  left: "left",
  right: "right",
  fire: "fire",
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
      { name: KeyControls.fire, keys: ["Space"] },
      { name: KeyControls.zoomIn, keys: ["ArrowUp"] },
      { name: KeyControls.zoomOut, keys: ["ArrowDown"] },
      { name: KeyControls.rotateLeft, keys: ["ArrowLeft"] },
      { name: KeyControls.rotateRight, keys: ["ArrowRight"] },
    ],
    []
  );

  const [zoom, setZoom] = useState(0);
  const [downgradedPerformance, setDowngradedPerformance] = useState(false);

  const zoomIn = () => {
    zoom < 2 ? setZoom(zoom + 1) : setZoom(0);
  };

  return (
    <>
      <button className="btn-zoom" onClick={zoomIn}></button>
      <h1 className="version">
        v.0.1.11.
        <span className="test-edit">
          {/* /////////////////////////////=VERSION=\\\\\\\\\\\\\\\\\\\\\\\\\\\\\ */}
          8
          {/* \\\\\\\\\\\\\\\\\\\\\\\\\\\\\=VERSION=///////////////////////////// */}
        </span>
      </h1>
      <h1 className="game-title">
        Light<span className="cross-symbol">⁜</span>Skull
      </h1>
      <Loader />
      <ControlsOverlay />
      <Leaderboard />
      <KeyboardControls map={map}>
        <Canvas shadows camera={{ position: [0, 100, 0], fov: 30, near: 2 }}>
          {/* <OrbitControls /> */}
          <color attach="background" args={["#000"]} />
          {/* <SoftShadows size={42} /> */}
          <PerformanceMonitor
            onDecline={(fps) => {
              setDowngradedPerformance(true);
            }}
          />

          <Suspense>
            <Physics gravity={[0, -500, 0]} interpolation={false}>
              {/* NOTE: add 'debug' prop to '<Physics>' above to add a wireframe to the rigid bodies */}
              <Experience zoom={zoom} />
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
