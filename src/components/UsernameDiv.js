import React from "react";

export default function UsernameDiv({ rating, username, opponent, displayMe }) {
  return (
    <div className="user-div">
      <div>
        <img alt="userimage" src="../chess-pieces/p_w.png" />
      </div>
      <h2>{displayMe ? username : opponent.username}</h2>
      <h2>--</h2>
      <h2>{rating}</h2>
    </div>
  );
}
