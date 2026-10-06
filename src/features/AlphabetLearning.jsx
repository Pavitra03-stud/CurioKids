// // // import { useEffect, useMemo, useRef, useState } from "react";
// // // import "../styles/AlphabetLearning.css";
// // // import alphabetSong from "../assets/alphabet-song-soft.mp3";

// // // const songData = [
// // //   { letter: "A", animal: "Ant", emoji: "🐜", line: "A is for Ant" },
// // //   { letter: "B", animal: "Bear", emoji: "🐻", line: "B is for Bear" },
// // //   { letter: "C", animal: "Cat", emoji: "🐱", line: "C is for Cat" },
// // //   { letter: "D", animal: "Dog", emoji: "🐶", line: "D is for Dog" },
// // //   { letter: "E", animal: "Elephant", emoji: "🐘", line: "E is for Elephant" },
// // //   { letter: "F", animal: "Fish", emoji: "🐟", line: "F is for Fish" },
// // //   { letter: "G", animal: "Goat", emoji: "🐐", line: "G is for Goat" },
// // //   { letter: "H", animal: "Horse", emoji: "🐴", line: "H is for Horse" },
// // //   { letter: "I", animal: "Iguana", emoji: "🦎", line: "I is for Iguana" },
// // //   { letter: "J", animal: "Jellyfish", emoji: "🪼", line: "J is for Jellyfish" },
// // //   { letter: "K", animal: "Koala", emoji: "🐨", line: "K is for Koala" },
// // //   { letter: "L", animal: "Lion", emoji: "🦁", line: "L is for Lion" },
// // //   { letter: "M", animal: "Monkey", emoji: "🐵", line: "M is for Monkey" },
// // //   { letter: "N", animal: "Nightingale", emoji: "🐦", line: "N is for Nightingale" },
// // //   { letter: "O", animal: "Owl", emoji: "🦉", line: "O is for Owl" },
// // //   { letter: "P", animal: "Panda", emoji: "🐼", line: "P is for Panda" },
// // //   { letter: "Q", animal: "Quail", emoji: "🐤", line: "Q is for Quail" },
// // //   { letter: "R", animal: "Rabbit", emoji: "🐰", line: "R is for Rabbit" },
// // //   { letter: "S", animal: "Snake", emoji: "🐍", line: "S is for Snake" },
// // //   { letter: "T", animal: "Tiger", emoji: "🐯", line: "T is for Tiger" },
// // //   { letter: "U", animal: "Urial", emoji: "🐏", line: "U is for Urial" },
// // //   { letter: "V", animal: "Vulture", emoji: "🦅", line: "V is for Vulture" },
// // //   { letter: "W", animal: "Whale", emoji: "🐋", line: "W is for Whale" },
// // //   { letter: "X", animal: "Fox", emoji: "🦊", line: "X is for Fox" },
// // //   { letter: "Y", animal: "Yak", emoji: "🐂", line: "Y is for Yak" },
// // //   { letter: "Z", animal: "Zebra", emoji: "🦓", line: "Z is for Zebra" },
// // // ];

// // // export default function AlphabetLearning({ goBack }) {
// // //   const audioRef = useRef(null);
// // //   const [index, setIndex] = useState(0);
// // //   const [isPlaying, setIsPlaying] = useState(false);
// // //   const [audioReady, setAudioReady] = useState(true);

// // //   const current = useMemo(() => songData[index], [index]);

// // //   useEffect(() => {
// // //     let interval;

// // //     if (isPlaying) {
// // //       interval = setInterval(() => {
// // //         setIndex((prev) => {
// // //           if (prev === songData.length - 1) {
// // //             return 0;
// // //           }
// // //           return prev + 1;
// // //         });
// // //       }, 2500);
// // //     }

// // //     return () => clearInterval(interval);
// // //   }, [isPlaying]);

// // //   useEffect(() => {
// // //     const audio = audioRef.current;
// // //     if (!audio) return;

