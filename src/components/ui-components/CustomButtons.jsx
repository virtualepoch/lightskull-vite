export const CustomButtons = ({ zoom, setZoom }) => {
  return (
    <div className="zoom-btns">
      <button
        className="btn-zoom-out"
        onClick={() => {
          if (zoom > 0) setZoom(zoom - 1);
        }}
      ></button>
      <button
        className="btn-zoom-in"
        onClick={() => {
          if (zoom < 3) setZoom(zoom + 1);
        }}
      ></button>
    </div>
  );
};
