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
}) => {
  const [omniOpen, setOmniOpen] = useState(false);

  const resUp = () => {
    if (bgRes < 4) {
      setBgRes(bgRes + 1);
    }
  };
  const resDown = () => {
    if (bgRes > 0) {
      setBgRes(bgRes - 1);
    }
  };

  const [pressed, setPressed] = useState(false);
  const press = () => {
    setPressed(true);
  };
  const unpress = () => {
    setPressed(false);
  };

  return (
    <>
      <button
        className={
          pressed ? "btn-open-close-omni pressed" : "btn-open-close-omni"
        }
        onClick={() => {
          setOmniOpen(!omniOpen);
        }}
        onMouseDown={press}
        onTouchStart={press}
        onMouseUp={unpress}
        onTouchEnd={unpress}
      >
        <div
          className={omniOpen ? "omni-btn-icon open" : "omni-btn-icon"}
        ></div>
      </button>
      <CSSTransition
        in={omniOpen}
        unmountOnExit
        timeout={500}
        classNames="omni"
      >
        <div className="omni">
          <hr />
          <button className="btn res-up" onClick={resUp}></button>
          <p>
            bg-res: {bgRes}
            <br />
          </p>
          <button className="btn res-down" onClick={resDown}></button>
          <hr />
          <p>EFFECTS</p>
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
          <hr />
          <p>ORBIT</p>
          <button
            className={orbitOn ? "btn orbit-on-off btn-on" : "btn orbit-on-off"}
            onClick={() => {
              setOrbitOn(!orbitOn);
            }}
          >
            {orbitOn ? "ON" : "OFF"}
          </button>
          <FPSStats top="calc(100% - 55px)" left={6} graphWidth={45} />
        </div>
      </CSSTransition>
    </>
  );
};
