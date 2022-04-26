import React, { useEffect, useContext, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link } from "react-router-dom";
import { FirebaseContext } from "../contexts/FirebaseContext";
import { collection, getDocs } from "firebase/firestore";
import { ReactComponent as ChessboardIcon } from "../icons/chessboard-icon.svg";
import { getUsername } from "../contexts/Auth";
import "./games.css";

export default function Games() {
  const [games, setGames] = useState([]);
  const { auth, db } = useContext(FirebaseContext);
  const [user] = useAuthState(auth);
  useEffect(() => {
    getAllGames();
  }, []);
  const getAllGames = async () => {
    const querySnapshot = await getDocs(collection(db, "games"));
    const res = querySnapshot.docs.map(async (doc) => {
      const data = doc.data();
      const { winner, winnerId, challenger, participator } = data;
      if (winner) {
        console.log(doc.id);
        const username = await getUsername(db, winnerId);
        const { username: c_username } = challenger;
        const { username: p_username } = participator;
        const gameData = {
          winner: username,
          user1: c_username,
          user2: p_username,
          game_id: doc.id,
        };
        return gameData;
      } else {
        return null;
      }
    });
    Promise.all(res).then((data) =>
      setGames(data.filter((game) => game !== null))
    );
  };
  return (
    <div className="games-div">
      <ul>
        {games.map(({ user1, user2, game_id, winner }) => (
          <li id={game_id}>
            <Link to={`/games/${game_id}`}>
              <ChessboardIcon />
            </Link>
            <h2>{user1}</h2>
            <h2>-</h2>
            <h2>{user2}</h2>
            <hr width="1" size="50"></hr>
            <h2>{user1 === winner ? "1" : "0"}</h2>
            <h2>-</h2>
            <h2>{user2 === winner ? "1" : "0"}</h2>
          </li>
        ))}
      </ul>
    </div>
  );
}
