export const CustomBtns = ({ zoom, setZoom }) => {
  return (
    <div className="custom-btns">
      {/* TEST BTNS ///////////////////////////////////////// */}
      <div className="container">
        <button
          className="btn test-1"
          onClick={() => {
            if (zoom > 0) setZoom(zoom - 1);
          }}
        ></button>
        <button
          className="btn test-2"
          onClick={() => {
            if (zoom < 3) setZoom(zoom + 1);
          }}
        ></button>
      </div>

      {/* ZOOM BTNS //////////////////////////////////// */}
      <div className="container">
        <button
          className="btn zoom-out"
          onClick={() => {
            if (zoom > 0) setZoom(zoom - 1);
          }}
        ></button>
        <button
          className="btn zoom-in"
          onClick={() => {
            if (zoom < 3) setZoom(zoom + 1);
          }}
        ></button>
      </div>
    </div>
  );
};
