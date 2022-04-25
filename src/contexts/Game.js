import React, { useEffect, useReducer, createContext } from "react";
import * as Chess from "chess.js";
import { setDoc, doc, getDoc, deleteDoc } from "firebase/firestore";
import { getUserstats, getUsername } from "./Auth";

const chess = new Chess();
const initial_game_state = {
  board: chess.board(),
  me: null,
  moves: [],
  opponent: null,
  game_id: "NONE",
  accepted: false,
  winner: false,
  gameResult: "NONE",
};

const GameContext = createContext({
  ...initial_game_state,
});

const GameReducer = (state, action) => {
  switch (action.type) {
    case "setGameUserData": {
      const { me, opponent } = action.payload;
      return { ...state, me, opponent };
    }
    case "setGameId": {
      const { game_id } = action.payload;
      return { ...state, game_id };
    }
    case "updateBoard": {
      const { board } = action.payload;
      return { ...state, board };
    }
    case "makeMove": {
      const { board, move, fen, winner, gameResult } = action.payload;
      return {
        ...state,
        board,
        fen,
        winner,
        gameResult,
        moves: [...state.moves, { move, fen }],
      };
    }
    case "setMoves": {
      const { moves } = action.payload;
      return { ...state, moves };
    }
    case "setAccepted": {
      return { ...state, accepted: action.payload.accepted };
    }
    default:
      console.log(action);
      throw new Error();
  }
};

const GameProvider = (props) => {
  const [gameState, dispatch] = useReducer(GameReducer, initial_game_state);

  const setGameUserData = (me, opponent) => {
    dispatch({ type: "setGameUserData", payload: { me, opponent } });
  };
  const setGameId = (game_id) => {
    dispatch({ type: "setGameId", payload: { game_id } });
  };
  const makeMove = (from, to) => {
    const legalMove = chess.move({ from, to });
    const gameOver = chess.game_over();
    const checkmate = chess.in_checkmate();
    const gameResult = {
      winner: gameOver,
      gameResult: gameOver ? (checkmate ? "win" : "draw") : "NONE",
    };
    if (legalMove !== null) {
      dispatch({
        type: "makeMove",
        payload: {
          move: to,
          fen: chess.fen(),
          board: chess.board(),
          ...gameResult,
        },
      });
    }
    return {
      legalMove: legalMove !== null,
      ...gameResult,
    };
  };
  const setMoves = (moves) => {
    dispatch({ type: "setMoves", payload: { moves } });
  };
  const resetBoard = () => {
    chess.reset();
    dispatch({ type: "updateBoard", payload: { board: chess.board() } });
  };
  const getFenString = () => {
    return chess.fen();
  };
  const loadFen = (fen_string) => {
    chess.load(fen_string);
    dispatch({ type: "updateBoard", payload: { board: chess.board() } });
  };
  const setGameAccepted = (accepted) => {
    dispatch({ type: "setAccepted", payload: { accepted } });
  };
  const validateFen = (fen) => {
    const { valid } = chess.validate_fen(fen);
    return valid;
  };
  return (
    <GameContext.Provider
      value={{
        ...gameState,
        makeMove,
        resetBoard,
        getFenString,
        setGameUserData,
        setGameId,
        loadFen,
        setMoves,
        setGameAccepted,
        validateFen,
      }}
      {...props}
    />
  );
};

const new_game = async (db, fen_string, user, game_id) => {
  const { username, rating } = await getUserstats(db, user);
  await setDoc(doc(db, "games", game_id), {
    challenger: {
      user_id: user.uid,
      username,
      rating,
      color: Math.random() < 0.5 ? "black" : "white",
    },
    accepted: false,
    fen: fen_string,
    winner: false,
    winnerId: null,
    gameResult: "NONE",
    moves: [],
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
  const { username, rating } = await getUserstats(db, user);
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
      rating,
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

const update_game = async (
  db,
  game_id,
  fen,
  move,
  user_id,
  other_user_id,
  res
) => {
  const gameDocRef = doc(db, "games", game_id);
  const gameDocSnap = await getDoc(gameDocRef);
  const gameData = gameDocSnap.data();
  const { moves } = gameData;
  const { winner, gameResult } = res;
  await setDoc(gameDocRef, {
    ...gameData,
    moves: [...moves, { fen, move }],
    fen,
    winner,
    gameResult,
    winnerId: winner ? user_id : null,
  });
  if (winner) {
    //send win notifications
    if (gameResult === "win") {
      const username = await getUsername(db, user_id);
      await setDoc(doc(db, "notifications", other_user_id), {
        msg: `${username} won the game!`,
      });
      await setDoc(doc(db, "notifications", user_id), {
        msg: `${username} won the game!`,
      });
    } else {
      await setDoc(doc(db, "notifications", other_user_id), {
        msg: `Draw!`,
      });
      await setDoc(doc(db, "notifications", user_id), {
        msg: `Draw!`,
      });
    }
    const userDocRef = doc(db, "users", user_id);
    const userDocSnap = await getDoc(userDocRef);
    const userData = userDocSnap.data();
    await setDoc(userDocRef, {
      ...userData,
      game_id: "NONE",
    });

    const otherUserDocRef = doc(db, "users", other_user_id);
    const otherUserDocSnap = await getDoc(otherUserDocRef);
    const otherUserData = otherUserDocSnap.data();
    await setDoc(otherUserDocRef, {
      ...otherUserData,
      game_id: "NONE",
    });
  }
};

const update_game_fen = async (db, game_id, fen) => {
  const gameDocRef = doc(db, "games", game_id);
  const gameDocSnap = await getDoc(gameDocRef);
  const gameData = gameDocSnap.data();
  await setDoc(gameDocRef, {
    ...gameData,
    fen,
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

export {
  GameContext,
  GameProvider,
  new_game,
  get_game,
  join_game,
  close_game,
  update_game,
  update_game_fen,
};
