import React, { useContext, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useAuthState } from "react-firebase-hooks/auth";
import { ReactComponent as ChessboardIcon } from "../icons/chessboard-icon.svg";
import { new_game } from "../contexts/Game";
import { FirebaseContext } from "../contexts/FirebaseContext";
import { GameContext } from "../contexts/Game";

export default function GameComponent({ gameId, gameIsOn }) {
  const { auth, db } = useContext(FirebaseContext);
  const [user] = useAuthState(auth);
  const [copied, setCopied] = useState(false);
  const { getFenString, resetBoard } = useContext(GameContext);
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
        {gameId !== null && (
          <button
            className={
              gameId === null ? "game-btn" : "game-btn game-inactive-btn"
            }
            onClick={async () => {
              const game_id = uuidv4();
              resetBoard();
              await new_game(db, getFenString(), user, game_id);
            }}
          >
            <ChessboardIcon />
            New Game
          </button>
        )}
        {gameId !== null && (
          <button
            className={
              gameId === null ? "game-btn" : "game-btn game-inactive-btn"
            }
            onClick={() => console.log(uuidv4())}
          >
            <ChessboardIcon />
            Find Game
          </button>
        )}
        <button
          onClick={() => (copied ? setCopied(false) : copy())}
          className="game-btn"
        >
          <i className="fa fa-copy" />
          {!copied ? "Copy link" : "Copied!"}
        </button>
        {!gameIsOn && <label>Waiting for player to join...</label>}
      </div>
    </div>
  );
}
