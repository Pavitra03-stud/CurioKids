import { useState } from "react";
import "../styles/gameCommon.css";

export default function FillBucket({ goBack }) {

  // 🎯 random number generator
  const getRandomNumber = () => {
    return Math.floor(Math.random() * 6) + 2; // 2 to 7
  };

  const [target, setTarget] = useState(getRandomNumber());
  const [bucket, setBucket] = useState([]);
  const [message, setMessage] = useState("");

  // 🎯 choose item based on number
  const getItem = (num) => {
    if (num <= 2) return "🍎";
    if (num <= 4) return "🍌";
    if (num <= 6) return "🍇";
    return "🍓";
  };

  const item = getItem(target);

  // 🟢 drag start
  const handleDragStart = (e) => {
    e.dataTransfer.setData("item", item);
  };

  // 🟢 allow drop
  const allowDrop = (e) => {
    e.preventDefault();
  };

  // 🟢 drop logic
  const handleDrop = (e) => {
    e.preventDefault();

    if (bucket.length >= target) return;

    const newItem = { id: Date.now() };
    const newBucket = [...bucket, newItem];

    setBucket(newBucket);

    if (newBucket.length === target) {
      setMessage("Perfect! 🎉");
    }
  };

  // 🔄 reset game
  const reset = () => {
    setBucket([]);
    setMessage("");
    setTarget(getRandomNumber()); // 🔥 NEW RANDOM NUMBER
  };

  return (
    <div className="game-page">

      {/* Header */}
      <div className="header">
        <button onClick={goBack}>⬅</button>
        <h1>Fill the Bucket</h1>
      </div>

      {/* Instruction */}
      <p className="instruction">
        Drag <strong>{target}</strong> {item} into bucket
      </p>

      {/* Item source */}
      <div className="apple-source">
        <div
          className="apple draggable"
          draggable
          onDragStart={handleDragStart}
        >
          {item}
        </div>
      </div>

      {/* Bucket */}
      <div
        className="bucket-area drop-zone"
        onDragOver={allowDrop}
        onDrop={handleDrop}
      >
        {bucket.map((b) => (
          <div key={b.id} className="bucket-apple">
            {item}
          </div>
        ))}
      </div>

      {/* Feedback */}
      <h2>{message}</h2>

      {/* Restart */}
      {message && (
        <button className="next-btn" onClick={reset}>
          Play Again →
        </button>
      )}
    </div>
  );
}