import React, { useState } from "react";
import { logIn } from "../contexts/Auth";
import "./Auth.css";

export default function Login({ history }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [infocusInput, setInFocusInput] = useState("");
  return (
    <div className="login-div">
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const { ok, errorMsg } = await logIn(email, password);
          if (ok === -1) {
            setErrMsg(errorMsg.message);
          } else {
            history.push("/");
          }
        }}
      >
        <input
          className={infocusInput === "email" ? "infocus-input" : ""}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          type="email"
          onFocus={() => setInFocusInput("email")}
          onBlur={() => setInFocusInput("")}
        />
        <input
          className={infocusInput === "password" ? "infocus-input" : ""}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          type="password"
          onFocus={() => setInFocusInput("password")}
          onBlur={() => setInFocusInput("")}
        />
        <button type="submit">Log In</button>
      </form>
      {errMsg !== "" && <div className="error-div">{errMsg}</div>}
    </div>
  );
}
