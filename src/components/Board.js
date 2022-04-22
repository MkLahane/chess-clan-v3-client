import React from "react";
import { Cell } from "./Cell";
import { useContext } from "react";
import { GameContext } from "../contexts/Game";

export const Board = () => {
  const { board, me } = useContext(GameContext);
  const blackStyle = {
    transform: "rotate(180deg)",
  };
  const getXYPos = (i) => {
    const x = i % 8;
    const y = Math.abs(Math.floor(i / 8) - 7);
    return { x, y };
  };
  const isBlack = (i) => {
    const { x, y } = getXYPos(i);
    return (x + y) % 2 === 1;
  };
  const getChessPos = (i) => {
    const { x, y } = getXYPos(i);
    const letter = ["a", "b", "c", "d", "e", "f", "g", "h"][x];
    return `${letter}${y + 1}`;
  };
  return (
    <div
      className="board"
      style={me !== null && me.color === "black" ? blackStyle : {}}
    >
      {board.flat().map((piece, i) => (
        <Cell
          piece={piece}
          isBlack={isBlack(i)}
          key={i}
          chessPos={getChessPos(i)}
          isPlayingBlack={me !== null && me.color === "black" ? true : false}
        />
      ))}
    </div>
  );
};
