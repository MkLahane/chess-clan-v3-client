import React from "react";
import { Piece } from "./Piece";
import { useDrop } from "react-dnd";
import { useContext } from "react";
import { GameContext, update_game } from "../contexts/Game";
import { FirebaseContext } from "../contexts/FirebaseContext";

export const Cell = ({ piece, isBlack, chessPos, isPlayingBlack }) => {
  const { game_id, winner, me, opponent, makeMove, getFenString } =
    useContext(GameContext);
  const { db } = useContext(FirebaseContext);
  const [, drop] = useDrop({
    accept: "piece",
    drop: (item) => {
      const [fromPos, , whichColor] = item.id.split("_");
      if (me !== null) {
        let myColor = me.color === "black" ? "b" : "w";
        if (myColor === whichColor && !winner) {
          const res = makeMove(fromPos, chessPos);
          update_game(
            db,
            game_id,
            getFenString(),
            chessPos,
            me.user_id,
            opponent.user_id,
            res
          );
        }
      } else {
        makeMove(fromPos, chessPos);
      }
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
        <Piece
          type={piece.type}
          color={piece.color}
          isPlayingBlack={isPlayingBlack}
          chessPos={chessPos}
        />
      )}
    </div>
  );
};