// // //     const onEnded = () => {
// // //       setIsPlaying(false);
// // //       setIndex(0);
// // //     };

// // //     const onError = () => {
// // //       setAudioReady(false);
// // //       setIsPlaying(false);
// // //     };

// // //     audio.addEventListener("ended", onEnded);
// // //     audio.addEventListener("error", onError);

// // //     return () => {
// // //       audio.removeEventListener("ended", onEnded);
// // //       audio.removeEventListener("error", onError);
// // //     };
// // //   }, []);

// // //   const handlePlayPause = async () => {
// // //     const audio = audioRef.current;
// // //     if (!audio) return;

// // //     if (isPlaying) {
// // //       audio.pause();
// // //       setIsPlaying(false);
// // //       return;
// // //     }

// // //     try {
// // //       await audio.play();
// // //       setIsPlaying(true);
// // //       setAudioReady(true);
// // //     } catch (error) {
// // //       setAudioReady(false);
// // //       setIsPlaying(false);
// // //     }
// // //   };

// // //   const handleRestart = async () => {
// // //     const audio = audioRef.current;
// // //     if (!audio) return;

// // //     try {
// // //       audio.currentTime = 0;
// // //       setIndex(0);
// // //       await audio.play();
// // //       setIsPlaying(true);
// // //       setAudioReady(true);
// // //     } catch (error) {
// // //       setAudioReady(false);
// // //       setIsPlaying(false);
// // //     }
// // //   };

// // //   const handleNext = () => {
// // //     setIndex((prev) => (prev + 1) % songData.length);
// // //   };

// // //   const handlePrev = () => {
// // //     setIndex((prev) => (prev - 1 + songData.length) % songData.length);
// // //   };

// // //   return (
// // //     <div className="alphabet-video-page">
// // //       <header className="alphabet-video-header">
// // //         <h1>Alphabet Learning Song</h1>
// // //       </header>

// // //       <audio ref={audioRef} src={alphabetSong} preload="auto" />

// // //       <div className="alphabet-video-content">
// // //         <div className="alphabet-video-stage">
// // //           <div className="alphabet-bubble bubble-one"></div>
// // //           <div className="alphabet-bubble bubble-two"></div>
// // //           <div className="alphabet-bubble bubble-three"></div>
// // //           <div className="alphabet-bubble bubble-four"></div>

// // //           <div className="alphabet-floating-letter">{current.letter}</div>

// // //           <div className="alphabet-animal-row">
// // //             <div className="alphabet-animal">{current.emoji}</div>
// // //             <div className="alphabet-animal-shadow"></div>
// // //           </div>

// // //           <div className="alphabet-animal-name">{current.animal}</div>

// // //           <div className="alphabet-song-line">{current.line}</div>

// // //           <div className="alphabet-progress-box">
// // //             Letter {index + 1} / {songData.length}
// // //           </div>
// // //         </div>

// // //         {!audioReady && (
// // //           <div className="alphabet-audio-warning">
// // //             Audio file not found. Add: <span>src/assets/alphabet-song-soft.mp3</span>
// // //           </div>
// // //         )}

// // //         <div className="alphabet-video-controls">
// // //           <button className="alphabet-control-btn play" onClick={handlePlayPause}>
// // //             {isPlaying ? "Pause" : "Play"}
// // //           </button>

// // //           <button className="alphabet-control-btn restart" onClick={handleRestart}>
// // //             Restart
// // //           </button>

// // //           <button className="alphabet-control-btn prev" onClick={handlePrev}>
// // //             Previous
// // //           </button>

// // //           <button className="alphabet-control-btn next" onClick={handleNext}>
// // //             Next
// // //           </button>
// // //         </div>

// // //         <div className="alphabet-letter-strip">
// // //           {songData.map((item, i) => (
// // //             <button
// // //               key={item.letter}
// // //               className={`alphabet-letter-chip ${i === index ? "active" : ""}`}
// // //               onClick={() => setIndex(i)}
// // //             >
// // //               {item.letter}
// // //             </button>
// // //           ))}
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // }




