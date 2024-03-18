import { useState } from 'react';
import applauseSound from './aplauze/aplauze.mp3';

function Square({ value, onSquareClick, isWinningSquare }) {
  return (
    <button className={`square ${isWinningSquare ? 'winning' : ''}`} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay, winningSquares }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  function renderSquare(i) {
    return (
      <Square
        value={squares[i]}
        onSquareClick={() => handleClick(i)}
        isWinningSquare={winningSquares && winningSquares.includes(i)}
      />
    );
  }

  const applauseAudio = new Audio(applauseSound);

function playApplauseSound() {
  applauseAudio.play();
}

  const winner = calculateWinner(squares);
  let status;
  let winningLineClass = '';

  if (winner) {
    status = `Winner: ${winner}`;
    winningLineClass = 'winning';
    playApplauseSound();
  } else {
    status = `Next player: ${xIsNext ? 'X' : 'O'}`;
  }

  return (
    <>
      <div className={`status ${winningLineClass}`}>{status}</div>
      <div className={`board-row ${winningLineClass}`}>
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className={`board-row ${winningLineClass}`}>
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className={`board-row ${winningLineClass}`}>
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = history.slice(0, currentMove + 1).concat([nextSquares]);
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function resetGame() {
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
  }

  const winner = calculateWinner(currentSquares);
  const isNextPlayerX = currentMove % 2 === 0;

  let status;
  if (winner) {
    status = `Winner: ${winner}`;
  } else {
    status = `Next player: ${isNextPlayerX ? 'X' : 'O'}`;
  }

  return (
    <div className="game with-colored-background">
      <div className="game-board">
        <Board xIsNext={isNextPlayerX} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
      <div className="status">{status}</div>
        <button className="reset-button" onClick={resetGame}>
          Reset Game
        </button>
      </div>
      </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}