import { useState } from "react";
import { CSSTransition } from "react-transition-group";
import FPSStats from "react-fps-stats";

export const OmniControls = ({
  downgradedPerformance,
  setDowngradedPerformance,
  bgRes,
  setBgRes,
  orbitOn,
  setOrbitOn,
  omniOpen,
  mapOpacity,
  setMapOpacity,
  forwardVel,
  setForwardVel,
  velocity,
  setVelocity,
}) => {
  const [omniExpand, setOmniExpand] = useState(false);

  const resUp = () => {
    if (bgRes < 4) setBgRes(bgRes + 1);
  };
  const resDown = () => {
    if (bgRes > 0) setBgRes(bgRes - 1);
  };

  const increaseOpacity = () => {
    if (mapOpacity >= 0.1) setMapOpacity(mapOpacity - 0.1);
  };

  const decreaseOpacity = () => {
    if (mapOpacity <= 0.9) setMapOpacity(mapOpacity + 0.1);
  };

  return (
    <CSSTransition in={omniOpen} unmountOnExit timeout={500} classNames="omni">
      <div className={omniExpand ? "omni expand" : "omni"}>
        {/* EXPAND OMNI MENU BUTTON /////////////////////////// */}

        <button
          className={omniExpand ? "btn-expand open" : "btn-expand"}
          onClick={() => {
            setOmniExpand(!omniExpand);
          }}
        >
          <div className={omniExpand ? "icon open" : "icon"}></div>
        </button>

        {/* OMNI-HEADER //////////////////////////////////////// */}
        <h2 className={omniExpand ? "omni-header expand" : "omni-header"}>
          OMNI
        </h2>

        {/* EFFECTS ON/OFF BUTTON /////////////////////////////////////////////// */}
        <div
          className={
            omniExpand ? "omni-btn-container expand" : "omni-btn-container"
          }
        >
          <p className="btn-label">EFFECTS</p>
          <button
            className={
              downgradedPerformance
                ? "btn post-process"
                : "btn post-process btn-on"
            }
            onClick={() => {
              setDowngradedPerformance(!downgradedPerformance);
            }}
          >
            {downgradedPerformance ? "OFF" : "ON"}
          </button>
        </div>

        {/* ORBIT CONTROL ON/OFF BUTTON ////////////////////////////////////////////// */}
        <div
          className={
            omniExpand ? "omni-btn-container expand" : "omni-btn-container"
          }
        >
          <p className="btn-label">ORBIT</p>
          <button
            className={orbitOn ? "btn orbit-on-off btn-on" : "btn orbit-on-off"}
            onClick={() => {
              setOrbitOn(!orbitOn);
            }}
          >
            {orbitOn ? "ON" : "OFF"}
          </button>
        </div>

        {/* MAP OPACITY BUTTONS //////////////////////////// */}
        <div
          className={
            omniExpand ? "omni-btn-container expand" : "omni-btn-container"
          }
        >
          <button className="btn res-up" onClick={increaseOpacity}></button>
          <p className="btn-label">
            map-op:
            <br /> {Math.round(mapOpacity * 10) / 10}
          </p>
          <button className="btn res-down" onClick={decreaseOpacity}></button>
        </div>

        {/* BACKGROUND RESOLUTION BUTTONS //////////////////////////// */}
        <div
          className={
            omniExpand ? "omni-btn-container expand" : "omni-btn-container"
          }
        >
          <button className="btn res-up" onClick={resUp}></button>
          <p className="btn-label">
            bg-res: <br />
            {bgRes === 0
              ? "192"
              : bgRes === 1
              ? "384"
              : bgRes === 2
              ? "768"
              : bgRes === 3
              ? "1536"
              : "3072"}
          </p>
          <button className="btn res-down" onClick={resDown}></button>
        </div>

        {/* MOVEMENT FORWARD SPEED //////////////////////////// */}
        <div
          className={
            omniExpand ? "omni-btn-container expand" : "omni-btn-container"
          }
        >
          <button
            className="btn res-up"
            onClick={() => {
              setForwardVel(forwardVel + 1);
            }}
          ></button>
          <p className="btn-label">
            forward <br />
            speed: <br />
            {forwardVel}
          </p>
          <button
            className="btn res-down"
            onClick={() => {
              setForwardVel(forwardVel - 1);
            }}
          ></button>
        </div>

        {/* MOVEMENT SPEED //////////////////////////// */}
        <div
          className={
            omniExpand ? "omni-btn-container expand" : "omni-btn-container"
          }
        >
          <button
            className="btn res-up"
            onClick={() => {
              setVelocity(velocity + 1);
            }}
          ></button>
          <p className="btn-label">
            directional<br/>
            speed: <br />
            {velocity}
          </p>
          <button
            className="btn res-down"
            onClick={() => {
              setVelocity(velocity - 1);
            }}
          ></button>
        </div>

        {/* FPS METER ////////////////////////////////////////////// */}
        <FPSStats
          top={omniExpand ? "1px" : "calc(100% - 55px)"}
          left={omniExpand ? "auto" : "6px"}
          right={omniExpand ? "6px" : "auto"}
          graphWidth={45}
        />
      </div>
    </CSSTransition>
  );
};
