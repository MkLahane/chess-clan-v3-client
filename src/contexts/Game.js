import React, { useState, createContext } from "react";
import * as Chess from "chess.js";
import { setDoc, doc, getDoc, deleteDoc } from "firebase/firestore";
import { getUserstats } from "./Auth";

const chess = new Chess();
const initial_game_state = {
  board: chess.board(),
  me: null,
  opponent: null,
};

const GameContext = createContext({
  ...initial_game_state,
});

const GameProvider = (props) => {
  //const [state, dispatch] = useReducer(GameReducer, initial_game_state);
  const [gameState, setGameState] = useState(initial_game_state);
  const setGameUserData = (me, opponent) => {
    setGameState({ ...gameState, me, opponent });
  };
  const makeMove = (from, to) => {
    const legalMove = chess.move({ from, to });
    console.log(chess.fen());
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
      value={{
        ...gameState,
        makeMove,
        resetBoard,
        getFenString,
        setGameUserData,
      }}
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
    accepted: false,
    fen: fen_string,
    winner: null,
    createdAt: new Date(),
  });
  const docRef = doc(db, "users", user.uid);
  const docSnap = await getDoc(docRef);
  const data = docSnap.data();
  await setDoc(doc(db, "users", user.uid), {
    ...data,
    game_id,
  });
  console.log("new game created!", game_id);
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
    ...data,
    accepted: true,
    participator: {
      user_id: user.uid,
      username,
      color: data["challenger"]["color"] === "white" ? "black" : "white",
    },
  });
  const userDocRef = doc(db, "users", user.uid);
  const userDocSnap = await getDoc(userDocRef);
  const userData = userDocSnap.data();
  await setDoc(doc(db, "users", user.uid), {
    ...userData,
    game_id,
  });
};

const close_game = async (db, user, game_id) => {
  const docRef = doc(db, "games", game_id);
  const docSnap = await getDoc(docRef);
  const gameData = docSnap.data();
  const { accepted } = gameData;
  const userDocRef = doc(db, "users", user.uid);
  const userDocSnap = await getDoc(userDocRef);
  const userData = userDocSnap.data();
  await setDoc(userDocRef, {
    ...userData,
    game_id: "NONE",
  });
  if (accepted) {
    // clear out the second user game id
    let otherUserId = "";
    if (gameData["challenger"]["user_id"] === user.uid) {
      //user is a challenger
      otherUserId = gameData["participator"]["user_id"];
    } else {
      //user is a participator
      otherUserId = gameData["challenger"]["user_id"];
    }
    const otherUserDocRef = doc(db, "users", otherUserId);
    const otherUserDocSnap = await getDoc(otherUserDocRef);
    const otherUserData = otherUserDocSnap.data();
    await setDoc(otherUserDocRef, {
      ...otherUserData,
      game_id: "NONE",
    });
    const { username } = await getUserstats(db, user);
    await setDoc(doc(db, "notifications", otherUserId), {
      msg: `${username} left the game!`,
    });
  }
  await deleteDoc(doc(db, "games", game_id));
};

export { GameContext, GameProvider, new_game, get_game, join_game, close_game };
