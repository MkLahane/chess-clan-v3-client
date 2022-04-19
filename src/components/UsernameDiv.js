import React from "react";

export default function UsernameDiv({ user, username, rating }) {
  if (!user) {
    return <div className="user-div">Loading...</div>;
  }
  return (
    <div className="user-div">
      <div>
        <img alt="userimage" src="../chess-pieces/p_w.png" />
      </div>
      <h2>{username}</h2>
      <h2>--</h2>
      <h2>{rating}</h2>
    </div>
  );
}
