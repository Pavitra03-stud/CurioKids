import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import "../styles/StoryBasedNumbers.css";
import useGameProgress from "../hooks/useGameProgress";

/* =========================================================
   GAME ID
========================================================= */

const GAME_ID = "story-based-numbers";

/* =========================================================
   LEVEL CONFIG
========================================================= */

const levelConfig = {
  1: {
    title: "Level 1",
    max: 10,
    subtitle: "Learn 1 to 10",
  },

  2: {
    title: "Level 2",
    max: 50,
    subtitle: "Learn 1 to 50",
  },

  3: {
    title: "Level 3",
    max: 100,
    subtitle: "Learn 1 to 100",
  },
};

/* =========================================================
   BASE STORY
========================================================= */

const baseStory = [
  {
    number: 1,
    title: "One Bunny",
    story:
      "One little bunny woke up in the green forest.",
    image: "🐰",
    count: 1,
  },

  {
    number: 2,
    title: "Two Birds",
    story:
      "Then two birds came to sing with the bunny.",
    image: "🐦",
    count: 2,
  },

  {
    number: 3,
    title: "Three Apples",
    story:
      "Soon three apples fell from the tree near them.",
    image: "🍎",
    count: 3,
  },

  {
    number: 4,
    title: "Four Butterflies",
    story:
      "After that, four butterflies danced around happily.",
    image: "🦋",
    count: 4,
  },

  {
    number: 5,
    title: "Five Balloons",
    story:
      "Next, five balloons floated up into the bright sky.",
    image: "🎈",
    count: 5,
  },

  {
    number: 6,
    title: "Six Fish",
    story:
      "Then six fish splashed in the shining pond nearby.",
    image: "🐠",
    count: 6,
  },

  {
    number: 7,
    title: "Seven Flowers",
    story:
      "The bunny saw seven flowers blooming beside the path.",
    image: "🌸",
    count: 7,
  },

  {
    number: 8,
    title: "Eight Toys",
    story:
      "Soon eight toys were waiting under the big tree.",
    image: "🧸",
    count: 8,
  },

  {
    number: 9,
    title: "Nine Balls",
    story:
      "Then nine balls rolled across the soft green grass.",
    image: "⚽",
    count: 9,
  },

  {
    number: 10,
    title: "Ten Rainbows",
    story:
      "At the end, ten rainbows made the sky magical and bright.",
    image: "🌈",
    count: 10,
  },
];

/* =========================================================
   BUILD STORY
========================================================= */

function buildStory(max) {
  if (max <= 10) {
    return baseStory.slice(0, max);
  }

  const extraImages = [
    "🐰",
    "🐦",
    "🍎",
    "🦋",
    "🎈",
    "🐠",
    "🌸",
    "🧸",
    "⚽",
    "🌈",
  ];

  const stories = [];

  for (let i = 1; i <= max; i++) {
    if (i <= 10) {
      stories.push(baseStory[i - 1]);
    } else {
      stories.push({
        number: i,
        title: `Number ${i}`,
        story:
          `The story continued, and now ${i} friends were playing together happily.`,
        image:
          extraImages[(i - 1) % extraImages.length],
        count: i,
      });
    }
  }

  return stories;
}

/* =========================================================
   COMPONENT
========================================================= */

