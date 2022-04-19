import React from "react";
import { Piece } from "./Piece";
import { useDrop } from "react-dnd";
import { useContext } from "react";
import { GameContext } from "../contexts/Game";

export const Cell = ({ piece, isBlack, chessPos }) => {
  const { makeMove } = useContext(GameContext);
  const [{ isOver }, drop] = useDrop({
    accept: "piece",
    drop: (item) => {
      const [fromPos] = item.id.split("_");
      makeMove(fromPos, chessPos);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });
  return (
    <div
      className="board-cell"
      style={{
        background: isBlack ? "#fff" : "#5FA8D3",
      }}
      ref={drop}
    >
      {piece && (
        <Piece type={piece.type} color={piece.color} chessPos={chessPos} />
      )}
    </div>
  );
};
