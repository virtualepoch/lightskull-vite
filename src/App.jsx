import { Canvas } from "@react-three/fiber";
import { Experience } from "./components/Experience";
import {
  Loader,
  OrbitControls,
  PerformanceMonitor,
  SoftShadows,
} from "@react-three/drei";
import { Suspense, useState } from "react";
import { Physics } from "@react-three/rapier";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { Leaderboard } from "./components/Leaderboard";

function App() {
  // const [downgradedPerformance, setDowngradedPerformance] = useState(false);
  return (
    <>
      <Loader />
      <div className="canvas-overlay">
        <h1 className="game-title">
          Light<span className="cross-symbol">⁜</span>Skull
        </h1>
      </div>
      <Leaderboard />
      <Canvas shadows camera={{ position: [0, 10, 0], fov: 30, near: 2 }}>
        {/* <OrbitControls /> */}
        <color attach="background" args={["#000"]} />
        {/* <SoftShadows size={42} /> */}
        {/* <PerformanceMonitor
          onDecline={(fps) => {
            setDowngradedPerformance(true);
          }}
        /> */}

        <Suspense>
          <Physics>
            {/* NOTE: add 'debug' prop to '<Physics>' above to add a wireframe to the rigid bodies */}
            <Experience />
          </Physics>
        </Suspense>

        {/* {!downgradedPerformance && ( */}
        {/* // disable the postprocessing on low-end devices */}
        <EffectComposer disableNormalPass>
          <Bloom luminanceThreshold={1} intensity={1.5} mipmapBlur />
        </EffectComposer>
        {/* )} */}
      </Canvas>
    </>
  );
}

export default App;
