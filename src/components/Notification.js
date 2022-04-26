import React, { useContext, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { NotificationContext } from "../contexts/NotificationContext";
import "./notif.css";
import { FirebaseContext } from "../contexts/FirebaseContext";

export default function Notification() {
  const { auth, db } = useContext(FirebaseContext);
  const [user] = useAuthState(auth);
  const { msg, notificationOpen, openNotif, closeNotif } =
    useContext(NotificationContext);
  useEffect(() => {
    try {
      const unsubUser = onSnapshot(
        doc(db, "notifications", user.uid),
        (doc) => {
          try {
            const data = doc.data();
            const { msg } = data;
            openNotif(msg);
          } catch (e) {}
        }
      );
      return () => unsubUser();
    } catch (e) {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);
  if (!notificationOpen) {
    return <></>;
  }
  return (
    <div className="notif-div">
      <div className="notif">
        <h3>{msg}</h3>
        <button className="notif-close" onClick={() => closeNotif()}>
          <i className="fa fa-window-close" aria-hidden="true"></i>
        </button>
      </div>
    </div>
  );
}