// // import { useEffect, useMemo, useRef, useState } from "react";
// // import "../styles/AlphabetLearning.css";

// // const songData = [
// //   { letter: "A", animal: "Ant", emoji: "🐜", line: "A is for Ant" },
// //   { letter: "B", animal: "Bear", emoji: "🐻", line: "B is for Bear" },
// //   { letter: "C", animal: "Cat", emoji: "🐱", line: "C is for Cat" },
// //   { letter: "D", animal: "Dog", emoji: "🐶", line: "D is for Dog" },
// //   { letter: "E", animal: "Elephant", emoji: "🐘", line: "E is for Elephant" },
// //   { letter: "F", animal: "Fish", emoji: "🐟", line: "F is for Fish" },
// //   { letter: "G", animal: "Goat", emoji: "🐐", line: "G is for Goat" },
// //   { letter: "H", animal: "Horse", emoji: "🐴", line: "H is for Horse" },
// //   { letter: "I", animal: "Iguana", emoji: "🦎", line: "I is for Iguana" },
// //   { letter: "J", animal: "Jellyfish", emoji: "🪼", line: "J is for Jellyfish" },
// //   { letter: "K", animal: "Koala", emoji: "🐨", line: "K is for Koala" },
// //   { letter: "L", animal: "Lion", emoji: "🦁", line: "L is for Lion" },
// //   { letter: "M", animal: "Monkey", emoji: "🐵", line: "M is for Monkey" },
// //   { letter: "N", animal: "Nightingale", emoji: "🐦", line: "N is for Nightingale" },
// //   { letter: "O", animal: "Owl", emoji: "🦉", line: "O is for Owl" },
// //   { letter: "P", animal: "Panda", emoji: "🐼", line: "P is for Panda" },
// //   { letter: "Q", animal: "Quail", emoji: "🐤", line: "Q is for Quail" },
// //   { letter: "R", animal: "Rabbit", emoji: "🐰", line: "R is for Rabbit" },
// //   { letter: "S", animal: "Snake", emoji: "🐍", line: "S is for Snake" },
// //   { letter: "T", animal: "Tiger", emoji: "🐯", line: "T is for Tiger" },
// //   { letter: "U", animal: "Urial", emoji: "🐏", line: "U is for Urial" },
// //   { letter: "V", animal: "Vulture", emoji: "🦅", line: "V is for Vulture" },
// //   { letter: "W", animal: "Whale", emoji: "🐋", line: "W is for Whale" },
// //   { letter: "X", animal: "Fox", emoji: "🦊", line: "X is for Fox" },
// //   { letter: "Y", animal: "Yak", emoji: "🐂", line: "Y is for Yak" },
// //   { letter: "Z", animal: "Zebra", emoji: "🦓", line: "Z is for Zebra" },
// // ];

// // export default function AlphabetLearning({ goBack }) {
// //   const intervalRef = useRef(null);

// //   const [index, setIndex] = useState(0);
// //   const [isPlaying, setIsPlaying] = useState(false);

// //   const current = useMemo(() => songData[index], [index]);

// //   const speak = (text) => {
// //     window.speechSynthesis.cancel();
// //     const speech = new SpeechSynthesisUtterance(text);
// //     speech.rate = 0.8;
// //     speech.pitch = 1.2;
// //     speech.lang = "en-US";
// //     window.speechSynthesis.speak(speech);
// //   };

// //   const startSong = (start = 0) => {
// //     clearInterval(intervalRef.current);
// //     setIndex(start);
// //     setIsPlaying(true);
// //     speak(songData[start].line);

// //     intervalRef.current = setInterval(() => {
// //       setIndex((prev) => {
// //         const next = prev + 1;

// //         if (next >= songData.length) {
// //           clearInterval(intervalRef.current);
// //           setIsPlaying(false);
// //           return 0;
// //         }

