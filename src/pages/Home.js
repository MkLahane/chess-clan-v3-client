import React, { useContext } from "react";
import { getAuth } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { FirebaseContext } from "../contexts/FirebaseContext";
import UsernameDiv from "../components/UsernameDiv";
import "./home.css";

export default function Home() {
  const auth = getAuth();
  const { db } = useContext(FirebaseContext);
  const [user] = useAuthState(auth);

  return (
    <div className="home-div">
      <UsernameDiv db={db} user={user} />
    </div>
  );
}
