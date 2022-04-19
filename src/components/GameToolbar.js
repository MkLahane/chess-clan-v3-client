import React, { useState } from "react";
import GameComponent from "./GameComponent";

export default function GameToolbar() {
  const [activeNav, setActiveNav] = useState("game");
  const [hoverNav, setHoverNav] = useState("");
  return (
    <div className="game-toolbar">
      <ul className="game-toolbar-nav">
        <li
          className={
            activeNav === "game" || hoverNav === "game" ? "active-nav" : ""
          }
        >
          Game
        </li>
        <li
          className={
            activeNav === "moves" || hoverNav === "moves" ? "active-nav" : ""
          }
        >
          Moves
        </li>
        <li
          className={
            activeNav === "chat" || hoverNav === "chat" ? "active-nav" : ""
          }
        >
          Chat
        </li>
      </ul>
      {activeNav === "game" && <GameComponent />}
    </div>
  );
}
