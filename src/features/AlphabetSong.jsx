// // import React from "react";

// // function AlphabetSong() {

// //   const playSong = () => {
// //     const song = `
// // A is for Ant, marching in a line,
// // B is for Bear, looking so fine.
// // C is for Cat, meowing all day,
// // D is for Dog, barking away.
// // E is for Elephant, big and tall,
// // F is for Fish, swimming in the pool.
// // G is for Goat, climbing high,
// // H is for Horse, running by.
// // I is for Iguana, green and small,
// // J is for Jellyfish, floating in the sea.
// // K is for Koala, sleeping in a tree,
// // L is for Lion, king you see.
// // M is for Monkey, jumping around,
// // N is for Nightingale, sweet singing sound.
// // O is for Owl, awake at night,
// // P is for Panda, black and white.
// // Q is for Quail, tiny and quick,
// // R is for Rabbit, hop hop trick.
// // S is for Snake, slithering low,
// // T is for Tiger, in stripes it goes.
// // U is for Urial, horns so wide,
// // V is for Vulture, flying high.
// // W is for Whale, big in the sea,
// // X is for Fox, clever as can be.
// // Y is for Yak, strong and big,
// // Z is for Zebra, stripes so zig-zig!
// //     `;

// //     const speech = new SpeechSynthesisUtterance(song);
// //     speech.rate = 0.9;
// //     speech.pitch = 1.2;
// //     speech.lang = "en-US";

// //     window.speechSynthesis.speak(speech);
// //   };

// //   return (
// //     <div style={{ textAlign: "center", marginTop: "50px" }}>
// //       <h1>Alphabet Song 🎶</h1>
// //       <button onClick={playSong}>▶ Play Song</button>
// //     </div>
// //   );
// // }

// // export default AlphabetSong;



// import React from "react";
// import { useGame } from "../context/GameContext"; // ✅ ADDED

// function AlphabetSong() {

//   const { addStars } = useGame(); // ✅ ADDED

//   const playSong = () => {
//     const song = `
// A is for Ant, marching in a line,
// B is for Bear, looking so fine.
// C is for Cat, meowing all day,
// D is for Dog, barking away.
// E is for Elephant, big and tall,
// F is for Fish, swimming in the pool.
// G is for Goat, climbing high,
// H is for Horse, running by.
// I is for Iguana, green and small,
// J is for Jellyfish, floating in the sea.
// K is for Koala, sleeping in a tree,
// L is for Lion, king you see.
// M is for Monkey, jumping around,
// N is for Nightingale, sweet singing sound.
// O is for Owl, awake at night,
// P is for Panda, black and white.
// Q is for Quail, tiny and quick,
// R is for Rabbit, hop hop trick.
// S is for Snake, slithering low,
// T is for Tiger, in stripes it goes.
// U is for Urial, horns so wide,
// V is for Vulture, flying high.
// W is for Whale, big in the sea,
// X is for Fox, clever as can be.
// Y is for Yak, strong and big,
// Z is for Zebra, stripes so zig-zig!
//     `;

//     const speech = new SpeechSynthesisUtterance(song);
//     speech.rate = 0.9;
//     speech.pitch = 1.2;
//     speech.lang = "en-US";

//     // ✅ WHEN SONG FINISHES → UPDATE FIREBASE
//     speech.onend = () => {
//       addStars(100, "Alphabet Song");
//     };

//     window.speechSynthesis.cancel(); // stop previous
//     window.speechSynthesis.speak(speech);
//   };

//   return (
//     <div style={{ textAlign: "center", marginTop: "50px" }}>
//       <h1>Alphabet Song 🎶</h1>
//       <button onClick={playSong}>▶ Play Song</button>
//     </div>
//   );
// }

// export default AlphabetSong;





// import React, { useState } from "react";
// import { useGame } from "../context/GameContext";
// import { db } from "../firebase";
// import { collection, addDoc } from "firebase/firestore";

// function AlphabetSong() {
//   const { addStars } = useGame();

//   const [playing, setPlaying] = useState(false);

//   // ✅ ACTIVITY LOGGER
//   const logActivity = async (score) => {
//     const userId = localStorage.getItem("userId");

//     if (!userId) return;

//     try {
//       await addDoc(collection(db, "activity"), {
//         userId,
//         action: "listen",
//         module: "letters",
//         screen: "alphabet-song",
//         score,
//         timestamp: new Date(),
//       });
//     } catch (err) {
//       console.error("Activity log error:", err);
//     }
//   };

//   const playSong = () => {
//     if (playing) return; // prevent multiple clicks

//     setPlaying(true);

//     const song = `
// A is for Ant, marching in a line,
// B is for Bear, looking so fine.
// C is for Cat, meowing all day,
// D is for Dog, barking away.
// E is for Elephant, big and tall,
// F is for Fish, swimming in the pool.
// G is for Goat, climbing high,
// H is for Horse, running by.
// I is for Iguana, green and small,
// J is for Jellyfish, floating in the sea.
// K is for Koala, sleeping in a tree,
// L is for Lion, king you see.
// M is for Monkey, jumping around,
// N is for Nightingale, sweet singing sound.
// O is for Owl, awake at night,
// P is for Panda, black and white.
// Q is for Quail, tiny and quick,
// R is for Rabbit, hop hop trick.
// S is for Snake, slithering low,
// T is for Tiger, in stripes it goes.
// U is for Urial, horns so wide,
// V is for Vulture, flying high.
// W is for Whale, big in the sea,
// X is for Fox, clever as can be.
// Y is for Yak, strong and big,
// Z is for Zebra, stripes so zig-zig!
//     `;

