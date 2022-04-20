import React, { useState, createContext } from "react";
import * as Chess from "chess.js";
import { setDoc, doc, getDoc } from "firebase/firestore";
import { getUserstats } from "./Auth";

const chess = new Chess();
const initial_game_state = {
  board: chess.board(),
  current_player: null,
  opponent_player: null,
};

const GameContext = createContext({
  ...initial_game_state,
});

const GameProvider = (props) => {
  //const [state, dispatch] = useReducer(GameReducer, initial_game_state);
  const [gameState, setGameState] = useState(initial_game_state);
  const makeMove = (from, to) => {
    const legalMove = chess.move({ from, to });
    setGameState({ ...gameState, board: chess.board() });
  };
  const resetBoard = () => {
    chess.reset();
    setGameState({ ...gameState, board: chess.board() });
  };
  const getFenString = () => {
    return chess.fen();
  };
  const loadFen = (fen_string) => {
    chess.load(fen_string);
    setGameState({ ...gameState, board: chess.board() });
  };
  return (
    <GameContext.Provider
      value={{ ...gameState, makeMove, resetBoard, getFenString }}
      {...props}
    />
  );
};

const new_game = async (db, fen_string, user, game_id) => {
  const { username } = await getUserstats(db, user);
  await setDoc(doc(db, "games", game_id), {
    challenger: {
      user_id: user.uid,
      username,
      color: Math.random() < 0.5 ? "black" : "white",
    },
    fen: fen_string,
    winner: null,
    createdAt: new Date(),
  });
  console.log("new game created!", game_id);
  const docRef = doc(db, "users", user.uid);
  const docSnap = await getDoc(docRef);
  const data = docSnap.data();
  await setDoc(doc(db, "users", user.uid), {
    game_id,
    ...data,
  });
};

const get_game = async (db, game_id) => {
  const docRef = doc(db, "games", game_id);
  const docSnap = await getDoc(docRef);
  const data = docSnap.data();
  return data;
};

const join_game = async (db, user, game_id) => {
  const { username } = await getUserstats(db, user);
  console.log("Joining game..", game_id);
  const docRef = doc(db, "games", game_id);
  const docSnap = await getDoc(docRef);
  const data = docSnap.data();
  await setDoc(docRef, {
    playing: true,
    participator: {
      user_id: user.uid,
      username,
      color: data["challenger"]["color"] === "white" ? "black" : "white",
    },
    ...data,
  });
  const userDocRef = doc(db, "users", user.uid);
  const userDocSnap = await getDoc(userDocRef);
  const userData = userDocSnap.data();
  await setDoc(doc(db, "users", user.uid), {
    game_id,
    ...userData,
  });
};

export { GameContext, GameProvider, new_game, get_game, join_game };
