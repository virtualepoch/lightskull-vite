import { Canvas } from "@react-three/fiber";
import { Experience } from "./components/Experience";
import { SoftShadows } from "@react-three/drei";
import { Suspense } from "react";
import { Physics } from "@react-three/rapier";

function App() {
  return (
    <>
      <div className="canvas-overlay">
        <h1 className="game-title">Light⁜Skull</h1>
      </div>
      <Canvas shadows camera={{ position: [0, 30, 0], fov: 30 }}>
        <color attach="background" args={["#00ffff"]} />
        <SoftShadows size={42} />
        <Suspense>
          <Physics>
            {/* NOTE: add 'debug' prop above to '<Physics>' to add a wireframe to the rigid bodies */}
            <Experience />
          </Physics>
        </Suspense>
      </Canvas>
    </>
  );
}

export default App;
