import { useEffect, useState } from "react";
import BackIcon from "../components/BackIcon";
import "../styles/ChooseFriend.css";

export default function ChooseFriend({ onComplete, goBack }) {
  const [friends, setFriends] = useState([]);
  const [index, setIndex] = useState(0);
  const [showIntro, setShowIntro] = useState(false);
  const [text, setText] = useState("");

  useEffect(() => {
    fetch("/friends.json")
      .then((res) => res.json())
      .then(setFriends);
  }, []);

  const current = friends[index];

  useEffect(() => {
    if (!showIntro || !current) return;

    const fullText = `${current.intro}\n\n${current.about}`;
    let i = 0;
    setText("");

    const timer = setInterval(() => {
      setText((prev) => prev + fullText[i]);
      i++;
      if (i >= fullText.length) clearInterval(timer);
    }, 30);

    return () => clearInterval(timer);
  }, [showIntro, current]);

  const handleBegin = () => {
    localStorage.setItem(
      "jungleFriend",
      JSON.stringify({
        id: current.id,
        name: current.name,
        image: current.image,
      })
    );

    localStorage.setItem("appProgress", "friend-chosen");
    onComplete(); // ✅ ONLY THIS
  };

  if (!friends.length) return <h2>Loading jungle friends… 🌱</h2>;

  return (
    <div className="choose-container">
      <BackIcon goBack={goBack} />

      {!showIntro ? (
        <div className="board">
          <div className="carousel">
            <button onClick={() => setIndex((i) => (i - 1 + friends.length) % friends.length)}>◀</button>
            <img src={current.image} alt={current.name} />
            <button onClick={() => setIndex((i) => (i + 1) % friends.length)}>▶</button>
          </div>

          <h2>{current.name}</h2>

          <button className="start" onClick={() => setShowIntro(true)}>
            Start ▶
          </button>
        </div>
      ) : (
        <div className="intro-board">
          <h1>Meet {current.name}</h1>
          <img src={current.image} alt={current.name} />
          <p className="typing">{text}</p>

          <button className="start big" onClick={handleBegin}>
            Let’s Begin 🌈
          </button>
        </div>
      )}
    </div>
  );
}
