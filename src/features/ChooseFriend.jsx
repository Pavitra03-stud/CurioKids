import { useEffect, useState } from "react";
import "../styles/ChooseFriend.css";

export default function ChooseFriend({ onComplete }) {
  const [friends, setFriends] = useState([]);
  const [index, setIndex] = useState(0);
  const [showIntro, setShowIntro] = useState(false);
  const [text, setText] = useState("");

  useEffect(() => {
    fetch("/friends.json")
      .then((res) => res.json())
      .then((data) => setFriends(data))
      .catch(() => alert("Failed to load friends"));
  }, []);

  const current = friends[index];

  /* ⌨️ Typing effect */
  useEffect(() => {
    if (!showIntro || !current) return;

    const fullText = `${current.intro}\n\n${current.about}`;
    let i = 0;
    setText("");

    const timer = setInterval(() => {
      setText((prev) => prev + fullText[i]);
      i++;
      if (i >= fullText.length) clearInterval(timer);
    }, 35);

    return () => clearInterval(timer);
  }, [showIntro, current]);

  /* ✅ SAVE FRIEND TO LOCAL STORAGE */
  const handleBegin = () => {
    if (!current) return;

    const selectedFriend = {
      id: current.id,
      name: current.name,
      image: current.image,
    };

    localStorage.setItem("jungleFriend", JSON.stringify(selectedFriend));
    localStorage.setItem("appProgress", "friend-chosen");

    onComplete();
  };

  if (!friends.length) return <h2>🌱 Loading jungle friends...</h2>;

  return (
    <div className="choose-container">
      {!showIntro ? (
        <div className="board">
          <h1>🐾 Choose Your Jungle Friend</h1>

          <div className="carousel">
            <button
              onClick={() =>
                setIndex((i) => (i - 1 + friends.length) % friends.length)
              }
            >
              ◀
            </button>

            <img src={current.image} alt={current.name} />

            <button
              onClick={() =>
                setIndex((i) => (i + 1) % friends.length)
              }
            >
              ▶
            </button>
          </div>

          <h2>{current.name}</h2>

          <button className="start" onClick={() => setShowIntro(true)}>
            Start ▶
          </button>
        </div>
      ) : (
        <div className="intro-board">
          <h1>Meet {current.name}</h1>

          <div className="character-frame">
            <img src={current.image} alt={current.name} />
          </div>

          <div className="speech">
            <p className="typing">{text}</p>
          </div>

          <button className="start big" onClick={handleBegin}>
            Let’s Begin 🌈
          </button>
        </div>
      )}
    </div>
  );
}
