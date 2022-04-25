import React, { useContext } from "react";
import { GameContext } from "../contexts/Game";

export default function MovesComponent({ gameId }) {
  const { moves } = useContext(GameContext);
  if (gameId === null) {
    return (
      <div className="toolbar-div">
        <label>No active game...</label>
      </div>
    );
  }
  return (
    <div className="toolbar-div">
      <label>List of Moves...</label>
      <ul className="moves">
        {moves.map(({ move, fen }, index) => (
          <li key={index}>
            <span>{move}</span>
            <span>{fen}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
