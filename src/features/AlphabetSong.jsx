// import React from "react";

// function AlphabetSong() {

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



import React from "react";
import { useGame } from "../context/GameContext"; // ✅ ADDED

function AlphabetSong() {

  const { addStars } = useGame(); // ✅ ADDED

  const playSong = () => {
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

    // ✅ WHEN SONG FINISHES → UPDATE FIREBASE
    speech.onend = () => {
      addStars(100, "Alphabet Song");
    };

    window.speechSynthesis.cancel(); // stop previous
    window.speechSynthesis.speak(speech);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Alphabet Song 🎶</h1>
      <button onClick={playSong}>▶ Play Song</button>
    </div>
  );
}

export default AlphabetSong;
