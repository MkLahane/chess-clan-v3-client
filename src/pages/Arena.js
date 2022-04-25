import React, { useContext, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Board } from "../components/Board";
import { GameContext } from "../contexts/Game";
import { FirebaseContext } from "../contexts/FirebaseContext";
import UsernameDiv from "../components/UsernameDiv";
import GameToolbar from "../components/GameToolbar";
import "./chessboard.css";
import "./arena.css";
import { useEffect } from "react";

export default function Arena() {
  const [username, setUsername] = useState("");
  const [rating, setRating] = useState("");
  const { auth, db } = useContext(FirebaseContext);
  const [user] = useAuthState(auth);
  const {
    game_id,
    me,
    opponent,
    setGameId,
    setGameUserData,
    setMoves,
    loadFen,
    setGameAccepted,
  } = useContext(GameContext);
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
    if (game_id !== "NONE") {
      const unsubGame = onSnapshot(doc(db, "games", game_id), (doc) => {
        try {
          const data = doc.data();
          const {
            fen,
            challenger,
            participator,
            accepted,
            moves,
            winner,
            gameResult,
          } = data;
          if (challenger["user_id"] === user.uid) {
            console.log("I am challenger");
            setGameUserData(challenger, participator);
          } else {
            console.log("I am participator");
            setGameUserData(participator, challenger);
          }
          setMoves(moves);
          setGameAccepted(accepted);
          loadFen(fen);
        } catch (err) {}
      });
      return () => unsubGame();
    } else {
      setGameUserData(null, null);
    }
  }, [game_id]);

  return (
    <div className="arena-div">
      <div className="user-div-container">
        {opponent && (
          <UsernameDiv
            rating={opponent.rating}
            opponent={opponent}
            displayMe={false}
            style={{ justifyContent: "flex-start" }}
          />
        )}
      </div>
      <div className="game-container">
        <div className="board-container">
          <DndProvider backend={HTML5Backend}>
            <Board />
          </DndProvider>
        </div>
        <GameToolbar gameId={game_id} />
      </div>
      <div
        className="user-div-container"
        style={{ justifyContent: "flex-end" }}
      >
        {user && (
          <UsernameDiv
            rating={me ? me.rating : rating}
            displayMe={true}
            username={username}
          />
        )}
      </div>
    </div>
  );
}
