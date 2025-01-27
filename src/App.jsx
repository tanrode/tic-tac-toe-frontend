import { useState } from "react";
import "./App.css";
import GameDetails from "./assets/components/GameDetails/GameDetails";
import GameBoard from "./assets/components/GameBoard/GameBoard";
import io from "socket.io-client";

function App() {
  const [playerOneName, setPlayerOneName] = useState("Player 1");
  const [playerTwoName, setPlayerTwoName] = useState("Player 2");

  // const socket = io("http://localhost:4000");
  const socket = io("https://tic-tac-toe-backend-xftm.onrender.com");

  socket.on("player-name-change", (data) => {
    if (data.playerNumber === "1") setPlayerOneName(data.playerName);
    if (data.playerNumber === "2") setPlayerTwoName(data.playerName);
  });

  return (
    <>
      <header className="App-header">
        <h1 id="heading">Tic-Tac-Toe</h1>
        <img src="game-logo.png" id="app-logo" alt="logo" />
      </header>
      <main>
        <div id="game-container">
          <div id="game-details">
            <GameDetails
              playerNumber="1"
              playerName={playerOneName}
              setPlayerName={setPlayerOneName}
              symbol="X"
              socket={socket}
            />
            <GameDetails
              playerNumber="2"
              playerName={playerTwoName}
              setPlayerName={setPlayerTwoName}
              symbol="O"
              socket={socket}
            />
          </div>
        </div>
      </main>
      <GameBoard
        player1={playerOneName}
        player2={playerTwoName}
        socket={socket}
      />
    </>
  );
}

export default App;
