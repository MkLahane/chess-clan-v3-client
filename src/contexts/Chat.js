import { setDoc, doc, getDoc } from "firebase/firestore";
import { getUsername } from "./Auth";

const addMsg = async (db, game_id, user, msg) => {
  const username = await getUsername(db, user.uid);
  const docRef = doc(db, "messages", game_id);
  try {
    const docSnap = await getDoc(docRef);
    const { chat } = docSnap.data();
    await setDoc(docRef, {
      chat: [...chat, { username, msg }],
    });
  } catch (e) {
    await setDoc(docRef, {
      chat: [{ username, msg }],
    });
  }
};

export { addMsg };
