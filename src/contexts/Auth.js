import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  getAuth,
} from "firebase/auth";
import { setDoc, doc, getDoc } from "firebase/firestore";

const getUserstats = async (db, user) => {
  try {
    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);
    const data = docSnap.data();
    return {
      username: data.username,
      rating: data.rating,
      gameId: data.game_id,
    };
  } catch (err) {
    console.log(err);
  }
};

const register = async (db, username, email, password) => {
  const auth = getAuth();
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    await setDoc(doc(db, "users", user.uid), {
      username,
      email,
    });
    return {
      ok: 1,
      errorMsg: "",
    };
  } catch (err) {
    return {
      ok: -1,
      errorMsg: err,
    };
  }
};

const logIn = async (email, password) => {
  const auth = getAuth();
  try {
    await signInWithEmailAndPassword(auth, email, password);
    return {
      ok: 1,
      errorMsg: "",
    };
  } catch (err) {
    return {
      ok: -1,
      errorMsg: err,
    };
  }
};

export { logIn, register, getUserstats };
