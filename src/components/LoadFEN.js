import React, { useContext, useState } from "react";
import { FirebaseContext } from "../contexts/FirebaseContext";
import { GameContext, update_game_fen } from "../contexts/Game";
import { ReactComponent as ChessboardIcon } from "../icons/chessboard-icon.svg";

export default function LoadFEN() {
  const { db } = useContext(FirebaseContext);
  const { game_id, accepted, validateFen, loadFen } = useContext(GameContext);
  const [fen, setFen] = useState("");
  const [openLoadFen, setOpenLoadFen] = useState(false);
  return (
    <div className="load-fen-div">
      <button
        onClick={() => setOpenLoadFen(true)}
        className={accepted ? "game-btn game-inactive-btn" : "game-btn"}
      >
        <ChessboardIcon />
        Load Fen
      </button>
      {openLoadFen && (
        <div
          className="notif-div"
          onClick={(e) => {
            const type = e.target.type;
            if (!type) {
              setOpenLoadFen(false);
            }
          }}
        >
          <div className="fen-div">
            <input
              className="fen-input"
              value={fen}
              onChange={(e) => setFen(e.target.value)}
            />
            <button
              onClick={() => {
                if (fen.trim() !== "") {
                  if (validateFen(fen)) {
                    loadFen(fen);
                    setOpenLoadFen(false);
                    update_game_fen(db, game_id, fen);
                  }
                }
              }}
              className="game-btn"
            >
              &#8594;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
