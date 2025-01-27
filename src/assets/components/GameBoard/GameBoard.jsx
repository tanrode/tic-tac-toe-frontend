import "./GameBoard.css";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { useState } from "react";

const initGameBoard = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
];

function resetGameBoard(setGameBoard, setPlayerTurn) {
  setGameBoard(initGameBoard);
  setPlayerTurn("1");
}

function onCellClick(
  player,
  rowIndex,
  cellIndex,
  gameBoard,
  setGameBoard,
  setOpen,
  setAlert,
  setPlayerTurn,
  socket
) {
  const newGameBoard = gameBoard.map((row, rIndex) =>
    row.map((cell, cIndex) => {
      if (rIndex === rowIndex && cIndex === cellIndex && cell === null) {
        return player === "1" ? "X" : "O";
      }
      return cell;
    })
  );

  setGameBoard(newGameBoard);
  socket.emit("player-move", { board: newGameBoard, player: player });

  // Check for winning conditions
  const currentPlayerMark = player === "1" ? "X" : "O";
  if (checkWinner(newGameBoard, currentPlayerMark)) {
    socket.emit("player-win", { modal: true, player: player });
  } else if (newGameBoard.flat().every((cell) => cell !== null)) {
    socket.emit("player-win", { modal: true, player: "0" });
  }

  // console.log("Clicked!", newGameBoard);
  // console.log(player);
}

// Function to check for a winner
function checkWinner(gameBoard, mark) {
  // Check rows
  for (let row of gameBoard) {
    if (row.every((cell) => cell === mark)) {
      return true;
    }
  }

  // Check columns
  for (let col = 0; col < gameBoard[0].length; col++) {
    if (gameBoard.every((row) => row[col] === mark)) {
      return true;
    }
  }

  // Check diagonals
  const diagonal1 = gameBoard.every((row, index) => row[index] === mark);
  const diagonal2 = gameBoard.every(
    (row, index) => row[gameBoard.length - 1 - index] === mark
  );

  return diagonal1 || diagonal2;
}

const style = {
  position: "absolute",
  top: "20%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "#46432f",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function GameBoard({ player1, player2, socket }) {
  const [gameBoard, setGameBoard] = useState(initGameBoard);
  const [playerTurn, setPlayerTurn] = useState("1");
  const [open, setOpen] = useState(false);
  const [alert, setAlert] = useState("");
  const handleClose = () => {
    socket.emit("reset-game", { modal: false });
    // setOpen(false);
    // resetGameBoard(setGameBoard, setPlayerTurn);
  };

  socket.on("player-move", (data) => {
    setGameBoard(data.board);
    setPlayerTurn(data.player === "1" ? "2" : "1");
  });

  socket.on("player-win", (data) => {
    setOpen(data.modal);
    setAlert(data.player);
  });

  socket.on("reset-game", (data) => {
    setOpen(data.modal);
    resetGameBoard(setGameBoard, setPlayerTurn);
  });

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {alert === "0"
              ? "It's a draw!"
              : `${alert === "1" ? player1 : player2} wins!`}
          </Typography>
        </Box>
      </Modal>
      <table>
        <tbody>
          {gameBoard.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className={cell}
                  onClick={() => {
                    setPlayerTurn((playerTurn) =>
                      playerTurn === "1" ? "2" : "1"
                    );
                    onCellClick(
                      playerTurn,
                      rowIndex,
                      cellIndex,
                      gameBoard,
                      setGameBoard,
                      setOpen,
                      setAlert,
                      setPlayerTurn,
                      socket
                    );
                  }}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
