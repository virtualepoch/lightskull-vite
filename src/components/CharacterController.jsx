import { useEffect, useRef, useState } from "react";
import { CapsuleCollider, RigidBody, vec3 } from "@react-three/rapier";
import { useFrame, useThree } from "@react-three/fiber";
import { isHost } from "playroomkit";
import {
  Billboard,
  CameraControls,
  Text,
  useKeyboardControls,
} from "@react-three/drei";
import { Character } from "./Character";
import { KeyControls } from "../App";

const MOVEMENT_SPEED = 10;
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
  ...props
}) => {
  const group = useRef();
  const character = useRef();
  const rigidbody = useRef();
  const controls = useRef();
  const lastShoot = useRef(0);
  const [animation, setAnimation] = useState("CharacterArmature|Idle");
  const scene = useThree((state) => state.scene);

  const forwardKeyPressed = useKeyboardControls(
    (state) => state[KeyControls.forward]
  );
  const backKeyPressed = useKeyboardControls(
    (state) => state[KeyControls.back]
  );
  const leftKeyPressed = useKeyboardControls(
    (state) => state[KeyControls.left]
  );
  const rightKeyPressed = useKeyboardControls(
    (state) => state[KeyControls.right]
  );
  const fireKeyPressed = useKeyboardControls(
    (state) => state[KeyControls.fire]
  );
  const zoomInKeyPressed = useKeyboardControls(
    (state) => state[KeyControls.zoomIn]
  );
  const zoomOutKeyPressed = useKeyboardControls(
    (state) => state[KeyControls.zoomOut]
  );
  const rotateLeftKeyPressed = useKeyboardControls(
    (state) => state[KeyControls.rotateLeft]
  );
  const rotateRightKeyPressed = useKeyboardControls(
    (state) => state[KeyControls.rotateRight]
  );

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
      const audio = new Audio("/audios/terminated.mp3");
      audio.volume = 1;
      audio.play();
    }
  }, [state.state.dead]);

  // const [cameraDistanceY, setCameraDistanceY] = useState(10);
  // const [cameraDistanceZ, setCameraDistanceZ] = useState(20);
  const [angle, setAngle] = useState(null);
  const [zoomPressed, setZoomPressed] = useState(false);

  useFrame((_, delta) => {
    // CAMERA FOLLOW
    if (controls.current) {
      // const cameraDistanceY = window.innerWidth < 1024 ? 32 : 28;
      // const cameraDistanceZ = window.innerWidth < 1024 ? 28 : 24;
      const cameraDistanceY = zoomPressed ? 4 : 10;
      const cameraDistanceZ = zoomPressed ? 4 : 20;

      const playerWorldPos = vec3(rigidbody.current.translation());
      controls.current.setLookAt(
        playerWorldPos.x,
        playerWorldPos.y + (state.state.dead ? 12 : cameraDistanceY),
        playerWorldPos.z + (state.state.dead ? 3 : cameraDistanceZ),
        playerWorldPos.x,
        playerWorldPos.y + 3.5,
        playerWorldPos.z,
        true
      );
      controls.current.azimuthAngle = angle;
    }

    // CAMERA ROTATE
    if (joystick.isPressed("rotateLeft") || rotateLeftKeyPressed) {
      setAngle(angle + 0.03);
      character.current.rotation.y = controls.current.azimuthAngle + Math.PI;
    }

    if (joystick.isPressed("rotateRight") || rotateRightKeyPressed) {
      setAngle(angle - 0.03);
      character.current.rotation.y = controls.current.azimuthAngle + Math.PI;
    }

    // CAMERA ZOOM IN
    if (joystick.isPressed("camZoomIn") || zoomInKeyPressed) {
      setZoomPressed(!zoomPressed);
    }

    // ZOOM OUT
    // if (zoomOutKeyPressed && cameraDistanceY < 40) {
    //   setCameraDistanceY(cameraDistanceY + 2);
    //   setCameraDistanceZ(
    //     cameraDistanceZ > 0 ? cameraDistanceZ + 1 : cameraDistanceZ - 1
    //   );
    // }

    if (state.state.dead) {
      setAnimation("CharacterArmature|Death");
      return;
    }

    // Update player position based on joystick state

    const joystickAngle = joystick.angle();
    const joystickPressed = joystick.isJoystickPressed();

    if (
      (joystickPressed &&
        joystickAngle >= Math.PI * 0.75 &&
        joystickAngle <= Math.PI * 1.25) ||
      forwardKeyPressed
    ) {
      setAnimation("CharacterArmature|Run");

      // Move character forward
      const impulseForward = {
        x: Math.sin(angle + Math.PI) * MOVEMENT_SPEED * delta * 100,
        y: 0,
        z: Math.cos(angle + Math.PI) * MOVEMENT_SPEED * delta * 100,
      };

      rigidbody.current.applyImpulse(impulseForward, true);
    } else if (
      (joystickPressed &&
        joystickAngle >= Math.PI * -0.25 &&
        joystickAngle <= Math.PI * 0.25) ||
      backKeyPressed
    ) {
      setAnimation("CharacterArmature|Run_Back");

      // Move character back
      const impulseBack = {
        x: Math.sin(angle) * MOVEMENT_SPEED * delta * 100,
        y: 0,
        z: Math.cos(angle) * MOVEMENT_SPEED * delta * 100,
      };

      rigidbody.current.applyImpulse(impulseBack, true);
    } else if (
      (joystickPressed &&
        joystickAngle >= Math.PI * 1.25 &&
        joystickAngle <= Math.PI * 1.5) ||
      (joystickPressed &&
        joystickAngle >= Math.PI * -0.5 &&
        joystickAngle <= Math.PI * -0.25) ||
      leftKeyPressed
    ) {
      setAnimation("CharacterArmature|Run_Left");

      // Strafe character left
      const impulseLeft = {
        x: Math.sin(angle - Math.PI / 2) * MOVEMENT_SPEED * delta * 100,
        y: 0,
        z: Math.cos(angle - Math.PI / 2) * MOVEMENT_SPEED * delta * 100,
      };

      rigidbody.current.applyImpulse(impulseLeft, true);
    } else if (
      (joystickPressed &&
        joystickAngle >= Math.PI * 0.25 &&
        joystickAngle <= Math.PI * 0.75) ||
      rightKeyPressed
    ) {
      setAnimation("CharacterArmature|Run_Right");

      // Strafe character right
      const impulseRight = {
        x: Math.sin(angle + Math.PI / 2) * MOVEMENT_SPEED * delta * 100,
        y: 0,
        z: Math.cos(angle + Math.PI / 2) * MOVEMENT_SPEED * delta * 100,
      };

      rigidbody.current.applyImpulse(impulseRight, true);
    } else {
      setAnimation("CharacterArmature|Idle");
      character.current.rotation.y = angle + Math.PI;
    }

    // Check if fire button is pressed
    if (joystick.isPressed("fire") || fireKeyPressed) {
      // fire

      if (isHost()) {
        if (Date.now() - lastShoot.current > FIRE_RATE) {
          lastShoot.current = Date.now();
          const newBullet = {
            id: state.id + "-" + +new Date(),
            position: vec3(rigidbody.current.translation()),
            angle,
            player: state.id,
          };
          onFire(newBullet);
        }
      }
    }

    if (isHost()) {
      state.setState("pos", rigidbody.current.translation());
      if (character.current) {
        state.setState("rot", character.current.rotation.y);
      }
    } else {
      const pos = state.getState("pos");
      const rot = state.getState("rot");

      if (pos) {
        rigidbody.current.setTranslation(pos);
      }
      if (rot) {
        character.current.rotation.y = rot;
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
            scale={[2, 2, 2]}
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
    <Billboard position-y={0}>
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
