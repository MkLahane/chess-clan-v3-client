import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { GameProvider } from "../contexts/Game";
import { Board } from "../components/Board";
import "./game.css";

export default function Game(props) {
  const gameId = props.match.params.id;
  return (
    <div className="game-div">
      <DndProvider backend={HTML5Backend}>
        <GameProvider>
          <div className="board-container">
            <Board />
          </div>
        </GameProvider>
      </DndProvider>
    </div>
  );
}
