import React, { createContext, useState, useContext } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { FirebaseContext } from "./FirebaseContext";
import { doc, deleteDoc } from "firebase/firestore";

const initial_state = {
  msg: "",
  notificationOpen: false,
};

const NotificationContext = createContext(initial_state);

const NotificationProvider = (props) => {
  const { auth, db } = useContext(FirebaseContext);
  const [user] = useAuthState(auth);
  const [notifState, setNotifState] = useState(initial_state);
  const openNotif = (msg) => {
    setNotifState({ msg, notificationOpen: true });
  };
  const closeNotif = () => {
    deleteDoc(doc(db, "notifications", user.uid)).then(() => {
      setNotifState({ msg: "", notificationOpen: false });
    });
  };

  return (
    <NotificationContext.Provider
      value={{ ...notifState, openNotif, closeNotif }}
      {...props}
    />
  );
};

export { NotificationContext, NotificationProvider };