export default function StoryBasedNumbers({ goBack }) {
  const navigate = useNavigate();

  /*
    IMPORTANT:
    Level is now controlled by the URL.

    /story-based-numbers
    /story-based-numbers/level/1
    /story-based-numbers/level/2
    /story-based-numbers/level/3
  */

  const { level } = useParams();

  /* =========================================================
     FIREBASE
  ========================================================= */

  const initialState = {
    selectedLevel: null,
    currentIndex: 0,
    playing: false,
  };

  const {
    savedState,
    loading: progressLoading,
    save,
  } = useGameProgress(
    GAME_ID,
    initialState
  );

  /* =========================================================
     STATES
  ========================================================= */

  const [selectedLevel, setSelectedLevel] =
    useState(null);

  const [currentIndex, setCurrentIndex] =
    useState(0);

  const [playing, setPlaying] =
    useState(false);

  const [ready, setReady] =
    useState(false);

  /* =========================================================
     URL → LEVEL
     
     Every time the user enters a level,
     restart from number 1.
  ========================================================= */

  useEffect(() => {
    if (level) {
      const levelNumber = Number(level);

      if (levelConfig[levelNumber]) {
        stopSpeech();

        setSelectedLevel(levelNumber);

        /*
          ALWAYS START FROM NUMBER 1
        */

        setCurrentIndex(0);

        setPlaying(false);
      }
    } else {
      /*
        Selection page
      */

      stopSpeech();

      setSelectedLevel(null);
      setCurrentIndex(0);
      setPlaying(false);
    }
  }, [level]);

  /* =========================================================
     FIREBASE INITIALIZATION

     We intentionally DO NOT restore the old level/index.

     Firebase is still used for saving progress,
     but entering a level always begins at number 1.
  ========================================================= */

  useEffect(() => {
    if (progressLoading) return;

    if (!ready) {
      console.log(
        "🔥 Story Based Numbers saved state:",
        savedState
      );

      setReady(true);
    }
  }, [
    progressLoading,
    savedState,
    ready,
  ]);

  /* =========================================================
     LEVEL DATA
  ========================================================= */

  const currentLevel = selectedLevel
    ? levelConfig[selectedLevel]
    : null;

  const storyData = selectedLevel
    ? buildStory(currentLevel.max)
    : [];

  const currentStory =
    storyData[currentIndex];

  /* =========================================================
     SPEECH
  ========================================================= */

  const stopSpeech = () => {
    if (
      typeof window !== "undefined" &&
      window.speechSynthesis
    ) {
      window.speechSynthesis.cancel();
    }
  };

  const speak = (text, callback) => {
    if (
      typeof window !== "undefined" &&
      "speechSynthesis" in window
    ) {
      window.speechSynthesis.cancel();

      const utterance =
        new SpeechSynthesisUtterance(text);

      utterance.rate = 0.72;
      utterance.pitch = 1;

      utterance.onend = callback;

      window.speechSynthesis.speak(
        utterance
      );
    } else if (callback) {
      callback();
    }
  };

  /* =========================================================
     PLAY STORY
  ========================================================= */

  const playStory = () => {
    if (
      playing ||
      !storyData.length
    ) {
      return;
    }

    setPlaying(true);

    let index = currentIndex;

    const playNext = () => {
      if (index >= storyData.length) {
        setPlaying(false);
        return;
      }

      setCurrentIndex(index);

      const story =
        storyData[index];

      const line =
        `Number ${story.number}. ${story.story}`;

      speak(line, () => {
        index += 1;

        setTimeout(() => {
          playNext();
        }, 700);
      });
    };

    playNext();
  };

  /* =========================================================
     STOP STORY
  ========================================================= */

  const stopStory = () => {
    stopSpeech();
    setPlaying(false);
  };

  /* =========================================================
     NEXT STORY
  ========================================================= */

  const nextStory = async () => {
    if (!storyData.length) return;

    stopStory();

    const nextIndex =
      currentIndex <
      storyData.length - 1
        ? currentIndex + 1
        : 0;

    setCurrentIndex(nextIndex);

    await save({
      selectedLevel,
      currentIndex: nextIndex,
      playing: false,
    });
  };

  /* =========================================================
     PREVIOUS STORY
  ========================================================= */

  const prevStory = async () => {
    if (!storyData.length) return;

    stopStory();

    const previousIndex =
      currentIndex > 0
        ? currentIndex - 1
        : storyData.length - 1;

    setCurrentIndex(previousIndex);

    await save({
      selectedLevel,
      currentIndex: previousIndex,
      playing: false,
    });
  };

  /* =========================================================
     OPEN LEVEL
     
     This changes the URL.

     Browser Back can therefore return to
     the level selection page normally.
  ========================================================= */

  const openLevel = (levelNumber) => {
    stopStory();

    setSelectedLevel(levelNumber);
    setCurrentIndex(0);
    setPlaying(false);

    navigate(
      `/story-based-numbers/level/${levelNumber}`
    );
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (
    progressLoading ||
    !ready
  ) {
    return (
      <div className="sb-page">

        <header className="sb-header">
          <h1>
            📖 Story Based Numbers
          </h1>
        </header>

        <main className="sb-level-container">

          <div className="sb-level-card sb-loading-card">

            <div className="sb-loading-icon">
              📖
            </div>

            <h2>
              Loading your lesson...
            </h2>

            <p>
              Preparing your story ✨
            </p>

          </div>

        </main>

      </div>
    );
  }

  /* =========================================================
     LEVEL SELECTION PAGE
  ========================================================= */

  if (!selectedLevel) {
    return (
      <div className="sb-page">

        <header className="sb-header">
          <h1>
            📖 Story Based Numbers
          </h1>
        </header>

        <main className="sb-level-container">

          <div className="sb-level-card">

            <div className="sb-level-icon">
              📖
            </div>

            <h2 className="sb-level-title">
              Choose a Level
            </h2>

            <p className="sb-level-description">
              Learn numbers through fun little stories
            </p>

            <div className="sb-level-grid">

              {/* LEVEL 1 */}

              <div
                className="sb-level-box sb-level-one"
                onClick={() =>
                  openLevel(1)
                }
              >
                <div className="sb-level-box-content">

                  <h2>
                    Level 1
                  </h2>

                  <p>
                    Learn 1 to 10
                  </p>

                  <span className="sb-level-arrow">
                    →
                  </span>

                </div>
              </div>

              {/* LEVEL 2 */}

              <div
                className="sb-level-box sb-level-two"
                onClick={() =>
                  openLevel(2)
                }
              >
                <div className="sb-level-box-content">

                  <h2>
                    Level 2
                  </h2>

                  <p>
                    Learn 1 to 50
                  </p>

                  <span className="sb-level-arrow">
                    →
                  </span>

                </div>
              </div>

              {/* LEVEL 3 */}

              <div
                className="sb-level-box sb-level-three"
                onClick={() =>
                  openLevel(3)
                }
              >
                <div className="sb-level-box-content">

                  <h2>
                    Level 3
                  </h2>

                  <p>
                    Learn 1 to 100
                  </p>

                  <span className="sb-level-arrow">
                    →
                  </span>

                </div>
              </div>

            </div>

          </div>

        </main>

      </div>
    );
  }

  /* =========================================================
     STORY PAGE
  ========================================================= */

  return (
    <div className="sb-page">

      <header className="sb-header">
        <h1>
          📖 {currentLevel.title}
        </h1>
      </header>

      <main className="sb-container">

        {/* =====================================================
            PROGRESS STRIP
        ===================================================== */}

        <div className="sb-progress-area">

          <div className="sb-progress-label">
            Number {currentStory.number} of{" "}
            {currentLevel.max}
          </div>

          <div className="sb-progress-strip">

            {storyData.map(
              (item, index) => (
                <button
                  key={item.number}
                  className={
                    `sb-mini-card ${
                      currentIndex === index
                        ? "active"
                        : ""
                    }`
                  }
                  onClick={() => {
                    stopStory();
                    setCurrentIndex(index);

                    save({
                      selectedLevel,
                      currentIndex: index,
                      playing: false,
                    });
                  }}
                >
                  {item.number}
                </button>
              )
            )}

          </div>

        </div>

        {/* =====================================================
            MAIN STORY CARD
        ===================================================== */}

        <div className="sb-main-story-card">

          <div className="sb-story-top">

            <div className="sb-story-number">
              {currentStory.number}
            </div>

            <div className="sb-story-title">
              {currentStory.title}
            </div>

          </div>

          {/* ===================================================
              OBJECTS
          =================================================== */}

          <div className="sb-story-image-card">

            {Array.from({
              length: currentStory.count,
            }).map((_, index) => (
              <span
                key={index}
                className="sb-story-emoji"
              >
                {currentStory.image}
              </span>
            ))}

          </div>

          {/* ===================================================
              STORY
          =================================================== */}

          <div className="sb-story-box">

            <div className="sb-story-text">
              {currentStory.story}
            </div>

          </div>

        </div>

        {/* =====================================================
            ACTION BUTTONS
        ===================================================== */}

        <div className="sb-actions">

          <button
            className="sb-play-btn prev"
            onClick={prevStory}
          >
            <span>
              ←
            </span>

            Previous
          </button>

          <button
            className="sb-play-btn play"
            onClick={
              playing
                ? stopStory
                : playStory
            }
          >
            <span>
              {playing ? "⏸" : "▶"}
            </span>

            {playing
              ? "Stop Story"
              : "Play Story"}
          </button>

          <button
            className="sb-play-btn next"
            onClick={nextStory}
          >
            Next

            <span>
              →
            </span>
          </button>

        </div>

      </main>

    </div>
  );
}