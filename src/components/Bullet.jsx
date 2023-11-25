import { useEffect, useRef } from "react";
import { RigidBody, vec3 } from "@react-three/rapier";
import { isHost } from "playroomkit";
import { MeshBasicMaterial } from "three";
import { WEAPON_OFFSET } from "./CharacterController";

const BULLET_SPEED = 70;

const bulletMaterial = new MeshBasicMaterial({
  color: "aqua",
  toneMapped: false,
});

bulletMaterial.color.multiplyScalar(7);

export const Bullet = ({ player, angle, keyboardAngle, position, onHit }) => {
  const rigidbody = useRef();

  useEffect(() => {
    const velocity = {
      x: Math.sin(angle + Math.PI || keyboardAngle) * BULLET_SPEED,
      y: 0,
      z: Math.cos(angle + Math.PI || keyboardAngle) * BULLET_SPEED,
    };

    rigidbody.current.setLinvel(velocity, true);

    const audio = new Audio("/audios/light-bolt.mp3");
    audio.play();
    audio.volume = 0.5;
  }, []);

  return (
    <group
      position={[position.x, position.y, position.z]}
      rotation-y={angle + Math.PI}
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
