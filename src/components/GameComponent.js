import React, { useContext, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useAuthState } from "react-firebase-hooks/auth";
import { ReactComponent as ChessboardIcon } from "../icons/chessboard-icon.svg";
import { new_game } from "../contexts/Game";
import { FirebaseContext } from "../contexts/FirebaseContext";
import { GameContext } from "../contexts/Game";
import { close_game } from "../contexts/Game";
import LoadFEN from "./LoadFEN";

export default function GameComponent({ gameId }) {
  const { auth, db } = useContext(FirebaseContext);
  const [user] = useAuthState(auth);
  const [copied, setCopied] = useState(false);
  const { getFenString, resetBoard, setGameUserData } = useContext(GameContext);
  const copy = () => {
    const el = document.createElement("input");
    el.value = `localhost:3000/arena/${gameId}`;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
    setCopied(true);
  };
  return (
    <div className="toolbar-div">
      <div className="game-btn-div">
        <button
          className={
            gameId === "NONE" ? "game-btn" : "game-btn game-inactive-btn"
          }
          onClick={() => {
            const game_id = uuidv4();
            resetBoard();
            new_game(db, getFenString(), user, game_id);
          }}
        >
          <ChessboardIcon />
          New Game
        </button>
        <button
          className={
            gameId === "NONE" ? "game-btn" : "game-btn game-inactive-btn"
          }
          onClick={() => console.log(uuidv4())}
        >
          <ChessboardIcon />
          Find Game
        </button>
        <button
          className={
            gameId !== "NONE" ? "game-btn" : "game-btn game-inactive-btn"
          }
          onClick={() => (copied ? setCopied(false) : copy())}
        >
          <i className="fa fa-copy" />
          {!copied ? "Copy link" : "Copied!"}
        </button>
        <button
          className={
            gameId !== "NONE" ? "game-btn" : "game-btn game-inactive-btn"
          }
          onClick={() => {
            close_game(db, user, gameId);
            setGameUserData(null, null);
          }}
        >
          <i className="fa fa-window-close" aria-hidden="true"></i>
          Close Game
        </button>
      </div>
      <LoadFEN />
    </div>
  );
}
