import { CSSTransition } from "react-transition-group";

export const Menu = ({ menuOpen }) => {
  return (
    <CSSTransition
      in={menuOpen}
      unmountOnExit
      timeout={500}
      classNames="menu"
    >
      <nav className="menu"></nav>
    </CSSTransition>
  );
};
