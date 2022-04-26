import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { ReactComponent as LoginIcon } from "../icons/login.svg";
import { ReactComponent as SignUpIcon } from "../icons/sign-up.svg";
import { ReactComponent as HomeIcon } from "../icons/home.svg";
import { ReactComponent as ChessClanIcon } from "../icons/chess-clan-logo-v2.svg";
import { ReactComponent as ChessboardIcon } from "../icons/chessboard-icon.svg";
import { ReactComponent as ListIcon } from "../icons/list-icon.svg";
import { signOut } from "firebase/auth";
import { FirebaseContext } from "../contexts/FirebaseContext";
import { useAuthState } from "react-firebase-hooks/auth";

export default function Navbar() {
  const entirePathName = window.location.pathname;
  const path = entirePathName === "/" ? "home" : entirePathName.substring(1);
  const [activeNav, setActiveNav] = useState(path);
  const [hoverNav, setHoverNav] = useState("");
  const { auth } = useContext(FirebaseContext);
  const [user] = useAuthState(auth);
  return (
    <ul className="navbar">
      <li
        onMouseEnter={() => setHoverNav("home")}
        onMouseLeave={() => setHoverNav("")}
        onClick={() => setActiveNav("home")}
        className={
          activeNav === "home" || hoverNav === "home" ? "active-nav" : ""
        }
      >
        <Link to="/">
          <HomeIcon />
          Home
        </Link>
      </li>
      {!user && (
        <li
          onMouseEnter={() => setHoverNav("login")}
          onMouseLeave={() => setHoverNav("")}
          onClick={() => setActiveNav("login")}
          className={
            activeNav === "login" || hoverNav === "login" ? "active-nav" : ""
          }
        >
          <Link to="/login">
            <LoginIcon />
            Login
          </Link>
        </li>
      )}
      {!user && (
        <li
          onMouseEnter={() => setHoverNav("register")}
          onMouseLeave={() => setHoverNav("")}
          onClick={() => setActiveNav("register")}
          className={
            activeNav === "register" || hoverNav === "register"
              ? "active-nav"
              : ""
          }
        >
          <Link to="/register">
            <SignUpIcon />
            Register
          </Link>
        </li>
      )}
      {user && (
        <li
          onMouseEnter={() => setHoverNav("arena")}
          onMouseLeave={() => setHoverNav("")}
          onClick={() => setActiveNav("arena")}
          className={
            activeNav === "arena" || hoverNav === "arena" ? "active-nav" : ""
          }
        >
          <Link to="/arena">
            <ChessboardIcon />
            Arena
          </Link>
        </li>
      )}
      {user && (
        <li
          onMouseEnter={() => setHoverNav("games")}
          onMouseLeave={() => setHoverNav("")}
          onClick={() => setActiveNav("games")}
          className={
            activeNav === "games" || hoverNav === "games" ? "active-nav" : ""
          }
        >
          <Link to="/games">
            <ListIcon />
            Games
          </Link>
        </li>
      )}
      {user && (
        <li
          onMouseEnter={() => setHoverNav("logout")}
          onMouseLeave={() => setHoverNav("")}
          onClick={async () => {
            await signOut(auth);
          }}
          className={
            activeNav === "logout" || hoverNav === "logout" ? "active-nav" : ""
          }
        >
          <Link to="/">
            <LoginIcon style={{ transform: "scaleX(-1)" }} />
            Logout
          </Link>
        </li>
      )}
      <li className="chess-clan-logo">
        <ChessClanIcon />
      </li>
    </ul>
  );
}
