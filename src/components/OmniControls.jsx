import { useState } from "react";
import { CSSTransition } from "react-transition-group";
import FPSStats from "react-fps-stats";

export const OmniControls = ({
  downgradedPerformance,
  setDowngradedPerformance,
  bgRes,
  setBgRes,
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

  return (
    <>
      <button
        className="btn-open-close-omni"
        onClick={() => {
          setOmniOpen(!omniOpen);
        }}
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
          <button className="btn res-up" onClick={resUp}></button>
          <p>
            bg-res: {bgRes}<br />
          </p>
          <button className="btn res-down" onClick={resDown}></button>
          <hr />
          <p>post:</p>
          <button
            className="btn post-process"
            onClick={() => {
              setDowngradedPerformance(!downgradedPerformance);
            }}
          >
            {downgradedPerformance ? "ON" : "OFF"}
          </button>
          <hr />
          <FPSStats top="calc(100% - 55px)" left={4} graphWidth={45} />
        </div>
      </CSSTransition>
    </>
  );
};
