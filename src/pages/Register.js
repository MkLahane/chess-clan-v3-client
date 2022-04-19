import React, { useState, useContext } from "react";
import { FirebaseContext } from "../contexts/FirebaseContext";
import { register } from "../contexts/Auth";
import "./Auth.css";

export default function Register(props) {
  const { db } = useContext(FirebaseContext);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");
  return (
    <div className="register-div">
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          console.log("Submitted!");
          const { ok, errorMsg } = await register(
            db,
            username,
            email,
            password
          );
          if (ok === -1) {
            setErrMsg(errorMsg.message);
          } else {
            props.history.push("/");
          }
        }}
      >
        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
        />
        <input
          value={password}
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          type="password"
        />
        <button type="submit">Register</button>
      </form>
      {errMsg !== "" && <div className="error-div">{errMsg}</div>}
    </div>
  );
}
