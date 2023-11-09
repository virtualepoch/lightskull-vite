import { Canvas } from "@react-three/fiber";
import { Experience } from "./components/Experience";
import { Loader, SoftShadows } from "@react-three/drei";
import { Suspense } from "react";
import { Physics } from "@react-three/rapier";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { Leaderboard } from "./components/Leaderboard";

function App() {
  return (
    <>
      <div className="canvas-overlay">
        <h1 className="game-title">Light<span className="cross-symbol">⁜</span>Skull</h1>
      </div>
      <Loader />
      <Leaderboard />
      <Canvas shadows camera={{ position: [0, 30, 0], fov: 30, near: 2 }}>
        <color attach="background" args={["#00ffff"]} />
        <SoftShadows size={42} />
        <Suspense>
          <Physics>
            {/* NOTE: add 'debug' prop above to '<Physics>' to add a wireframe to the rigid bodies */}
            <Experience />
          </Physics>
        </Suspense>
        <EffectComposer disableNormalPass>
          <Bloom luminanceThreshold={1} intensity={1.5} mipmapBlur />
        </EffectComposer>
      </Canvas>
    </>
  );
}

export default App;
