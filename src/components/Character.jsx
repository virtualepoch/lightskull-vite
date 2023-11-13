/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.2.15 public/models/Astronaut.glb 
*/

import { useRef, useEffect, useMemo } from "react";
import { Color, MeshBasicMaterial, MeshStandardMaterial } from "three";
import { useGraph } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import { SkeletonUtils } from "three-stdlib";

export function Character({
  color = "black",
  animation = "CharacterArmature|Idle",
  ...props
}) {
  const group = useRef();

  const { scene, materials, animations } = useGLTF("/models/Astronaut.glb");

  // Skinned meshes cannot be re-used in threejs without cloning them
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  // useGraph creates two flat object collections for nodes and materials
  const { nodes } = useGraph(clone);

  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    actions[animation].reset().fadeIn(0.2).play();
    return () => actions[animation]?.fadeOut(0.2);
  }, [animation]);

  const playerColorMaterial = useMemo(
    () => new MeshStandardMaterial({ color: new Color(color) }),
    [color]
  );

  const playerFaceAndOutline = new MeshBasicMaterial({ color: "#64ffff" });

  playerFaceAndOutline.color.multiplyScalar(2);

  console.log(actions);

  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Root_Scene">
        <group name="RootNode">
          <group
            name="CharacterArmature"
            rotation={[-Math.PI / 2, 0, 0]}
            scale={100}
          >
            <primitive object={nodes.Root} />
          </group>
          <group
            name="SpaceSuit_Feet"
            rotation={[-Math.PI / 2, 0, 0]}
            scale={100}
          >
            <skinnedMesh
              name="SpaceSuit_Feet_1"
              geometry={nodes.SpaceSuit_Feet_1.geometry}
              material={playerColorMaterial}
              skeleton={nodes.SpaceSuit_Feet_1.skeleton}
            />
            <skinnedMesh
              name="SpaceSuit_Feet_2"
              geometry={nodes.SpaceSuit_Feet_2.geometry}
              material={playerFaceAndOutline}
              skeleton={nodes.SpaceSuit_Feet_2.skeleton}
            />
          </group>
          <group
            name="SpaceSuit_Legs"
            rotation={[-Math.PI / 2, 0, 0]}
            scale={100}
          >
            <skinnedMesh
              name="SpaceSuit_Legs_1"
              geometry={nodes.SpaceSuit_Legs_1.geometry}
              material={playerFaceAndOutline}
              skeleton={nodes.SpaceSuit_Legs_1.skeleton}
            />
            <skinnedMesh
              name="SpaceSuit_Legs_2"
              geometry={nodes.SpaceSuit_Legs_2.geometry}
              material={playerColorMaterial}
              skeleton={nodes.SpaceSuit_Legs_2.skeleton}
            />
            <skinnedMesh
              name="SpaceSuit_Legs_3"
              geometry={nodes.SpaceSuit_Legs_3.geometry}
              material={playerColorMaterial}
              skeleton={nodes.SpaceSuit_Legs_3.skeleton}
            />
            <skinnedMesh
              name="SpaceSuit_Legs_4"
              geometry={nodes.SpaceSuit_Legs_4.geometry}
              material={playerColorMaterial}
              skeleton={nodes.SpaceSuit_Legs_4.skeleton}
            />
          </group>
          <group
            name="SpaceSuit_Body"
            rotation={[-Math.PI / 2, 0, 0]}
            scale={100}
          >
            <skinnedMesh
              name="SpaceSuit_Body_1"
              geometry={nodes.SpaceSuit_Body_1.geometry}
              material={playerFaceAndOutline}
              skeleton={nodes.SpaceSuit_Body_1.skeleton}
            />
            <skinnedMesh
              name="SpaceSuit_Body_2"
              geometry={nodes.SpaceSuit_Body_2.geometry}
              material={playerColorMaterial}
              skeleton={nodes.SpaceSuit_Body_2.skeleton}
            />
            <skinnedMesh
              name="SpaceSuit_Body_3"
              geometry={nodes.SpaceSuit_Body_3.geometry}
              material={playerColorMaterial}
              skeleton={nodes.SpaceSuit_Body_3.skeleton}
            />
            <skinnedMesh
              name="SpaceSuit_Body_4"
              geometry={nodes.SpaceSuit_Body_4.geometry}
              material={playerColorMaterial}
              skeleton={nodes.SpaceSuit_Body_4.skeleton}
            />
          </group>
          <group
            name="SpaceSuit_Head"
            rotation={[-Math.PI / 2, 0, 0]}
            scale={100}
          >
            <skinnedMesh
              name="SpaceSuit_Head_1"
              geometry={nodes.SpaceSuit_Head_1.geometry}
              material={playerColorMaterial}
              skeleton={nodes.SpaceSuit_Head_1.skeleton}
            />
            <skinnedMesh
              name="SpaceSuit_Head_2"
              geometry={nodes.SpaceSuit_Head_2.geometry}
              material={playerColorMaterial}
              skeleton={nodes.SpaceSuit_Head_2.skeleton}
            />
            <skinnedMesh
              name="SpaceSuit_Head_3"
              geometry={nodes.SpaceSuit_Head_3.geometry}
              material={playerFaceAndOutline}
              skeleton={nodes.SpaceSuit_Head_3.skeleton}
            />
          </group>
        </group>
      </group>
    </group>
  );
}

useGLTF.preload("/models/Astronaut.glb");
