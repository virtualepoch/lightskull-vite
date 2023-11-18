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
import { Suspense, useState } from "react";
import { Physics } from "@react-three/rapier";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { Leaderboard } from "./components/Leaderboard";
import { CamControls } from "./components/CamControls";

function App() {
  const [downgradedPerformance, setDowngradedPerformance] = useState(false);

  return (
    <>
      <Loader />
      <h1 className="game-title">
        Light<span className="cross-symbol">⁜</span>Skull
      </h1>
      <CamControls />
      {/* <div className="logo"></div> */}
      <Leaderboard />
      <Canvas shadows camera={{ position: [0, 30, 0], fov: 30, near: 2 }}>
        {/* <OrbitControls /> */}
        <color attach="background" args={["#000"]} />
        {/* <SoftShadows size={42} /> */}
        <PerformanceMonitor
          onDecline={(fps) => {
            setDowngradedPerformance(true);
          }}
        />

        <Suspense>
          <Physics>
            {/* NOTE: add 'debug' prop to '<Physics>' above to add a wireframe to the rigid bodies */}
            <Experience />
          </Physics>
        </Suspense>

        {!downgradedPerformance && (
          // disable the postprocessing and stars on low-end devices
          <>
            <EffectComposer disableNormalPass>
              <Bloom luminanceThreshold={1} intensity={1.5} mipmapBlur />
            </EffectComposer>
          </>
        )}
        <Sparkles
          count={5000}
          speed={0.5}
          opacity={1.5}
          color={50}
          size={5}
          scale={[34, 10, 100]}
          noise={0.5}
          position={[1.6, 6, -20]}
        />
      </Canvas>
    </>
  );
}

export default App;
