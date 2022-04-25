import React, { useEffect, useState } from "react";
import ChatComponent from "./ChatComponent";
import GameComponent from "./GameComponent";
import MovesComponent from "./MovesComponent";

export default function GameToolbar({ gameId }) {
  const [activeNav, setActiveNav] = useState("game");
  return (
    <div className="game-toolbar">
      <ul className="game-toolbar-nav">
        <li
          className={
            activeNav === "game" ? "active-toolbar" : "inactive-toolbar"
          }
          onClick={() => setActiveNav("game")}
        >
          Game
        </li>
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
      {activeNav === "game" && <GameComponent gameId={gameId} />}
      {activeNav === "moves" && <MovesComponent gameId={gameId} />}
      {activeNav === "chat" && <ChatComponent gameId={gameId} />}
    </div>
  );
}
