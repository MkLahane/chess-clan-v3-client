import React, { useContext, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useAuthState } from "react-firebase-hooks/auth";
import { useHistory } from "react-router-dom";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Board } from "../components/Board";
import { GameContext } from "../contexts/Game";
import { new_game } from "../contexts/Game";
import { ReactComponent as ChessboardIcon } from "../icons/chessboard-icon.svg";
import { FirebaseContext } from "../contexts/FirebaseContext";
import UsernameDiv from "../components/UsernameDiv";
import { getUserstats } from "../contexts/Auth";
import GameToolbar from "../components/GameToolbar";
import "./chessboard.css";
import "./arena.css";

export default function Arena() {
  const [username, setUsername] = useState("");
  const [rating, setRating] = useState("");
  const [gameId, setGameId] = useState(null);
  const history = useHistory();
  const { auth, db } = useContext(FirebaseContext);
  const [user] = useAuthState(auth);
  const { getFenString } = useContext(GameContext);

  getUserstats(db, user).then(({ username, rating, gameId }) => {
    setUsername(username);
    setRating(rating);
    setGameId(gameId);
  });
  return (
    <div className="arena-div">
      <div className="user-div-container">
        <UsernameDiv db={db} user={user} username={username} rating={rating} />
      </div>
      <div className="game-container">
        <div className="board-container">
          <DndProvider backend={HTML5Backend}>
            <Board />
          </DndProvider>
        </div>
        <GameToolbar />
        {/* <div className="game-btn-div">
          {gameId === null && (
            <button
              className="game-btn"
              onClick={async () => {
                const game_id = uuidv4();
                await new_game(db, getFenString(), user.uid, game_id);
                history.push(`/games/${game_id}`);
              }}
            >
              <ChessboardIcon />
              New Game
            </button>
          )}
          {gameId === null && (
            <button className="game-btn" onClick={() => console.log(uuidv4())}>
              <ChessboardIcon />
              Find Game
            </button>
          )}
          {gameId !== null && (
            <button className="game-btn" onClick={() => console.log(uuidv4())}>
              <ChessboardIcon />
              Close Game
            </button>
          )}
        </div> */}
      </div>
      {/* <NewGame auth={auth} /> */}
    </div>
  );
}
