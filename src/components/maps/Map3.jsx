import { useGLTF } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import { useEffect } from "react";

export const Map3 = () => {
  const map = useGLTF("models/map-og.glb");

  useEffect(() => {
    map.scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  });

  return (
    <RigidBody colliders="trimesh" type="fixed">
      <primitive object={map.scene} />
    </RigidBody>
  );
};
useGLTF.preload("models/map-og.glb");
