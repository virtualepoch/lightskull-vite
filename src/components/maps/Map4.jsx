import { useGLTF } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import { useEffect } from "react";
import { MeshStandardMaterial } from "three";

export const Map4 = () => {
  const map = useGLTF("models/map-og.glb");

  const mapColor = new MeshStandardMaterial({ color: "#00aaaa" });

  useEffect(() => {
    map.scene.traverse((child) => {
      if (child.isMesh) {
        child.material = mapColor;
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
