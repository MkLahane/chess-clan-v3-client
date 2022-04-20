import React from "react";

export default function MovesComponent({ gameId }) {
  if (gameId === null) {
    return (
      <div className="toolbar-div">
        <label>No active game...</label>
      </div>
    );
  }
  return (
    <div className="toolbar-div">
      <label>List of Moves...</label>
    </div>
  );
}
