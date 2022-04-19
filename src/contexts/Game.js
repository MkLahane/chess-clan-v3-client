import React, { useState, createContext } from "react";
import * as Chess from "chess.js";
import { setDoc, doc, getDoc } from "firebase/firestore";

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

const new_game = async (db, fen_string, user_id, game_id) => {
  await setDoc(doc(db, "games", game_id), {
    user_id: {
      color: Math.random() < 0.5 ? "black" : "white",
    },
    fen: fen_string,
    winner: null,
    createdAt: new Date(),
  });
  console.log("new game created!", game_id);
  const docRef = doc(db, "users", user_id);
  const docSnap = await getDoc(docRef);
  const data = docSnap.data();
  await setDoc(doc(db, "users", user_id), {
    game_id,
    ...data,
  });
};

const get_game = async (db, game_id) => {};

export { GameContext, GameProvider, new_game };
