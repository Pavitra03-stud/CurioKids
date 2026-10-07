// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "../styles/StoryBasedNumbers.css";

// const levelConfig = {
//   1: { title: "Level 1", max: 10, subtitle: "Learn 1 to 10" },
//   2: { title: "Level 2", max: 50, subtitle: "Learn 1 to 50" },
//   3: { title: "Level 3", max: 100, subtitle: "Learn 1 to 100" },
// };

// const baseStory = [
//   {
//     number: 1,
//     title: "One Bunny",
//     story: "One little bunny woke up in the green forest.",
//     image: "🐰",
//     count: 1,
//   },
//   {
//     number: 2,
//     title: "Two Birds",
//     story: "Then two birds came to sing with the bunny.",
//     image: "🐦",
//     count: 2,
//   },
//   {
//     number: 3,
//     title: "Three Apples",
//     story: "Soon three apples fell from the tree near them.",
//     image: "🍎",
//     count: 3,
//   },
//   {
//     number: 4,
//     title: "Four Butterflies",
//     story: "After that, four butterflies danced around happily.",
//     image: "🦋",
//     count: 4,
//   },
//   {
//     number: 5,
//     title: "Five Balloons",
//     story: "Next, five balloons floated up into the bright sky.",
//     image: "🎈",
//     count: 5,
//   },
//   {
//     number: 6,
//     title: "Six Fish",
//     story: "Then six fish splashed in the shining pond nearby.",
//     image: "🐠",
//     count: 6,
//   },
//   {
//     number: 7,
//     title: "Seven Flowers",
//     story: "The bunny saw seven flowers blooming beside the path.",
//     image: "🌸",
//     count: 7,
//   },
//   {
//     number: 8,
//     title: "Eight Toys",
//     story: "Soon eight toys were waiting under the big tree.",
//     image: "🧸",
//     count: 8,
//   },
//   {
//     number: 9,
//     title: "Nine Balls",
//     story: "Then nine balls rolled across the soft green grass.",
//     image: "⚽",
//     count: 9,
//   },
//   {
//     number: 10,
//     title: "Ten Rainbows",
//     story: "At the end, ten rainbows made the sky magical and bright.",
//     image: "🌈",
//     count: 10,
//   },
// ];

// function buildStory(max) {
//   if (max <= 10) return baseStory.slice(0, max);

//   const extraImages = ["🐰", "🐦", "🍎", "🦋", "🎈", "🐠", "🌸", "🧸", "⚽", "🌈"];

//   const stories = [];
//   for (let i = 1; i <= max; i++) {
//     if (i <= 10) {
//       stories.push(baseStory[i - 1]);
//     } else {
//       stories.push({
//         number: i,
//         title: `Number ${i}`,
//         story: `The story continued, and now ${i} friends were playing together happily.`,
//         image: extraImages[(i - 1) % extraImages.length],
//         count: i,
//       });
//     }
//   }
//   return stories;
// }

// export default function StoryBasedNumbers({ goBack }) {
//   const navigate = useNavigate();
//   const [selectedLevel, setSelectedLevel] = useState(null);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [playing, setPlaying] = useState(false);

//   const currentLevel = selectedLevel ? levelConfig[selectedLevel] : null;
//   const storyData = selectedLevel ? buildStory(currentLevel.max) : [];
//   const currentStory = storyData[currentIndex];

//   const speak = (text, callback) => {
//     if ("speechSynthesis" in window) {
//       window.speechSynthesis.cancel();
//       const utter = new SpeechSynthesisUtterance(text);
//       utter.rate = 0.72;
//       utter.pitch = 1;
//       utter.onend = callback;
//       window.speechSynthesis.speak(utter);
//     } else if (callback) {
//       callback();
//     }
//   };

//   const playStory = () => {
//     if (playing || !storyData.length) return;

//     setPlaying(true);
//     let index = currentIndex;

//     const playNext = () => {
//       if (index >= storyData.length) {
//         setPlaying(false);
//         return;
//       }

//       setCurrentIndex(index);

//       const line = `Number ${storyData[index].number}. ${storyData[index].story}`;
//       speak(line, () => {
//         index += 1;
//         setTimeout(playNext, 700);
//       });
//     };

//     playNext();
//   };

//   const stopStory = () => {
//     window.speechSynthesis.cancel();
//     setPlaying(false);
//   };

//   const nextStory = () => {
//     if (!storyData.length) return;
//     setCurrentIndex((prev) => (prev < storyData.length - 1 ? prev + 1 : 0));
//     stopStory();
//   };

//   const prevStory = () => {
//     if (!storyData.length) return;
//     setCurrentIndex((prev) => (prev > 0 ? prev - 1 : storyData.length - 1));
//     stopStory();
//   };

//   const openLevel = (level) => {
//     setSelectedLevel(level);
//     setCurrentIndex(0);
//     setPlaying(false);
//     window.speechSynthesis.cancel();
//   };

