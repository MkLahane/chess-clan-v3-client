import React from "react";
import { useDrag, DragPreviewImage } from "react-dnd";

export const Piece = ({ type, color, chessPos }) => {
  const [{ isDragging }, dragRef, preview] = useDrag(
    () => ({
      type: "piece",
      item: { type: "piece", id: `${chessPos}_${type}_${color}` },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    []
  );
  const img_path = `../chess-pieces/${type}_${color}.png`;
  return (
    <>
      <DragPreviewImage connect={preview} src={img_path} />
      <div
        ref={dragRef}
        className="piece-div"
        style={{
          opacity: isDragging ? 0.0 : 1,
        }}
      >
        <img src={img_path} alt="" />
      </div>
    </>
  );
};