// //         speak(songData[next].line);
// //         return next;
// //       });
// //     }, 2500);
// //   };

// //   const stopSong = () => {
// //     clearInterval(intervalRef.current);
// //     window.speechSynthesis.cancel();
// //     setIsPlaying(false);
// //   };

// //   const handlePlayPause = () => {
// //     if (isPlaying) {
// //       stopSong();
// //     } else {
// //       startSong(index);
// //     }
// //   };

// //   const handleRestart = () => {
// //     stopSong();
// //     startSong(0);
// //   };

// //   const handleNext = () => {
// //     stopSong();
// //     const next = (index + 1) % songData.length;
// //     setIndex(next);
// //     speak(songData[next].line);
// //   };

// //   const handlePrev = () => {
// //     stopSong();
// //     const prev = (index - 1 + songData.length) % songData.length;
// //     setIndex(prev);
// //     speak(songData[prev].line);
// //   };

// //   return (
// //     <div className="alphabet-video-page">
// //       <header className="alphabet-video-header">
// //         {goBack && (
// //           <button className="alphabet-back-btn" onClick={goBack}>
// //             ←
// //           </button>
// //         )}
// //         <h1>Alphabet Learning Song</h1>
// //       </header>

// //       <div className="alphabet-video-content">
// //         <div className="alphabet-video-stage">
// //           <div className="alphabet-floating-letter">{current.letter}</div>

// //           <div className="alphabet-animal">{current.emoji}</div>

// //           <div className="alphabet-animal-name">{current.animal}</div>

// //           <div className="alphabet-song-line">{current.line}</div>

// //           <div className="alphabet-progress-box">
// //             Letter {index + 1} / {songData.length}
// //           </div>
// //         </div>

// //         <div className="alphabet-video-controls">
// //           <button onClick={handlePlayPause}>
// //             {isPlaying ? "Pause" : "Play"}
// //           </button>

// //           <button onClick={handleRestart}>Restart</button>
// //           <button onClick={handlePrev}>Previous</button>
// //           <button onClick={handleNext}>Next</button>
// //         </div>

// //         <div className="alphabet-letter-strip">
// //           {songData.map((item, i) => (
// //             <button
// //               key={item.letter}
// //               className={i === index ? "active" : ""}
// //               onClick={() => {
// //                 stopSong();
// //                 setIndex(i);
// //                 speak(item.line);
// //               }}
// //             >
// //               {item.letter}
// //             </button>
// //           ))}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// import { useEffect, useMemo, useRef, useState } from "react";
// import "../styles/AlphabetLearning.css";
// import { useGame } from "../context/GameContext"; // ✅ ADDED

