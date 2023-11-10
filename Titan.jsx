/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.2.14 public/models/ancient_titan.glb -0 src/components/Titan.jsx 
Author: Kaan Tezcan (https://sketchfab.com/kaanpirate)
License: CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
Source: https://sketchfab.com/3d-models/free-game-character-ancient-titan-vol2-0e71dd1a27a2455b9adae83082905958
Title: Free Game Character - Ancient Titan Vol2
*/

import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'

export function Titan(props) {
  const { nodes, materials } = useGLTF('/models/ancient_titan.glb')
  return (
    <group {...props} dispose={null}>
      <group scale={0.04}>
        <group rotation={[-Math.PI / 2, 0, 0]} scale={100}>
          <primitive object={nodes._rootJoint} />
          <skinnedMesh geometry={nodes.Object_7.geometry} material={materials['LegArmor.001']} skeleton={nodes.Object_7.skeleton} />
          <skinnedMesh geometry={nodes.Object_9.geometry} material={materials['ChestArmor.001']} skeleton={nodes.Object_9.skeleton} />
          <skinnedMesh geometry={nodes.Object_11.geometry} material={materials['ArmArmor.001']} skeleton={nodes.Object_11.skeleton} />
          <skinnedMesh geometry={nodes.Object_13.geometry} material={materials['HelmetnKnife.001']} skeleton={nodes.Object_13.skeleton} />
          <skinnedMesh geometry={nodes.Object_15.geometry} material={materials['Head.001']} skeleton={nodes.Object_15.skeleton} />
        </group>
      </group>
    </group>
  )
}

useGLTF.preload('/models/ancient_titan.glb')