//   if (!selectedLevel) {
//     return (
//       <div className="sb-page">
//         <div className="sb-header">
//           <button
//             className="sb-back-btn"
//             onClick={goBack ? goBack : () => navigate(-1)}
//           >
//             ←
//           </button>
//           <h1>📖 Story Based Numbers</h1>
//         </div>

//         <div className="sb-level-container">
//           <div className="sb-level-card">
//             <div className="sb-level-title">Choose a Level</div>

//             <div className="sb-level-grid">
//               <div className="sb-level-box" onClick={() => openLevel(1)}>
//                 <h2>Level 1</h2>
//                 <p>Learn 1 to 10</p>
//               </div>

//               <div className="sb-level-box" onClick={() => openLevel(2)}>
//                 <h2>Level 2</h2>
//                 <p>Learn 1 to 50</p>
//               </div>

//               <div className="sb-level-box" onClick={() => openLevel(3)}>
//                 <h2>Level 3</h2>
//                 <p>Learn 1 to 100</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="sb-page">
//       <div className="sb-header">
//         <button className="sb-back-btn" onClick={() => setSelectedLevel(null)}>
//           ←
//         </button>
//         <h1>📖 {currentLevel.title}</h1>
//       </div>

//       <div className="sb-container">
//         <div className="sb-progress-strip">
//           {storyData.slice(0, Math.min(storyData.length, 10)).map((item, index) => (
//             <div
//               key={item.number}
//               className={`sb-mini-card ${currentIndex === index ? "active" : ""}`}
//               onClick={() => {
//                 setCurrentIndex(index);
//                 stopStory();
//               }}
//             >
//               {item.number}
//             </div>
//           ))}
//         </div>

//         <div className="sb-main-story-card">
//           <div className="sb-story-number">{currentStory.number}</div>
//           <div className="sb-story-title">{currentStory.title}</div>

//           <div className="sb-story-image-card">
//             {Array.from({ length: Math.min(currentStory.count, 10) }).map((_, i) => (
//               <span key={i} className="sb-story-emoji">
//                 {currentStory.image}
//               </span>
//             ))}
//           </div>

//           <div className="sb-story-box">{currentStory.story}</div>
//         </div>

//         <div className="sb-actions">
//           <button className="sb-play-btn prev" onClick={prevStory}>
//             ← Previous
//           </button>

//           <button className="sb-play-btn" onClick={playing ? stopStory : playStory}>
//             {playing ? "⏸ Stop Story" : "▶️ Play Story"}
//           </button>

//           <button className="sb-play-btn next" onClick={nextStory}>
//             Next →
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }





import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/StoryBasedNumbers.css";

import useGameProgress from "../hooks/useGameProgress";

const GAME_ID = "story-based-numbers";

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
        story: `The story continued, and now ${i} friends were playing together happily.`,
        image:
          extraImages[(i - 1) % extraImages.length],
        count: i,
      });
    }
  }

  return stories;
}

