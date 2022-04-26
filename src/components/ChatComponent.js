import React, { useContext, useEffect, useRef, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import "./chat.css";
import { FirebaseContext } from "../contexts/FirebaseContext";
import { addMsg } from "../contexts/Chat";
import { useAuthState } from "react-firebase-hooks/auth";

export default function ChatComponent({ gameId }) {
  const [chat, setChat] = useState([]);
  const { auth, db } = useContext(FirebaseContext);
  const [user] = useAuthState(auth);
  const divBottom = useRef(null);
  const scrollToBottom = () => {
    divBottom.current.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    if (gameId !== "NONE") {
      const unsubChat = onSnapshot(doc(db, "messages", gameId), (doc) => {
        try {
          const { chat } = doc.data();
          setChat(chat);
          scrollToBottom();
        } catch (e) {}
      });
      return () => unsubChat();
    }
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameId]);
  return (
    <div className="toolbar-div">
      <ul className="chat">
        {chat.map(({ username, msg }, index) => (
          <li key={index}>
            <span>{username}</span>
            <span>{msg}</span>
          </li>
        ))}
      </ul>
      <input
        className="chat-input"
        type="text"
        onKeyDown={(e) => {
          if (e.key === "Enter" && e.target.value.trim() !== "") {
            addMsg(db, gameId, user, e.target.value.trim());
            e.target.value = "";
            scrollToBottom();
          }
        }}
        placeholder="Type something to chat..."
      />
      <div style={{ float: "left", clear: "both" }} ref={divBottom}></div>
    </div>
  );
}
