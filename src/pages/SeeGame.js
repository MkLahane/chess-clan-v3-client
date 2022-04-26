import React, { useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Board } from "../components/Board";
import ChatComponent from "../components/ChatComponent";
import MovesComponent from "../components/MovesComponent";
import "./see-games.css";

export default function SeeGame(props) {
  const [game_id, setGameId] = useState("NONE");
  const [activeNav, setActiveNav] = useState("moves");
  useEffect(() => {
    const gameId = props.match.params.id;
    setGameId(gameId);
    console.log(gameId);
  }, []);
  return (
    <div className="see-game-div">
      <div className="game-container">
        <div className="board-container">
          <DndProvider backend={HTML5Backend}>
            <Board />
          </DndProvider>
        </div>
      </div>
      <div className="see-game-toolbar">
        <ul className="see-game-toolbar-ul">
          <li
            className={
              activeNav === "moves" ? "active-toolbar" : "inactive-toolbar"
            }
            onClick={() => setActiveNav("moves")}
          >
            Moves
          </li>
          <li
            className={
              activeNav === "chat" ? "active-toolbar" : "inactive-toolbar"
            }
            onClick={() => setActiveNav("chat")}
          >
            Chat
          </li>
        </ul>
        {activeNav === "moves" && <MovesComponent gameId={game_id} />}
        {activeNav === "chat" && <ChatComponent gameId={game_id} />}
      </div>
    </div>
  );
}
