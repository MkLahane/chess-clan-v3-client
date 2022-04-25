import React from "react";

export default function ChatComponent() {
  const chat = [
    { username: "user1", msg: "Hello user1" },
    { username: "user2", msg: "Hello user2" },
  ];
  return (
    <div className="toolbar-div">
      <label>List of Messages...</label>
      <ul className="chat">
        {chat.map(({ username, msg }, index) => (
          <li key={index}>
            <span>{username}</span>
            <span>{msg}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