// const songData = [
//   { letter: "A", animal: "Ant", emoji: "🐜", line: "A is for Ant" },
//   { letter: "B", animal: "Bear", emoji: "🐻", line: "B is for Bear" },
//   { letter: "C", animal: "Cat", emoji: "🐱", line: "C is for Cat" },
//   { letter: "D", animal: "Dog", emoji: "🐶", line: "D is for Dog" },
//   { letter: "E", animal: "Elephant", emoji: "🐘", line: "E is for Elephant" },
//   { letter: "F", animal: "Fish", emoji: "🐟", line: "F is for Fish" },
//   { letter: "G", animal: "Goat", emoji: "🐐", line: "G is for Goat" },
//   { letter: "H", animal: "Horse", emoji: "🐴", line: "H is for Horse" },
//   { letter: "I", animal: "Iguana", emoji: "🦎", line: "I is for Iguana" },
//   { letter: "J", animal: "Jellyfish", emoji: "🪼", line: "J is for Jellyfish" },
//   { letter: "K", animal: "Koala", emoji: "🐨", line: "K is for Koala" },
//   { letter: "L", animal: "Lion", emoji: "🦁", line: "L is for Lion" },
//   { letter: "M", animal: "Monkey", emoji: "🐵", line: "M is for Monkey" },
//   { letter: "N", animal: "Nightingale", emoji: "🐦", line: "N is for Nightingale" },
//   { letter: "O", animal: "Owl", emoji: "🦉", line: "O is for Owl" },
//   { letter: "P", animal: "Panda", emoji: "🐼", line: "P is for Panda" },
//   { letter: "Q", animal: "Quail", emoji: "🐤", line: "Q is for Quail" },
//   { letter: "R", animal: "Rabbit", emoji: "🐰", line: "R is for Rabbit" },
//   { letter: "S", animal: "Snake", emoji: "🐍", line: "S is for Snake" },
//   { letter: "T", animal: "Tiger", emoji: "🐯", line: "T is for Tiger" },
//   { letter: "U", animal: "Urial", emoji: "🐏", line: "U is for Urial" },
//   { letter: "V", animal: "Vulture", emoji: "🦅", line: "V is for Vulture" },
//   { letter: "W", animal: "Whale", emoji: "🐋", line: "W is for Whale" },
//   { letter: "X", animal: "Fox", emoji: "🦊", line: "X is for Fox" },
//   { letter: "Y", animal: "Yak", emoji: "🐂", line: "Y is for Yak" },
//   { letter: "Z", animal: "Zebra", emoji: "🦓", line: "Z is for Zebra" },
// ];

// export default function AlphabetLearning({ goBack }) {
//   const intervalRef = useRef(null);

//   const [index, setIndex] = useState(0);
//   const [isPlaying, setIsPlaying] = useState(false);

//   const { addStars } = useGame(); // ✅ ADDED

//   const current = useMemo(() => songData[index], [index]);

//   const speak = (text) => {
//     window.speechSynthesis.cancel();
//     const speech = new SpeechSynthesisUtterance(text);
//     speech.rate = 0.8;
//     speech.pitch = 1.2;
//     speech.lang = "en-US";
//     window.speechSynthesis.speak(speech);
//   };

//   const startSong = (start = 0) => {
//     clearInterval(intervalRef.current);
//     setIndex(start);
//     setIsPlaying(true);
//     speak(songData[start].line);

//     intervalRef.current = setInterval(() => {
//       setIndex((prev) => {
//         const next = prev + 1;

//         if (next >= songData.length) {
//           clearInterval(intervalRef.current);
//           setIsPlaying(false);

//           // ✅ ADD PROGRESS WHEN COMPLETED
//           addStars(100, "Alphabet Learning");

//           return 0;
//         }

//         speak(songData[next].line);
//         return next;
//       });
//     }, 2500);
//   };

//   const stopSong = () => {
//     clearInterval(intervalRef.current);
//     window.speechSynthesis.cancel();
//     setIsPlaying(false);
//   };

//   const handlePlayPause = () => {
//     if (isPlaying) {
//       stopSong();
//     } else {
//       startSong(index);
//     }
//   };

//   const handleRestart = () => {
//     stopSong();
//     startSong(0);
//   };

//   const handleNext = () => {
//     stopSong();
//     const next = (index + 1) % songData.length;
//     setIndex(next);
//     speak(songData[next].line);
//   };

//   const handlePrev = () => {
//     stopSong();
//     const prev = (index - 1 + songData.length) % songData.length;
//     setIndex(prev);
//     speak(songData[prev].line);
//   };

//   return (
//     <div className="alphabet-video-page">
//       <header className="alphabet-video-header">
//         {goBack && (
//           <button className="alphabet-back-btn" onClick={goBack}>
//             ←
//           </button>
//         )}
//         <h1>Alphabet Learning Song</h1>
//       </header>

//       <div className="alphabet-video-content">
//         <div className="alphabet-video-stage">
//           <div className="alphabet-floating-letter">{current.letter}</div>

//           <div className="alphabet-animal">{current.emoji}</div>

