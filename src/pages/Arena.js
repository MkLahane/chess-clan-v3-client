import React, { useContext, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useHistory } from "react-router-dom";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Board } from "../components/Board";
import { GameContext } from "../contexts/Game";
import { FirebaseContext } from "../contexts/FirebaseContext";
import UsernameDiv from "../components/UsernameDiv";
import { getUserstats } from "../contexts/Auth";
import GameToolbar from "../components/GameToolbar";
import "./chessboard.css";
import "./arena.css";
import { useEffect } from "react";

export default function Arena() {
  const [username, setUsername] = useState("");
  const [rating, setRating] = useState("");
  const [gameId, setGameId] = useState(null);
  const [gameIsOn, setGameIsOn] = useState(false);
  const history = useHistory();
  const { auth, db } = useContext(FirebaseContext);
  const [user] = useAuthState(auth);
  const { getFenString } = useContext(GameContext);
  useEffect(() => {
    const unsubUser = onSnapshot(doc(db, "users", user.uid), (doc) => {
      const { username, rating, game_id } = doc.data();
      setUsername(username);
      setRating(rating);
      setGameId(game_id);
    });
    return () => unsubUser();
  }, []);
  useEffect(() => {
    if (gameId !== null) {
      const unsubGame = onSnapshot(doc(db, "games", gameId), (doc) => {
        const { playing } = doc.data();
        setGameIsOn(playing);
        return () => unsubGame();
      });
    }
  }, [gameId]);

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
        <GameToolbar gameId={gameId} gameIsOn={gameIsOn} />
      </div>
    </div>
  );
}
