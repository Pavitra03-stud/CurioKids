import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/StoryBasedNumbers.css";

const levelConfig = {
  1: { title: "Level 1", max: 10, subtitle: "Learn 1 to 10" },
  2: { title: "Level 2", max: 50, subtitle: "Learn 1 to 50" },
  3: { title: "Level 3", max: 100, subtitle: "Learn 1 to 100" },
};

const baseStory = [
  {
    number: 1,
    title: "One Bunny",
    story: "One little bunny woke up in the green forest.",
    image: "🐰",
    count: 1,
  },
  {
    number: 2,
    title: "Two Birds",
    story: "Then two birds came to sing with the bunny.",
    image: "🐦",
    count: 2,
  },
  {
    number: 3,
    title: "Three Apples",
    story: "Soon three apples fell from the tree near them.",
    image: "🍎",
    count: 3,
  },
  {
    number: 4,
    title: "Four Butterflies",
    story: "After that, four butterflies danced around happily.",
    image: "🦋",
    count: 4,
  },
  {
    number: 5,
    title: "Five Balloons",
    story: "Next, five balloons floated up into the bright sky.",
    image: "🎈",
    count: 5,
  },
  {
    number: 6,
    title: "Six Fish",
    story: "Then six fish splashed in the shining pond nearby.",
    image: "🐠",
    count: 6,
  },
  {
    number: 7,
    title: "Seven Flowers",
    story: "The bunny saw seven flowers blooming beside the path.",
    image: "🌸",
    count: 7,
  },
  {
    number: 8,
    title: "Eight Toys",
    story: "Soon eight toys were waiting under the big tree.",
    image: "🧸",
    count: 8,
  },
  {
    number: 9,
    title: "Nine Balls",
    story: "Then nine balls rolled across the soft green grass.",
    image: "⚽",
    count: 9,
  },
  {
    number: 10,
    title: "Ten Rainbows",
    story: "At the end, ten rainbows made the sky magical and bright.",
    image: "🌈",
    count: 10,
  },
];

function buildStory(max) {
  if (max <= 10) return baseStory.slice(0, max);

  const extraImages = ["🐰", "🐦", "🍎", "🦋", "🎈", "🐠", "🌸", "🧸", "⚽", "🌈"];

  const stories = [];
  for (let i = 1; i <= max; i++) {
    if (i <= 10) {
      stories.push(baseStory[i - 1]);
    } else {
      stories.push({
        number: i,
        title: `Number ${i}`,
        story: `The story continued, and now ${i} friends were playing together happily.`,
        image: extraImages[(i - 1) % extraImages.length],
        count: i,
      });
    }
  }
  return stories;
}

export default function StoryBasedNumbers({ goBack }) {
  const navigate = useNavigate();
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playing, setPlaying] = useState(false);

  const currentLevel = selectedLevel ? levelConfig[selectedLevel] : null;
  const storyData = selectedLevel ? buildStory(currentLevel.max) : [];
  const currentStory = storyData[currentIndex];

  const speak = (text, callback) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.rate = 0.72;
      utter.pitch = 1;
      utter.onend = callback;
      window.speechSynthesis.speak(utter);
    } else if (callback) {
      callback();
    }
  };

  const playStory = () => {
    if (playing || !storyData.length) return;

    setPlaying(true);
    let index = currentIndex;

    const playNext = () => {
      if (index >= storyData.length) {
        setPlaying(false);
        return;
      }

      setCurrentIndex(index);

      const line = `Number ${storyData[index].number}. ${storyData[index].story}`;
      speak(line, () => {
        index += 1;
        setTimeout(playNext, 700);
      });
    };

    playNext();
  };

  const stopStory = () => {
    window.speechSynthesis.cancel();
    setPlaying(false);
  };

  const nextStory = () => {
    if (!storyData.length) return;
    setCurrentIndex((prev) => (prev < storyData.length - 1 ? prev + 1 : 0));
    stopStory();
  };

  const prevStory = () => {
    if (!storyData.length) return;
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : storyData.length - 1));
    stopStory();
  };

  const openLevel = (level) => {
    setSelectedLevel(level);
    setCurrentIndex(0);
    setPlaying(false);
    window.speechSynthesis.cancel();
  };

  if (!selectedLevel) {
    return (
      <div className="sb-page">
        <div className="sb-header">
          <button
            className="sb-back-btn"
            onClick={goBack ? goBack : () => navigate(-1)}
          >
            ←
          </button>
          <h1>📖 Story Based Numbers</h1>
        </div>

        <div className="sb-level-container">
          <div className="sb-level-card">
            <div className="sb-level-title">Choose a Level</div>

            <div className="sb-level-grid">
              <div className="sb-level-box" onClick={() => openLevel(1)}>
                <h2>Level 1</h2>
                <p>Learn 1 to 10</p>
              </div>

              <div className="sb-level-box" onClick={() => openLevel(2)}>
                <h2>Level 2</h2>
                <p>Learn 1 to 50</p>
              </div>

              <div className="sb-level-box" onClick={() => openLevel(3)}>
                <h2>Level 3</h2>
                <p>Learn 1 to 100</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="sb-page">
      <div className="sb-header">
        <button className="sb-back-btn" onClick={() => setSelectedLevel(null)}>
          ←
        </button>
        <h1>📖 {currentLevel.title}</h1>
      </div>

      <div className="sb-container">
        <div className="sb-progress-strip">
          {storyData.slice(0, Math.min(storyData.length, 10)).map((item, index) => (
            <div
              key={item.number}
              className={`sb-mini-card ${currentIndex === index ? "active" : ""}`}
              onClick={() => {
                setCurrentIndex(index);
                stopStory();
              }}
            >
              {item.number}
            </div>
          ))}
        </div>

        <div className="sb-main-story-card">
          <div className="sb-story-number">{currentStory.number}</div>
          <div className="sb-story-title">{currentStory.title}</div>

          <div className="sb-story-image-card">
            {Array.from({ length: Math.min(currentStory.count, 10) }).map((_, i) => (
              <span key={i} className="sb-story-emoji">
                {currentStory.image}
              </span>
            ))}
          </div>

          <div className="sb-story-box">{currentStory.story}</div>
        </div>

        <div className="sb-actions">
          <button className="sb-play-btn prev" onClick={prevStory}>
            ← Previous
          </button>

          <button className="sb-play-btn" onClick={playing ? stopStory : playStory}>
            {playing ? "⏸ Stop Story" : "▶️ Play Story"}
          </button>

          <button className="sb-play-btn next" onClick={nextStory}>
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}