//           <div className="alphabet-animal-name">{current.animal}</div>

//           <div className="alphabet-song-line">{current.line}</div>

//           <div className="alphabet-progress-box">
//             Letter {index + 1} / {songData.length}
//           </div>
//         </div>

//         <div className="alphabet-video-controls">
//           <button onClick={handlePlayPause}>
//             {isPlaying ? "Pause" : "Play"}
//           </button>

//           <button onClick={handleRestart}>Restart</button>
//           <button onClick={handlePrev}>Previous</button>
//           <button onClick={handleNext}>Next</button>
//         </div>

//         <div className="alphabet-letter-strip">
//           {songData.map((item, i) => (
//             <button
//               key={item.letter}
//               className={i === index ? "active" : ""}
//               onClick={() => {
//                 stopSong();
//                 setIndex(i);
//                 speak(item.line);
//               }}
//             >
//               {item.letter}
//             </button>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }




import { useEffect, useMemo, useRef, useState } from "react";
import "../styles/AlphabetLearning.css";
import useGameProgress from "../hooks/useGameProgress";

const GAME_ID = "alphabet-learning";

const songData = [
  { letter: "A", animal: "Ant", emoji: "🐜", line: "A is for Ant" },
  { letter: "B", animal: "Bear", emoji: "🐻", line: "B is for Bear" },
  { letter: "C", animal: "Cat", emoji: "🐱", line: "C is for Cat" },
  { letter: "D", animal: "Dog", emoji: "🐶", line: "D is for Dog" },
  { letter: "E", animal: "Elephant", emoji: "🐘", line: "E is for Elephant" },
  { letter: "F", animal: "Fish", emoji: "🐟", line: "F is for Fish" },
  { letter: "G", animal: "Goat", emoji: "🐐", line: "G is for Goat" },
  { letter: "H", animal: "Horse", emoji: "🐴", line: "H is for Horse" },
  { letter: "I", animal: "Iguana", emoji: "🦎", line: "I is for Iguana" },
  {
    letter: "J",
    animal: "Jellyfish",
    emoji: "🪼",
    line: "J is for Jellyfish",
  },
  { letter: "K", animal: "Koala", emoji: "🐨", line: "K is for Koala" },
  { letter: "L", animal: "Lion", emoji: "🦁", line: "L is for Lion" },
  { letter: "M", animal: "Monkey", emoji: "🐵", line: "M is for Monkey" },
  {
    letter: "N",
    animal: "Nightingale",
    emoji: "🐦",
    line: "N is for Nightingale",
  },
  { letter: "O", animal: "Owl", emoji: "🦉", line: "O is for Owl" },
  { letter: "P", animal: "Panda", emoji: "🐼", line: "P is for Panda" },
  { letter: "Q", animal: "Quail", emoji: "🐤", line: "Q is for Quail" },
  { letter: "R", animal: "Rabbit", emoji: "🐰", line: "R is for Rabbit" },
  { letter: "S", animal: "Snake", emoji: "🐍", line: "S is for Snake" },
  { letter: "T", animal: "Tiger", emoji: "🐯", line: "T is for Tiger" },
  { letter: "U", animal: "Urial", emoji: "🐏", line: "U is for Urial" },
  { letter: "V", animal: "Vulture", emoji: "🦅", line: "V is for Vulture" },
  { letter: "W", animal: "Whale", emoji: "🐋", line: "W is for Whale" },
  { letter: "X", animal: "Fox", emoji: "🦊", line: "X is for Fox" },
  { letter: "Y", animal: "Yak", emoji: "🐂", line: "Y is for Yak" },
  { letter: "Z", animal: "Zebra", emoji: "🦓", line: "Z is for Zebra" },
];

