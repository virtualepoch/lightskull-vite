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
}) => {
  const [omniExpand, setOmniExpand] = useState(false);

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

  return (
    <CSSTransition in={omniOpen} unmountOnExit timeout={500} classNames="omni">
      <div className={omniExpand ? "omni expand" : "omni"}>
        <h2 className="omni-header">OMNI</h2>
        <button
          className={omniExpand ? "btn-expand open" : "btn-expand"}
          onClick={() => {
            setOmniExpand(!omniExpand);
          }}
        >
          <div className={omniExpand ? "icon open" : "icon"}></div>
        </button>

        {/* DIVIDER ////////////////////////////////////////////// */}
        <div className={omniExpand ? "neon-divider expand" : "neon-divider"} />
        <div className={omniExpand ? "neon-divider expand" : "neon-divider"} />
        {/* DIVIDER ////////////////////////////////////////////// */}

        {/* BACKGROUND RESOLUTION BUTTONS //////////////////////////// */}
        <div
          className={
            omniExpand ? "omni-btn-container expand" : "omni-btn-container"
          }
        >
          <button className="btn res-up" onClick={resUp}></button>
          <p className="btn-label">
            bg-res: {bgRes}
            <br />
          </p>
          <button className="btn res-down" onClick={resDown}></button>
        </div>

        {/* DIVIDER ////////////////////////////////////////////// */}
        <div className={omniExpand ? "neon-divider expand" : "neon-divider"} />
        {/* DIVIDER ////////////////////////////////////////////// */}

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

        {/* DIVIDER ////////////////////////////////////////////// */}
        <div className={omniExpand ? "neon-divider expand" : "neon-divider"} />
        {/* DIVIDER ////////////////////////////////////////////// */}

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

        {/* DIVIDER ////////////////////////////////////////////// */}
        <div className={omniExpand ? "neon-divider expand" : "neon-divider"} />
        {/* DIVIDER ////////////////////////////////////////////// */}

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
