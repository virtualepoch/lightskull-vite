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

const MOVEMENT_SPEED = 25;
const JUMP_VELOCITY = 10;
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
  zoom,
  ...props
}) => {
  const group = useRef();
  const character = useRef();
  const rigidbody = useRef();
  const controls = useRef();
  const lastShoot = useRef(0);
  const [animation, setAnimation] = useState("CharacterArmature|Idle");
  const scene = useThree((state) => state.scene);

  // KEYBOARD CONTROLS
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

  const [angle, setAngle] = useState(null);

  useFrame((_, delta) => {
    // CAMERA FOLLOW
    if (controls.current) {
      // const cameraDistanceY = window.innerWidth < 1024 ? 32 : 28;
      // const cameraDistanceZ = window.innerWidth < 1024 ? 28 : 24;

      const cameraDistanceY =
        zoom === 0 ? 30 : zoom === 1 ? 20 : zoom === 2 ? 10 : 4;
      const cameraDistanceZ =
        zoom === 0 ? 80 : zoom === 1 ? 40 : zoom === 2 ? 20 : 3;

      const playerWorldPos = vec3(rigidbody.current.translation());
      controls.current.setLookAt(
        playerWorldPos.x,
        playerWorldPos.y + (state.state.dead ? 80 : cameraDistanceY),
        playerWorldPos.z + (state.state.dead ? 0 : cameraDistanceZ),
        playerWorldPos.x,
        playerWorldPos.y + 3.5,
        playerWorldPos.z,
        true
      );
      controls.current.rotateAzimuthTo(character.current.rotation.y + Math.PI);
    }
    setAnimation("CharacterArmature|Idle");
    character.current.rotation.y = angle + Math.PI;

    // CAMERA ROTATE
    if (joystick.isPressed("rotateLeft") || rotateLeftKeyPressed) {
      setAngle(angle + 0.03);
      setAnimation("CharacterArmature|Walk");
    }

    if (joystick.isPressed("rotateRight") || rotateRightKeyPressed) {
      setAngle(angle - 0.03);
      setAnimation("CharacterArmature|Walk");
    }

    // JUMP
    if (joystick.isPressed("jump") || zoomInKeyPressed) {
      setAnimation("CharacterArmature|Walk");
      const impulseUp = {
        x: 0,
        y: JUMP_VELOCITY * delta * 700,
        z: 0,
      };
      if (rigidbody.current.translation().y < 100) {
        rigidbody.current.applyImpulse(impulseUp, true);
      }
    }

    // UPDATE PLAYER POSITION BASED ON JOYSTICK STATE //
    const joystickAngle = joystick.angle();
    const joystickPressed = joystick.isJoystickPressed();

    // DETERMINE JOYSTICK POSITION: FORWARD ////////////////////////////////////////////////////////
    if (
      (joystickPressed &&
        joystickAngle >= Math.PI * 0.875 &&
        joystickAngle <= Math.PI * 1.125) ||
      forwardKeyPressed
    ) {
      // SET ANIMATION: RUN FORWARD
      setAnimation("CharacterArmature|Run");

      // SET IMPULSE DIRECTION AND FORCE: FORWARD
      const impulseForward = {
        x: Math.sin(angle + Math.PI) * MOVEMENT_SPEED * delta * 100,
        y: 0,
        z: Math.cos(angle + Math.PI) * MOVEMENT_SPEED * delta * 100,
      };

      // APPLY IMPULSE FORWARD (Move character forward)
      rigidbody.current.applyImpulse(impulseForward, true);
    }

    // DETERMINE JOYSTICK POSITION: FORWARD-LEFT ////////////////////////////////////////////////////////
    if (
      joystickPressed &&
      joystickAngle > Math.PI * 1.125 &&
      joystickAngle <= Math.PI * 1.375
    ) {
      // SET ANIMATION: RUN FORWARD-LEFT
      setAnimation("CharacterArmature|Run");

      // SET IMPULSE DIRECTION AND FORCE: FORWARD-LEFT
      const impulseForwardLeft = {
        x: Math.sin(angle + Math.PI * 1.25) * MOVEMENT_SPEED * delta * 100,
        y: 0,
        z: Math.cos(angle + Math.PI * 1.25) * MOVEMENT_SPEED * delta * 100,
      };

      // APPLY IMPULSE FORWARD-LEFT (Move character left)
      rigidbody.current.applyImpulse(impulseForwardLeft, true);
    }

    // DETERMINE JOYSTICK POSITION: FORWARD-RIGHT ////////////////////////////////////////////////////////
    if (
      joystickPressed &&
      joystickAngle >= Math.PI * 0.625 &&
      joystickAngle < Math.PI * 0.875
    ) {
      // SET ANIMATION: RUN FORWARD-RIGHT
      setAnimation("CharacterArmature|Run");

      // SET IMPULSE DIRECTION AND FORCE: FORWARD-RIGHT
      const impulseForwardRight = {
        x: Math.sin(angle + Math.PI * 0.75) * MOVEMENT_SPEED * delta * 100,
        y: 0,
        z: Math.cos(angle + Math.PI * 0.75) * MOVEMENT_SPEED * delta * 100,
      };

      // APPLY IMPULSE FORWARD-RIGHT (Move character right)
      rigidbody.current.applyImpulse(impulseForwardRight, true);
    }

    // DETERMINE JOYSTICK POSITION: LEFT ////////////////////////////////////////////////////////
    if (
      (joystickPressed &&
        joystickAngle > Math.PI * 1.375 &&
        joystickAngle <= Math.PI * 1.5) ||
      (joystickPressed &&
        joystickAngle >= Math.PI * -0.5 &&
        joystickAngle <= Math.PI * -0.375) ||
      leftKeyPressed
    ) {
      // SET ANIMATION: RUN LEFT
      setAnimation("CharacterArmature|Run_Left");

      // SET IMPULSE DIRECTION AND FORCE: LEFT
      const impulseLeft = {
        x: Math.sin(angle - Math.PI / 2) * MOVEMENT_SPEED * delta * 100,
        y: 0,
        z: Math.cos(angle - Math.PI / 2) * MOVEMENT_SPEED * delta * 100,
      };
      // APPLY IMPULSE: LEFT (Strafe character left)
      rigidbody.current.applyImpulse(impulseLeft, true);
    }

    // DETERMINE JOYSTICK POSITION: RIGHT ////////////////////////////////////////////////////////
    if (
      (joystickPressed &&
        joystickAngle >= Math.PI * 0.375 &&
        joystickAngle < Math.PI * 0.625) ||
      rightKeyPressed
    ) {
      // SET ANIMATION: RUN RIGHT
      setAnimation("CharacterArmature|Run_Right");

      // SET IMPULSE DIRECTION AND FORCE: RIGHT
      const impulseRight = {
        x: Math.sin(angle + Math.PI / 2) * MOVEMENT_SPEED * delta * 100,
        y: 0,
        z: Math.cos(angle + Math.PI / 2) * MOVEMENT_SPEED * delta * 100,
      };

      // APPLY IMPULSE RIGHT(Strafe character right)
      rigidbody.current.applyImpulse(impulseRight, true);
    }

    // DETERMINE JOYSTICK POSITION: BACKWARD-RIGHT ////////////////////////////////////////////////////////
    if (
      joystickPressed &&
      joystickAngle >= Math.PI * 0.125 &&
      joystickAngle < Math.PI * 0.375
    ) {
      // SET ANIMATION: RUN BACKWARD-RIGHT
      setAnimation("CharacterArmature|Run_Back");

      // SET IMPULSE DIRECTION AND FORCE: BACKWARD-RIGHT
      const impulseBackRight = {
        x: Math.sin(angle + Math.PI * 0.25) * MOVEMENT_SPEED * delta * 100,
        y: 0,
        z: Math.cos(angle + Math.PI * 0.25) * MOVEMENT_SPEED * delta * 100,
      };

      // APPLY IMPULSE BACKWARD-RIGHT (Move character backward-right)
      rigidbody.current.applyImpulse(impulseBackRight, true);
    }

    // DETERMINE JOYSTICK POSITION: BACKWARD-LEFT ////////////////////////////////////////////////////////
    if (
      joystickPressed &&
      joystickAngle > Math.PI * -0.375 &&
      joystickAngle <= Math.PI * -0.125
    ) {
      // SET ANIMATION: RUN BACKWARD-LEFT
      setAnimation("CharacterArmature|Run_Back");

      // SET IMPULSE DIRECTION AND FORCE: BACKWARD-LEFT
      const impulseBackLeft = {
        x: Math.sin(angle - Math.PI * 0.25) * MOVEMENT_SPEED * delta * 100,
        y: 0,
        z: Math.cos(angle - Math.PI * 0.25) * MOVEMENT_SPEED * delta * 100,
      };

      // APPLY IMPULSE BACKWARD-LEFT (Move character backward-left)
      rigidbody.current.applyImpulse(impulseBackLeft, true);
    }

    // DETERMINE JOYSTICK POSITION: BACKWARD ////////////////////////////////////////////////////////
    if (
      (joystickPressed &&
        joystickAngle > Math.PI * -0.125 &&
        joystickAngle < Math.PI * 0.125) ||
      backKeyPressed
    ) {
      // SET ANIMATION: RUN BACKWARD
      setAnimation("CharacterArmature|Run_Back");

      // SET IMPULSE DIRECTION AND FORCE: BACKWARD
      const impulseBack = {
        x: Math.sin(angle) * MOVEMENT_SPEED * delta * 100,
        y: 0,
        z: Math.cos(angle) * MOVEMENT_SPEED * delta * 100,
      };

      // APPLY IMPULSE BACKWARD (Move character backward)
      rigidbody.current.applyImpulse(impulseBack, true);
    }

    // CHECK IF FIRE BUTTON IS PRESSED ////////////////////////////////////////////////////////
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

    if (state.state.dead) {
      setAnimation("CharacterArmature|Death");
      return;
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
        {/* <PlayerInfo state={state.state} /> */}
        <group ref={character}>
          <Character
            color={state.state.profile?.color}
            animation={animation}
            scale={[2, 2, 2]}
            position={[0, -0.4, 0]}
            health={state.state.health}
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

// const PlayerInfo = ({ state }) => {
//   const health = state.health;
//   const name = state.profile.name;

//   return (
//     <Billboard position-y={0}>
//       <Text position-y={0.36} fontSize={0.4}>
//         {name}
//         <meshBasicMaterial color={state.profile.color} />
//       </Text>
//       <mesh position-z={-0.1}>
//         <planeGeometry args={[1, 0.2]} />
//         <meshBasicMaterial color="black" transparent opacity={0.5} />
//       </mesh>
//       <mesh scale-x={health / 100} position-x={-0.5 * (1 - health / 100)}>
//         <planeGeometry args={[1, 0.2]} />
//         <meshBasicMaterial color={health < 51 ? "#ff0000" : "#00ff00"} />
//       </mesh>
//     </Billboard>
//   );
// };
