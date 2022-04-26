import React, { useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import { get_game, join_game } from "../contexts/Game";
import { useAuthState } from "react-firebase-hooks/auth";
import { FirebaseContext } from "../contexts/FirebaseContext";
import "./game.css";

export default function JoinGame(props) {
  const { db, auth } = useContext(FirebaseContext);
  const [user] = useAuthState(auth);
  const history = useHistory();
  useEffect(() => {
    const gameId = props.match.params.id;
    get_game(db, gameId).then((data) => {
      const { accepted, challenger } = data;
      if (accepted || challenger["user_id"] === user.uid) {
        history.push("/arena");
      } else {
        join_game(db, user, gameId).then(() => history.push("/arena"));
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <div className="game-div">Joining game.....</div>;
}
