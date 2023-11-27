import { useGLTF } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import { useEffect } from "react";
import { MeshPhongMaterial, MeshStandardMaterial } from "three";

export const Map1 = () => {
  const map = useGLTF("models/map1.glb");

  const mapColor = new MeshPhongMaterial({ color: "#00aaaa" });
  mapColor.transparent = true;
  mapColor.opacity = 0.7;

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
useGLTF.preload("models/map1.glb");