export default function StoryBasedNumbers({ goBack }) {
  const navigate = useNavigate();

  const {
    savedState,
    loading: progressLoading,
    save,
  } = useGameProgress(GAME_ID);

  const [selectedLevel, setSelectedLevel] =
    useState(null);

  const [currentIndex, setCurrentIndex] =
    useState(0);

  const [playing, setPlaying] =
    useState(false);

  /* =====================================================
     🔥 RESTORE PROGRESS
  ===================================================== */

  useEffect(() => {
    if (progressLoading) return;

    if (savedState) {
      console.log(
        "🔥 Restoring Story Based Numbers:",
        savedState
      );

      setSelectedLevel(
        savedState.selectedLevel ?? null
      );

      setCurrentIndex(
        savedState.currentIndex || 0
      );

      /*
       * Don't automatically restart speech after
       * refresh because browsers may block autoplay.
       */
      setPlaying(false);

      return;
    }

    /* =================================================
       🆕 INITIAL STATE
    ================================================= */

    save({
      selectedLevel: null,
      currentIndex: 0,
      playing: false,
    });
  }, [progressLoading, savedState]);

  const currentLevel = selectedLevel
    ? levelConfig[selectedLevel]
    : null;

  const storyData = selectedLevel
    ? buildStory(currentLevel.max)
    : [];

  const currentStory =
    storyData[currentIndex];

  /* =====================================================
     🔊 SPEECH
  ===================================================== */

  const speak = (text, callback) => {
    if (
      typeof window !== "undefined" &&
      "speechSynthesis" in window
    ) {
      window.speechSynthesis.cancel();

      const utter =
        new SpeechSynthesisUtterance(text);

      utter.rate = 0.72;
      utter.pitch = 1;

      utter.onend = callback;

      window.speechSynthesis.speak(utter);
    } else if (callback) {
      callback();
    }
  };

  /* =====================================================
     ▶️ PLAY STORY
  ===================================================== */

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

      const line =
        `Number ${storyData[index].number}. ` +
        storyData[index].story;

      speak(line, () => {
        index += 1;

        setTimeout(
          playNext,
          700
        );
      });
    };

    playNext();
  };

  /* =====================================================
     ⏹ STOP STORY
  ===================================================== */

  const stopStory = () => {
    if (
      typeof window !== "undefined" &&
      window.speechSynthesis
    ) {
      window.speechSynthesis.cancel();
    }

    setPlaying(false);
  };

  /* =====================================================
     ➡️ NEXT STORY
  ===================================================== */

  const nextStory = async () => {
    if (!storyData.length) {
      return;
    }

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

  /* =====================================================
     ⬅️ PREVIOUS STORY
  ===================================================== */

  const prevStory = async () => {
    if (!storyData.length) {
      return;
    }

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

  /* =====================================================
     📚 OPEN LEVEL
  ===================================================== */

  const openLevel = async (level) => {
    stopStory();

    setSelectedLevel(level);
    setCurrentIndex(0);
    setPlaying(false);

    await save({
      selectedLevel: level,
      currentIndex: 0,
      playing: false,
    });
  };

  /* =====================================================
     🔙 BACK TO LEVELS
  ===================================================== */

  const backToLevels = async () => {
    stopStory();

    setSelectedLevel(null);
    setCurrentIndex(0);
    setPlaying(false);

    await save({
      selectedLevel: null,
      currentIndex: 0,
      playing: false,
    });
  };

  /* =====================================================
     ⏳ LOADING
  ===================================================== */

  if (progressLoading) {
    return (
      <div className="sb-page">

        <div className="sb-header">
          <button
            className="sb-back-btn"
            onClick={
              goBack
                ? goBack
                : () => navigate(-1)
            }
          >
            ←
          </button>

          <h1>
            📖 Story Based Numbers
          </h1>
        </div>

        <div className="sb-level-container">
          <div className="sb-level-card">
            🌱 Loading your progress...
          </div>
        </div>

      </div>
    );
  }

  /* =====================================================
     📚 LEVEL SELECTION
  ===================================================== */

  if (!selectedLevel) {
    return (
      <div className="sb-page">

        <div className="sb-header">

          <button
            className="sb-back-btn"
            onClick={
              goBack
                ? goBack
                : () => navigate(-1)
            }
          >
            ←
          </button>

          <h1>
            📖 Story Based Numbers
          </h1>

        </div>

        <div className="sb-level-container">

          <div className="sb-level-card">

            <div className="sb-level-title">
              Choose a Level
            </div>

            <div className="sb-level-grid">

              <div
                className="sb-level-box"
                onClick={() =>
                  openLevel(1)
                }
              >
                <h2>Level 1</h2>
                <p>
                  Learn 1 to 10
                </p>
              </div>

              <div
                className="sb-level-box"
                onClick={() =>
                  openLevel(2)
                }
              >
                <h2>Level 2</h2>
                <p>
                  Learn 1 to 50
                </p>
              </div>

              <div
                className="sb-level-box"
                onClick={() =>
                  openLevel(3)
                }
              >
                <h2>Level 3</h2>
                <p>
                  Learn 1 to 100
                </p>
              </div>

            </div>

          </div>

        </div>

      </div>
    );
  }

  /* =====================================================
     📖 STORY VIEW
  ===================================================== */

  return (
    <div className="sb-page">

      <div className="sb-header">

        {/* <button
          className="sb-back-btn"
          onClick={backToLevels}
        >
          ←
        </button> */}

        <h1>
          📖 {currentLevel.title}
        </h1>

      </div>

      <div className="sb-container">

        {/* PROGRESS STRIP */}

        <div className="sb-progress-strip">

          {storyData
            .slice(
              0,
              Math.min(
                storyData.length,
                10
              )
            )
            .map((item, index) => (
              <div
                key={item.number}
                className={`sb-mini-card ${
                  currentIndex === index
                    ? "active"
                    : ""
                }`}
                onClick={async () => {
                  stopStory();

                  setCurrentIndex(index);

                  await save({
                    selectedLevel,
                    currentIndex: index,
                    playing: false,
                  });
                }}
              >
                {item.number}
              </div>
            ))}

        </div>

        {/* MAIN STORY */}

        <div className="sb-main-story-card">

          <div className="sb-story-number">
            {currentStory.number}
          </div>

          <div className="sb-story-title">
            {currentStory.title}
          </div>

          {/* OBJECTS */}

          <div className="sb-story-image-card">

            {Array.from({
              length: Math.min(
                currentStory.count,
                10
              ),
            }).map((_, index) => (
              <span
                key={index}
                className="sb-story-emoji"
              >
                {currentStory.image}
              </span>
            ))}

          </div>

          {/* STORY */}

          <div className="sb-story-box">
            {currentStory.story}
          </div>

        </div>

        {/* ACTIONS */}

        <div className="sb-actions">

          <button
            className="sb-play-btn prev"
            onClick={prevStory}
          >
            ← Previous
          </button>

          <button
            className="sb-play-btn"
            onClick={
              playing
                ? stopStory
                : playStory
            }
          >
            {playing
              ? "⏸ Stop Story"
              : "▶️ Play Story"}
          </button>

          <button
            className="sb-play-btn next"
            onClick={nextStory}
          >
            Next →
          </button>

        </div>

      </div>

    </div>
  );
}