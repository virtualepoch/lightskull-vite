import { useEffect, useRef } from "react";
import { RigidBody, vec3 } from "@react-three/rapier";
import { isHost } from "playroomkit";
import { MeshBasicMaterial } from "three";
import { WEAPON_OFFSET } from "./CharacterController";

const BULLET_SPEED = 40;

const bulletMaterial = new MeshBasicMaterial({
  color: "aqua",
  toneMapped: false,
});

bulletMaterial.color.multiplyScalar(7);

export const Bullet = ({ player, angle, position, onHit, cameraRotate }) => {
  const rigidbody = useRef();
  const angleReverse = angle + Math.PI;

  useEffect(() => {
    const velocity = {
      x: Math.sin(angle) * BULLET_SPEED,
      y: 0,
      z: Math.cos(angle) * BULLET_SPEED,
    };

    const velocityReverse = {
      x: Math.sin(angleReverse) * BULLET_SPEED,
      y: 0,
      z: Math.cos(angleReverse) * BULLET_SPEED,
    };
    rigidbody.current.setLinvel(
      cameraRotate ? velocityReverse : velocity,
      true
    );

    const audio = new Audio("/audios/beam-40.mp3");
    audio.play();
  }, []);

  return (
    <group
      position={[position.x, position.y, position.z]}
      rotation-y={cameraRotate ? angleReverse : angle}
    >
      <group
        position-x={WEAPON_OFFSET.x}
        position-y={WEAPON_OFFSET.y}
        position-z={WEAPON_OFFSET.z}
      >
        <RigidBody
          ref={rigidbody}
          gravityScale={0}
          sensor
          onIntersectionEnter={(e) => {
            if (isHost() && e.other.rigidBody.userData?.type !== "bullet") {
              rigidbody.current.setEnabled(false);
              onHit(vec3(rigidbody.current.translation()));
            }
          }}
          userData={{
            type: "bullet",
            player,
            damage: 25,
          }}
        >
          <mesh
            position-z={1.5}
            material={bulletMaterial}
            castShadow
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <coneGeometry args={[0.8, 1.9, 6]} />
          </mesh>
        </RigidBody>
      </group>
    </group>
  );
};
