import { useEffect, useRef, useState } from "react";
import { CapsuleCollider, RigidBody, vec3 } from "@react-three/rapier";
import { useFrame, useThree } from "@react-three/fiber";
import { isHost } from "playroomkit";
import { Billboard, CameraControls, Text } from "@react-three/drei";
import { Character } from "./Character";

const MOVEMENT_SPEED = 7;
const FIRE_RATE = 380;

export const WEAPON_OFFSET = {
  x: 0,
  y: 2.6,
  z: 0,
};

export const CharacterController = ({
  state,
  joystick,
  userPlayer,
  onFire,
  onKilled,
  cameraRotate,
  setCameraRotate,
  ...props
}) => {
  const group = useRef();
  const character = useRef();
  const rigidbody = useRef();
  const controls = useRef();
  const lastShoot = useRef(0);
  const [animation, setAnimation] = useState("CharacterArmature|Idle");
  const [cameraDistanceZ, setCameraDistanceZ] = useState(30);
  const [cameraDistanceY, setCameraDistanceY] = useState(40);

  const scene = useThree((state) => state.scene);

  const spawnRandomly = () => {
    const spawns = [];
    for (let i = 0; i < 1000; i++) {
      const spawn = scene.getObjectByName(`spawn_${i}`);
      if (spawn) {
        spawns.push(spawn);
      } else {
        break;
      }
    }
    const spawnPos = spawns[Math.floor(Math.random() * spawns.length)].position;
    rigidbody.current.setTranslation(spawnPos);
  };

  useEffect(() => {
    if (isHost()) {
      spawnRandomly();
    }
  }, []);

  useEffect(() => {
    if (state.state.dead) {
      const audio = new Audio("/audios/doh.mp3");
      audio.volume = 1;
      audio.play();
    }
  }, [state.state.dead]);

  useFrame((_, delta) => {
    // CAMERA FOLLOW

    if (controls.current) {
      // const cameraDistanceY = window.innerWidth < 1024 ? 32 : 28;
      // const cameraDistanceZ = window.innerWidth < 1024 ? 28 : 24;

      if (joystick.isPressed("camRotate")) {
        setCameraDistanceZ(-cameraDistanceZ);
        setCameraRotate(!cameraRotate);
      }

      if (joystick.isPressed("camZoomIn")) {
        if (cameraRotate && cameraDistanceY > 5 && cameraDistanceZ < -4) {
          setCameraDistanceZ(cameraDistanceZ + 1);
          setCameraDistanceY(cameraDistanceY - 2);
        }
        if (!cameraRotate && cameraDistanceY > 5 && cameraDistanceZ > 4) {
          setCameraDistanceZ(cameraDistanceZ - 1);
          setCameraDistanceY(cameraDistanceY - 2);
        }
      }

      if (joystick.isPressed("camZoomOut")) {
        if (cameraRotate && cameraDistanceY < 40 && cameraDistanceZ > -30) {
          setCameraDistanceZ(cameraDistanceZ - 1);
          setCameraDistanceY(cameraDistanceY + 2);
        }
        if (!cameraRotate && cameraDistanceY < 40 && cameraDistanceZ < 30) {
          setCameraDistanceZ(cameraDistanceZ + 1);
          setCameraDistanceY(cameraDistanceY + 2);
        }
      }

      const playerWorldPos = vec3(rigidbody.current.translation());
      controls.current.setLookAt(
        playerWorldPos.x,
        playerWorldPos.y + (state.state.dead ? 12 : cameraDistanceY),
        playerWorldPos.z + (state.state.dead ? 3 : cameraDistanceZ),
        playerWorldPos.x,
        playerWorldPos.y + 1.5,
        playerWorldPos.z,
        true
      );
    }

    if (state.state.dead) {
      setAnimation("CharacterArmature|Death");
      return;
    }

    // Update player position based on joystick state
    const angle = joystick.angle();
    const angleReverse = joystick.angle() + Math.PI;

    if (joystick.isJoystickPressed() && angle) {
      setAnimation("CharacterArmature|Run");

      if (cameraRotate) {
        character.current.rotation.y = angleReverse;
      } else {
        character.current.rotation.y = angle;
      }

      // Move character in right direction
      const impulse = {
        x: Math.sin(angle) * MOVEMENT_SPEED * delta * 100,
        y: 0,
        z: Math.cos(angle) * MOVEMENT_SPEED * delta * 100,
      };
      const impulseReverse = {
        x: Math.sin(angleReverse) * MOVEMENT_SPEED * delta * 100,
        y: 0,
        z: Math.cos(angleReverse) * MOVEMENT_SPEED * delta * 100,
      };
      rigidbody.current.applyImpulse(
        cameraRotate ? impulseReverse : impulse,
        true
      );
    } else {
      setAnimation("CharacterArmature|Idle");
    }

    if (isHost()) {
      state.setState("pos", rigidbody.current.translation());
    } else {
      const pos = state.getState("pos");
      if (pos) {
        rigidbody.current.setTranslation(pos);
      }
    }

    // Check if fire button is pressed
    if (joystick.isPressed("fire")) {
      // fire
      if (joystick.isJoystickPressed() && angle) {
        setAnimation("CharacterArmature|Run");
      } else {
        setAnimation("CharacterArmature|HitRecieve_2");
      }
      if (isHost()) {
        if (Date.now() - lastShoot.current > FIRE_RATE) {
          lastShoot.current = Date.now();
          const newBullet = {
            id: state.id + "-" + +new Date(),
            position: vec3(rigidbody.current.translation()),
            angle,
            angleReverse,
            player: state.id,
          };
          onFire(newBullet);
        }
      }
    }
  });

  return (
    <group ref={group} {...props}>
      {userPlayer && <CameraControls ref={controls} />}

      <RigidBody
        ref={rigidbody}
        colliders={false}
        linearDamping={12}
        lockRotations
        type={isHost() ? "dynamic" : "kinematicPosition"}
        onIntersectionEnter={({ other }) => {
          if (
            isHost() &&
            other.rigidBody.userData.type === "bullet" &&
            state.state.health > 0
          ) {
            const newHealth =
              state.state.health - other.rigidBody.userData.damage;
            if (newHealth <= 0) {
              state.setState("deaths", state.state.deaths + 1);
              state.setState("dead", true);
              state.setState("health", 0);
              rigidbody.current.setEnabled(false);

              setTimeout(() => {
                spawnRandomly();
                rigidbody.current.setEnabled(true);
                state.setState("health", 100);
                state.setState("dead", false);
              }, 2000);

              onKilled(state.id, other.rigidBody.userData.player);
            } else {
              state.setState("health", newHealth);
            }
          }
        }}
      >
        <PlayerInfo state={state.state} />
        <group ref={character}>
          <Character
            color={state.state.profile?.color}
            animation={animation}
            scale={[2.5, 2, 2.9]}
            position={[0, -0.4, 0]}
          />
          {userPlayer && (
            <Crosshair
              position={[WEAPON_OFFSET.x, WEAPON_OFFSET.y, WEAPON_OFFSET.z]}
            />
          )}
        </group>
        <CapsuleCollider args={[1.4, 0.8]} position={[0, 1.8, 0]} />
      </RigidBody>
    </group>
  );
};

