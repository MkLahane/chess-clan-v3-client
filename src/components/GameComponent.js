import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { useAuthState } from "react-firebase-hooks/auth";
import { ReactComponent as ChessboardIcon } from "../icons/chessboard-icon.svg";
import { new_game } from "../contexts/Game";
import { FirebaseContext } from "../contexts/FirebaseContext";

export default function GameComponent(props) {
  const { auth, db } = useContext(FirebaseContext);
  const [user] = useAuthState(auth);
  const history = useHistory();
  return (
    <div className="toolbar-div">
      <div className="game-btn-div">
        <button
          className="game-btn"
          onClick={async () => {
            const game_id = uuidv4();
            await new_game(db, user.uid, game_id);
            history.push(`/games/${game_id}`);
          }}
        >
          <ChessboardIcon />
          New Game
        </button>
        <button className="game-btn" onClick={() => console.log(uuidv4())}>
          <ChessboardIcon />
          Find Game
        </button>
      </div>
    </div>
  );
}