//     const speech = new SpeechSynthesisUtterance(song);
//     speech.rate = 0.9;
//     speech.pitch = 1.2;
//     speech.lang = "en-US";

//     // ✅ WHEN SONG ENDS
//     speech.onend = async () => {
//       setPlaying(false);

//       const score = 100;

//       await addStars(score, "Alphabet Song");
//       await logActivity(score);

//       alert("Great listening! 🎶 ⭐ +3 stars");
//     };

//     window.speechSynthesis.cancel();
//     window.speechSynthesis.speak(speech);
//   };

//   return (
//     <div style={{ textAlign: "center", marginTop: "50px" }}>
//       <h1>Alphabet Song 🎶</h1>

//       <button onClick={playSong} disabled={playing}>
//         {playing ? "Playing..." : "▶ Play Song"}
//       </button>
//     </div>
//   );
// }

// export default AlphabetSong;



import React, { useEffect, useState } from "react";
import useGameProgress from "../hooks/useGameProgress";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

const GAME_ID = "alphabet-song";

function AlphabetSong() {
  const { savedState, loading, finish } = useGameProgress(GAME_ID, {
    completed: false,
  });

  const [playing, setPlaying] = useState(false);
  const [alreadyCompleted, setAlreadyCompleted] = useState(false);

  // Restore saved progress
  useEffect(() => {
    if (loading || !savedState) return;

    console.log("🎵 Alphabet Song saved state:", savedState);

    setAlreadyCompleted(Boolean(savedState.completed));
  }, [loading, savedState]);

  // Activity logger
  const logActivity = async (score) => {
    const userId = localStorage.getItem("userId");

    if (!userId) return;

    try {
      await addDoc(collection(db, "activity"), {
        userId,
        action: "listen",
        module: "letters",
        screen: "alphabet-song",
        score,
        timestamp: new Date(),
      });

      console.log("✅ Alphabet Song activity logged");
    } catch (err) {
      console.error("❌ Activity log error:", err);
    }
  };

  const playSong = () => {
    // Prevent multiple clicks
    if (playing) return;

    setPlaying(true);

    const song = `
A is for Ant, marching in a line,
B is for Bear, looking so fine.
C is for Cat, meowing all day,
D is for Dog, barking away.
E is for Elephant, big and tall,
F is for Fish, swimming in the pool.
G is for Goat, climbing high,
H is for Horse, running by.
I is for Iguana, green and small,
J is for Jellyfish, floating in the sea.
K is for Koala, sleeping in a tree,
L is for Lion, king you see.
M is for Monkey, jumping around,
N is for Nightingale, sweet singing sound.
O is for Owl, awake at night,
P is for Panda, black and white.
Q is for Quail, tiny and quick,
R is for Rabbit, hop hop trick.
S is for Snake, slithering low,
T is for Tiger, in stripes it goes.
U is for Urial, horns so wide,
V is for Vulture, flying high.
W is for Whale, big in the sea,
X is for Fox, clever as can be.
Y is for Yak, strong and big,
Z is for Zebra, stripes so zig-zig!
    `;

    const speech = new SpeechSynthesisUtterance(song);

    speech.rate = 0.9;
    speech.pitch = 1.2;
    speech.lang = "en-US";

    // Song completed
    speech.onend = async () => {
      setPlaying(false);

      // If already completed, don't give stars again
      if (alreadyCompleted) {
        console.log("ℹ️ Alphabet Song already completed");
        alert("You already completed the Alphabet Song! 🎶⭐");
        return;
      }

      const score = 100;

      try {
        // Complete game and save progress
        await finish(score, "Alphabet Song");

        // Log activity
        await logActivity(score);

        setAlreadyCompleted(true);

        console.log("🏆 Alphabet Song completed!");
        alert("Great listening! 🎶 ⭐ +100 stars");
      } catch (err) {
        console.error("❌ Failed to complete Alphabet Song:", err);
      }
    };

    // Stop any previous speech
    window.speechSynthesis.cancel();

    // Start song
    window.speechSynthesis.speak(speech);
  };

  // Stop speech if component is unmounted
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  // Loading state
  if (loading) {
    return (
      <div
        style={{
          textAlign: "center",
          marginTop: "50px",
        }}
      >
        <h2>🎵 Loading Alphabet Song...</h2>
      </div>
    );
  }

  return (
    <div
      style={{
        textAlign: "center",
        marginTop: "50px",
        padding: "20px",
      }}
    >
      <h1>Alphabet Song 🎶</h1>

      <p
        style={{
          fontSize: "18px",
          marginTop: "15px",
          marginBottom: "25px",
        }}
      >
        Listen carefully and learn the alphabet with animals! 🐜🐻🐱
      </p>

      <button
        onClick={playSong}
        disabled={playing}
        style={{
          padding: "14px 28px",
          fontSize: "18px",
          cursor: playing ? "not-allowed" : "pointer",
          borderRadius: "12px",
          border: "none",
          opacity: playing ? 0.7 : 1,
        }}
      >
        {playing ? "🎵 Playing..." : "▶ Play Song"}
      </button>

      {alreadyCompleted && !playing && (
        <div
          style={{
            marginTop: "25px",
            fontSize: "18px",
            fontWeight: "600",
          }}
        >
          🎉 Alphabet Song Completed!
          <br />
          ⭐ You already earned your reward.
        </div>
      )}
    </div>
  );
}

export default AlphabetSong;