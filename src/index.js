import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { FirebaseContext } from "./contexts/FirebaseContext";

const firebaseConfig = {
  apiKey: "AIzaSyBxY0GGd5s2FTeoRFuV2LyZC-S9htwG6zQ",
  authDomain: "chess-clan.firebaseapp.com",
  projectId: "chess-clan",
  storageBucket: "chess-clan.appspot.com",
  messagingSenderId: "305221402199",
  appId: "1:305221402199:web:89903db34df1727ae0ed12",
  measurementId: "G-YKZJJ5M05P",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore();

ReactDOM.render(
  <React.StrictMode>
    <FirebaseContext.Provider value={{ auth, db }}>
      <App />
    </FirebaseContext.Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