export default function AlphabetLearning({ goBack }) {
  const intervalRef = useRef(null);

  const [index, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const {
    savedState,
    loading: progressLoading,
    save,
    finish,
  } = useGameProgress(GAME_ID, {
    index: 0,
    isPlaying: false,
  });

  const [gameLoading, setGameLoading] = useState(true);

  const current = useMemo(
    () => songData[index],
    [index]
  );

  /*
  |--------------------------------------------------------------------------
  | RESTORE SAVED PROGRESS
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (progressLoading) return;

    if (savedState) {
      console.log(
        "🔥 Restoring Alphabet Learning:",
        savedState
      );

      const restoredIndex = Math.min(
        Math.max(savedState.index ?? 0, 0),
        songData.length - 1
      );

      setIndex(restoredIndex);

      /*
       * Do NOT automatically start the song after refresh.
       * Browser autoplay can be blocked.
       */
      setIsPlaying(false);
    } else {
      console.log(
        "🆕 Starting Alphabet Learning"
      );

      setIndex(0);
      setIsPlaying(false);
    }

    setGameLoading(false);
  }, [progressLoading, savedState]);

  /*
  |--------------------------------------------------------------------------
  | SPEECH
  |--------------------------------------------------------------------------
  */

  const speak = (text) => {
    if (
      typeof window === "undefined" ||
      !window.speechSynthesis
    ) {
      return;
    }

    window.speechSynthesis.cancel();

    const speech =
      new SpeechSynthesisUtterance(text);

    speech.rate = 0.8;
    speech.pitch = 1.2;
    speech.lang = "en-US";

    window.speechSynthesis.speak(speech);
  };

  /*
  |--------------------------------------------------------------------------
  | STOP SONG
  |--------------------------------------------------------------------------
  */

  const stopSong = () => {
    clearInterval(intervalRef.current);

    intervalRef.current = null;

    if (
      typeof window !== "undefined" &&
      window.speechSynthesis
    ) {
      window.speechSynthesis.cancel();
    }

    setIsPlaying(false);
  };

  /*
  |--------------------------------------------------------------------------
  | SAVE CURRENT POSITION
  |--------------------------------------------------------------------------
  */

  const saveCurrentPosition = async (
    newIndex
  ) => {
    await save({
      index: newIndex,
      isPlaying: false,
    });
  };

  /*
  |--------------------------------------------------------------------------
  | START SONG
  |--------------------------------------------------------------------------
  */

  const startSong = (start = index) => {
    clearInterval(intervalRef.current);

    const safeStart = Math.min(
      Math.max(start, 0),
      songData.length - 1
    );

    setIndex(safeStart);
    setIsPlaying(true);

    speak(songData[safeStart].line);

    /*
     * Save current position.
     */
    save({
      index: safeStart,
      isPlaying: true,
    });

    intervalRef.current = setInterval(() => {
      setIndex((prev) => {
        const next = prev + 1;

        /*
         * Reached the end of A-Z.
         */
        if (next >= songData.length) {
          clearInterval(intervalRef.current);

          intervalRef.current = null;

          setIsPlaying(false);

          /*
           * Complete the activity.
           *
           * This replaces:
           * addStars(100, "Alphabet Learning")
           */
          finish(
            100,
            "Alphabet Learning"
          ).catch((error) => {
            console.error(
              "❌ Error completing Alphabet Learning:",
              error
            );
          });

          /*
           * Start a fresh round from A.
           */
          save({
            index: 0,
            isPlaying: false,
          }).catch((error) => {
            console.error(
              "❌ Error saving Alphabet Learning:",
              error
            );
          });

          return 0;
        }

        speak(songData[next].line);

        /*
         * Save progress as the song moves.
         */
        save({
          index: next,
          isPlaying: true,
        }).catch((error) => {
          console.error(
            "❌ Error saving Alphabet Learning:",
            error
          );
        });

        return next;
      });
    }, 2500);
  };

  /*
  |--------------------------------------------------------------------------
  | PLAY / PAUSE
  |--------------------------------------------------------------------------
  */

  const handlePlayPause = () => {
    if (isPlaying) {
      stopSong();

      save({
        index,
        isPlaying: false,
      });

      return;
    }

    startSong(index);
  };

  /*
  |--------------------------------------------------------------------------
  | RESTART
  |--------------------------------------------------------------------------
  */

  const handleRestart = () => {
    stopSong();

    setIndex(0);

    save({
      index: 0,
      isPlaying: false,
    });

    startSong(0);
  };

  /*
  |--------------------------------------------------------------------------
  | NEXT
  |--------------------------------------------------------------------------
  */

  const handleNext = () => {
    stopSong();

    const next =
      (index + 1) % songData.length;

    setIndex(next);

    speak(songData[next].line);

    save({
      index: next,
      isPlaying: false,
    });
  };

  /*
  |--------------------------------------------------------------------------
  | PREVIOUS
  |--------------------------------------------------------------------------
  */

  const handlePrev = () => {
    stopSong();

    const prev =
      (index - 1 + songData.length) %
      songData.length;

    setIndex(prev);

    speak(songData[prev].line);

    save({
      index: prev,
      isPlaying: false,
    });
  };

  /*
  |--------------------------------------------------------------------------
  | LETTER CHIP
  |--------------------------------------------------------------------------
  */

  const handleLetterClick = (i) => {
    stopSong();

    setIndex(i);

    speak(songData[i].line);

    save({
      index: i,
      isPlaying: false,
    });
  };

  /*
  |--------------------------------------------------------------------------
  | CLEANUP
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    return () => {
      clearInterval(intervalRef.current);

      if (
        typeof window !== "undefined" &&
        window.speechSynthesis
      ) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  /*
  |--------------------------------------------------------------------------
  | LOADING
  |--------------------------------------------------------------------------
  */

  if (progressLoading || gameLoading) {
    return (
      <div className="alphabet-video-page">
        <header className="alphabet-video-header">
          {goBack && (
            <button
              className="alphabet-back-btn"
              onClick={goBack}
            >
              ←
            </button>
          )}

          <h1>Alphabet Learning Song</h1>
        </header>

        <div className="alphabet-video-content">
          <div className="alphabet-video-stage">
            <div className="alphabet-song-line">
              Loading your progress...
            </div>
          </div>
        </div>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | UI
  |--------------------------------------------------------------------------
  */

  return (
    <div className="alphabet-video-page">
      <header className="alphabet-video-header">
        {goBack && (
          <button
            className="alphabet-back-btn"
            onClick={goBack}
          >
            ←
          </button>
        )}

        <h1>Alphabet Learning Song</h1>
      </header>

      <div className="alphabet-video-content">

        {/* =================================================
            MAIN STAGE
        ================================================= */}

        <div className="alphabet-video-stage">

          <div className="alphabet-floating-letter">
            {current.letter}
          </div>

          <div className="alphabet-animal">
            {current.emoji}
          </div>

          <div className="alphabet-animal-name">
            {current.animal}
          </div>

          <div className="alphabet-song-line">
            {current.line}
          </div>

          <div className="alphabet-progress-box">
            Letter {index + 1} / {songData.length}
          </div>

        </div>

        {/* =================================================
            CONTROLS
        ================================================= */}

        <div className="alphabet-video-controls">

          <button
            onClick={handlePlayPause}
          >
            {isPlaying ? "Pause" : "Play"}
          </button>

          <button
            onClick={handleRestart}
          >
            Restart
          </button>

          <button
            onClick={handlePrev}
          >
            Previous
          </button>

          <button
            onClick={handleNext}
          >
            Next
          </button>

        </div>

        {/* =================================================
            LETTER STRIP
        ================================================= */}

        <div className="alphabet-letter-strip">

          {songData.map((item, i) => (
            <button
              key={item.letter}
              className={
                i === index ? "active" : ""
              }
              onClick={() =>
                handleLetterClick(i)
              }
            >
              {item.letter}
            </button>
          ))}

        </div>

      </div>
    </div>
  );
}