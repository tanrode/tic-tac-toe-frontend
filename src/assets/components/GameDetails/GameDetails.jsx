import React, { useState } from "react";
import "./GameDetails.css";

export default function GameDetails(props) {
  const [isPlayerEditable, setIsPlayerEditable] = useState(false);

  let playerName = <span className="player-name">{props.playerName}</span>;

  if (isPlayerEditable) {
    playerName = (
      <input
        type="text"
        value={props.playerName}
        onChange={(e) => {
          props.setPlayerName(e.target.value);
          props.socket.emit("player-name-change", {
            playerName: e.target.value,
            playerNumber: props.playerNumber,
          });
        }}
      />
    );
  }

  return (
    <>
      <span className="player">
        {playerName} <p>{props.symbol}</p>
        <button onClick={() => setIsPlayerEditable((prev) => !prev)}>
          {isPlayerEditable ? "Save" : "Edit"}
        </button>
      </span>
    </>
  );
}