const Crosshair = (props) => {
  return (
    <group {...props}>
      <mesh position-z={1}>
        <boxGeometry args={[0.05, 0.05, 0.05]} />
        <meshBasicMaterial color="aqua" transparent opacity={0.9} />
      </mesh>
      <mesh position-z={2}>
        <boxGeometry args={[0.05, 0.05, 0.05]} />
        <meshBasicMaterial color="aqua" transparent opacity={0.85} />
      </mesh>
      <mesh position-z={3}>
        <boxGeometry args={[0.05, 0.05, 0.05]} />
        <meshBasicMaterial color="aqua" transparent opacity={0.8} />
      </mesh>

      <mesh position-z={4.5}>
        <boxGeometry args={[0.05, 0.05, 0.05]} />
        <meshBasicMaterial color="aqua" opacity={0.7} transparent />
      </mesh>

      <mesh position-z={6.5}>
        <boxGeometry args={[0.05, 0.05, 0.05]} />
        <meshBasicMaterial color="aqua" opacity={0.6} transparent />
      </mesh>

      <mesh position-z={9}>
        <boxGeometry args={[0.05, 0.05, 0.05]} />
        <meshBasicMaterial color="aqua" opacity={0.2} transparent />
      </mesh>
    </group>
  );
};

const PlayerInfo = ({ state }) => {
  const health = state.health;
  const name = state.profile.name;

  return (
    <Billboard position-y={3.7}>
      <Text position-y={0.36} fontSize={0.4}>
        {name}
        <meshBasicMaterial color={state.profile.color} />
      </Text>
      <mesh position-z={-0.1}>
        <planeGeometry args={[1, 0.2]} />
        <meshBasicMaterial color="black" transparent opacity={0.5} />
      </mesh>
      <mesh scale-x={health / 100} position-x={-0.5 * (1 - health / 100)}>
        <planeGeometry args={[1, 0.2]} />
        <meshBasicMaterial color={health < 51 ? "#ff0000" : "#00ff00"} />
      </mesh>
    </Billboard>
  );
};
