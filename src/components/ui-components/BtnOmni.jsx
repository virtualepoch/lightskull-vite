import { useState } from "react";

export const BtnOmni = ({ omniOpen, setOmniOpen }) => {
  const [pressed, setPressed] = useState(false);
  const press = () => {
    setPressed(true);
  };
  const unpress = () => {
    setPressed(false);
  };
  return (
    <button
      className={pressed ? "btn-omni pressed" : "btn-omni"}
      onClick={() => {
        setOmniOpen(!omniOpen);
      }}
      onMouseDown={press}
      onTouchStart={press}
      onMouseUp={unpress}
      onTouchEnd={unpress}
    >
      <div className={omniOpen ? "icon open" : "icon"}></div>
    </button>
  );
};
