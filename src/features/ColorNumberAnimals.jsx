// import React, { useState } from "react";
// import "../styles/ColorNumberAnimals.css";

// const palette = [
//   "#ff4d4d",
//   "#ff9f1c",
//   "#ffd60a",
//   "#2ec4b6",
//   "#3a86ff",
//   "#8338ec",
//   "#ff66b2",
//   "#8d6e63",
//   "#222222",
//   "#ffffff",
// ];

// const animals = [
//   {
//     name: "Fish",
//     parts: {
//       body: "#ffffff",
//       tail: "#ffffff",
//       fin: "#ffffff",
//       eye: "#ffffff",
//     },
//     render: (colors, handleColorPart) => (
//       <svg viewBox="0 0 500 350" className="animal-svg">
//         <ellipse
//           cx="220"
//           cy="180"
//           rx="120"
//           ry="80"
//           fill={colors.body}
//           stroke="#222"
//           strokeWidth="4"
//           onClick={() => handleColorPart("body")}
//           className="color-part"
//         />
//         <polygon
//           points="320,180 430,110 430,250"
//           fill={colors.tail}
//           stroke="#222"
//           strokeWidth="4"
//           onClick={() => handleColorPart("tail")}
//           className="color-part"
//         />
//         <polygon
//           points="180,120 240,70 270,130"
//           fill={colors.fin}
//           stroke="#222"
//           strokeWidth="4"
//           onClick={() => handleColorPart("fin")}
//           className="color-part"
//         />
//         <circle
//           cx="155"
//           cy="165"
//           r="18"
//           fill={colors.eye}
//           stroke="#222"
//           strokeWidth="3"
//           onClick={() => handleColorPart("eye")}
//           className="color-part"
//         />
//         <circle cx="160" cy="168" r="7" fill="#222" />
//         <path
//           d="M110 195 Q135 215 160 200"
//           fill="none"
//           stroke="#222"
//           strokeWidth="4"
//           strokeLinecap="round"
//         />
//         <path
//           d="M210 130 Q245 180 210 230"
//           fill="none"
//           stroke="#222"
//           strokeWidth="3"
//         />
//         <path
//           d="M250 120 Q285 180 250 240"
//           fill="none"
//           stroke="#222"
//           strokeWidth="3"
//         />
//       </svg>
//     ),
//   },
//   {
//     name: "Cat",
//     parts: {
//       face: "#ffffff",
//       leftEar: "#ffffff",
//       rightEar: "#ffffff",
//       nose: "#ffffff",
//       bow: "#ffffff",
//     },
//     render: (colors, handleColorPart) => (
//       <svg viewBox="0 0 500 350" className="animal-svg">
//         <circle
//           cx="250"
//           cy="180"
//           r="90"
//           fill={colors.face}
//           stroke="#222"
//           strokeWidth="4"
//           onClick={() => handleColorPart("face")}
//           className="color-part"
//         />
//         <polygon
//           points="180,110 215,40 245,110"
//           fill={colors.leftEar}
//           stroke="#222"
//           strokeWidth="4"
//           onClick={() => handleColorPart("leftEar")}
//           className="color-part"
//         />
//         <polygon
//           points="255,110 285,40 320,110"
//           fill={colors.rightEar}
//           stroke="#222"
//           strokeWidth="4"
//           onClick={() => handleColorPart("rightEar")}
//           className="color-part"
//         />
//         <polygon
//           points="240,190 260,190 250,210"
//           fill={colors.nose}
//           stroke="#222"
//           strokeWidth="3"
//           onClick={() => handleColorPart("nose")}
//           className="color-part"
//         />
//         <circle cx="215" cy="160" r="9" fill="#222" />
//         <circle cx="285" cy="160" r="9" fill="#222" />
//         <path
//           d="M250 210 Q230 225 220 240"
//           fill="none"
//           stroke="#222"
//           strokeWidth="3"
//           strokeLinecap="round"
//         />
//         <path
//           d="M250 210 Q270 225 280 240"
//           fill="none"
//           stroke="#222"
//           strokeWidth="3"
//           strokeLinecap="round"
//         />
//         <line x1="170" y1="205" x2="225" y2="200" stroke="#222" strokeWidth="3" />
//         <line x1="170" y1="220" x2="225" y2="215" stroke="#222" strokeWidth="3" />
//         <line x1="275" y1="200" x2="330" y2="205" stroke="#222" strokeWidth="3" />
//         <line x1="275" y1="215" x2="330" y2="220" stroke="#222" strokeWidth="3" />
//         <circle
//           cx="190"
//           cy="250"
//           r="18"
//           fill={colors.bow}
//           stroke="#222"
//           strokeWidth="3"
//           onClick={() => handleColorPart("bow")}
//           className="color-part"
//         />
//         <circle
//           cx="225"
//           cy="250"
//           r="18"
//           fill={colors.bow}
//           stroke="#222"
//           strokeWidth="3"
//           onClick={() => handleColorPart("bow")}
//           className="color-part"
//         />
//         <circle
//           cx="207"
//           cy="250"
//           r="10"
//           fill={colors.bow}
//           stroke="#222"
//           strokeWidth="3"
//           onClick={() => handleColorPart("bow")}
//           className="color-part"
//         />
//       </svg>
//     ),
//   },
//   {
//     name: "Butterfly",
//     parts: {
//       leftWingTop: "#ffffff",
//       leftWingBottom: "#ffffff",
//       rightWingTop: "#ffffff",
//       rightWingBottom: "#ffffff",
//       body: "#ffffff",
//     },
//     render: (colors, handleColorPart) => (
//       <svg viewBox="0 0 500 350" className="animal-svg">
//         <ellipse
//           cx="170"
//           cy="130"
//           rx="70"
//           ry="55"
//           fill={colors.leftWingTop}
//           stroke="#222"
//           strokeWidth="4"
//           onClick={() => handleColorPart("leftWingTop")}
//           className="color-part"
//         />
//         <ellipse
//           cx="170"
//           cy="235"
//           rx="70"
//           ry="55"
//           fill={colors.leftWingBottom}
//           stroke="#222"
//           strokeWidth="4"
//           onClick={() => handleColorPart("leftWingBottom")}
//           className="color-part"
//         />
//         <ellipse
//           cx="330"
//           cy="130"
//           rx="70"
//           ry="55"
//           fill={colors.rightWingTop}
//           stroke="#222"
//           strokeWidth="4"
//           onClick={() => handleColorPart("rightWingTop")}
//           className="color-part"
//         />
//         <ellipse
//           cx="330"
//           cy="235"
//           rx="70"
//           ry="55"
//           fill={colors.rightWingBottom}
//           stroke="#222"
//           strokeWidth="4"
//           onClick={() => handleColorPart("rightWingBottom")}
//           className="color-part"
//         />
//         <rect
//           x="235"
//           y="90"
//           width="30"
//           height="170"
//           rx="15"
//           fill={colors.body}
//           stroke="#222"
//           strokeWidth="4"
//           onClick={() => handleColorPart("body")}
//           className="color-part"
//         />
//         <circle cx="250" cy="75" r="22" fill="#fff" stroke="#222" strokeWidth="4" />
//         <line x1="240" y1="55" x2="220" y2="25" stroke="#222" strokeWidth="3" />
//         <line x1="260" y1="55" x2="280" y2="25" stroke="#222" strokeWidth="3" />
//         <circle cx="220" cy="25" r="5" fill="#222" />
//         <circle cx="280" cy="25" r="5" fill="#222" />
//       </svg>
//     ),
//   },
// ];

// export default function ColorTheAnimal() {
//   const [animalIndex, setAnimalIndex] = useState(0);
//   const [selectedColor, setSelectedColor] = useState(palette[0]);
//   const [partColors, setPartColors] = useState(animals[0].parts);

//   const currentAnimal = animals[animalIndex];

//   const handleColorPart = (partName) => {
//     setPartColors((prev) => ({
//       ...prev,
//       [partName]: selectedColor,
//     }));
//   };

//   const handleReset = () => {
//     setPartColors({ ...currentAnimal.parts });
//   };

//   const handleNext = () => {
//     const nextIndex = (animalIndex + 1) % animals.length;
//     setAnimalIndex(nextIndex);
//     setPartColors({ ...animals[nextIndex].parts });
//   };

//   return (
//     <div className="color-animal-page">
//       <div className="color-animal-card">
//         <div className="top-bar">
//           <h1>🎨 Color The Animal</h1>
//           <p>Choose a color and click the animal sketch to fill it.</p>
//         </div>

//         <div className="game-layout">
//           <div className="sketch-box">
//             <h2>{currentAnimal.name}</h2>
//             {currentAnimal.render(partColors, handleColorPart)}
//           </div>

//           <div className="tools-box">
//             <h3>Pick a Color</h3>
//             <div className="palette">
//               {palette.map((color) => (
//                 <button
//                   key={color}
//                   className={`color-btn ${selectedColor === color ? "active" : ""}`}
//                   style={{ backgroundColor: color }}
//                   onClick={() => setSelectedColor(color)}
//                 />
//               ))}
//             </div>

//             <div className="selected-preview">
//               <span>Selected Color</span>
//               <div
//                 className="selected-color-box"
//                 style={{ backgroundColor: selectedColor }}
//               />
//             </div>

//             <div className="action-buttons">
//               <button className="reset-btn" onClick={handleReset}>
//                 Reset
//               </button>
//               <button className="next-btn" onClick={handleNext}>
//                 Next Animal
//               </button>
//             </div>

//             <div className="help-box">
//               <p>🖍️ Tap a color</p>
//               <p>🐾 Tap an animal part</p>
//               <p>✨ Make the animal beautiful</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }



import React, { useEffect, useMemo, useState } from "react";
import "../styles/ColorNumberAnimals.css";

const animals = [
  {
    name: "Fish",
    parts: [
      { key: "body", label: "Body", number: 1, color: "#ff9f1c" },
      { key: "tail", label: "Tail", number: 2, color: "#3a86ff" },
      { key: "fin", label: "Fin", number: 3, color: "#ff4d4d" },
      { key: "eyeRing", label: "Eye Ring", number: 4, color: "#ffd60a" },
    ],
    render: (filledParts, handlePartClick) => (
      <svg viewBox="0 0 700 420" className="animal-svg">
        <ellipse
          cx="290"
          cy="220"
          rx="170"
          ry="110"
          fill={filledParts.body}
          stroke="#222"
          strokeWidth="5"
          className="color-part"
          onClick={() => handlePartClick("body")}
        />
        <polygon
          points="430,220 580,120 580,320"
          fill={filledParts.tail}
          stroke="#222"
          strokeWidth="5"
          className="color-part"
          onClick={() => handlePartClick("tail")}
        />
        <polygon
          points="260,120 330,50 380,145"
          fill={filledParts.fin}
          stroke="#222"
          strokeWidth="5"
          className="color-part"
          onClick={() => handlePartClick("fin")}
        />
        <circle
          cx="185"
          cy="195"
          r="30"
          fill={filledParts.eyeRing}
          stroke="#222"
          strokeWidth="4"
          className="color-part"
          onClick={() => handlePartClick("eyeRing")}
        />
        <circle cx="193" cy="202" r="12" fill="#222" />
        <path d="M125 245 Q165 280 205 250" fill="none" stroke="#222" strokeWidth="5" strokeLinecap="round" />
        <path d="M280 140 Q330 220 280 300" fill="none" stroke="#222" strokeWidth="4" />
        <path d="M340 150 Q390 220 340 305" fill="none" stroke="#222" strokeWidth="4" />
        <text x="290" y="230" textAnchor="middle" className="part-number">1</text>
        <text x="520" y="230" textAnchor="middle" className="part-number">2</text>
        <text x="325" y="110" textAnchor="middle" className="part-number">3</text>
        <text x="185" y="202" textAnchor="middle" className="part-number small-number">4</text>
      </svg>
    ),
  },

  {
    name: "Cat",
    parts: [
      { key: "face", label: "Face", number: 1, color: "#f4a261" },
      { key: "leftEar", label: "Left Ear", number: 2, color: "#e76f51" },
      { key: "rightEar", label: "Right Ear", number: 3, color: "#2a9d8f" },
      { key: "nose", label: "Nose", number: 4, color: "#ff66b2" },
      { key: "bow", label: "Bow", number: 5, color: "#8338ec" },
    ],
    render: (filledParts, handlePartClick) => (
      <svg viewBox="0 0 700 420" className="animal-svg">
        <circle
          cx="350"
          cy="220"
          r="120"
          fill={filledParts.face}
          stroke="#222"
          strokeWidth="5"
          className="color-part"
          onClick={() => handlePartClick("face")}
        />
        <polygon
          points="250,135 300,45 335,135"
          fill={filledParts.leftEar}
          stroke="#222"
          strokeWidth="5"
          className="color-part"
          onClick={() => handlePartClick("leftEar")}
        />
        <polygon
          points="365,135 400,45 450,135"
          fill={filledParts.rightEar}
          stroke="#222"
          strokeWidth="5"
          className="color-part"
          onClick={() => handlePartClick("rightEar")}
        />
        <polygon
          points="338,245 362,245 350,265"
          fill={filledParts.nose}
          stroke="#222"
          strokeWidth="4"
          className="color-part"
          onClick={() => handlePartClick("nose")}
        />
        <circle cx="300" cy="195" r="12" fill="#222" />
        <circle cx="400" cy="195" r="12" fill="#222" />
        <path d="M350 265 Q325 285 315 305" fill="none" stroke="#222" strokeWidth="4" strokeLinecap="round" />
        <path d="M350 265 Q375 285 385 305" fill="none" stroke="#222" strokeWidth="4" strokeLinecap="round" />
        <line x1="230" y1="255" x2="310" y2="245" stroke="#222" strokeWidth="4" />
        <line x1="230" y1="280" x2="310" y2="270" stroke="#222" strokeWidth="4" />
        <line x1="390" y1="245" x2="470" y2="255" stroke="#222" strokeWidth="4" />
        <line x1="390" y1="270" x2="470" y2="280" stroke="#222" strokeWidth="4" />

        <circle
          cx="280"
          cy="340"
          r="24"
          fill={filledParts.bow}
          stroke="#222"
          strokeWidth="4"
          className="color-part"
          onClick={() => handlePartClick("bow")}
        />
        <circle
          cx="330"
          cy="340"
          r="24"
          fill={filledParts.bow}
          stroke="#222"
          strokeWidth="4"
          className="color-part"
          onClick={() => handlePartClick("bow")}
        />
        <circle
          cx="305"
          cy="340"
          r="14"
          fill={filledParts.bow}
          stroke="#222"
          strokeWidth="4"
          className="color-part"
          onClick={() => handlePartClick("bow")}
        />

        <text x="350" y="228" textAnchor="middle" className="part-number">1</text>
        <text x="295" y="105" textAnchor="middle" className="part-number small-number">2</text>
        <text x="405" y="105" textAnchor="middle" className="part-number small-number">3</text>
        <text x="350" y="258" textAnchor="middle" className="part-number tiny-number">4</text>
        <text x="305" y="347" textAnchor="middle" className="part-number tiny-number">5</text>
      </svg>
    ),
  },

  {
    name: "Butterfly",
    parts: [
      { key: "leftTop", label: "Left Top Wing", number: 1, color: "#ff66b2" },
      { key: "leftBottom", label: "Left Bottom Wing", number: 2, color: "#8338ec" },
      { key: "rightTop", label: "Right Top Wing", number: 3, color: "#2ec4b6" },
      { key: "rightBottom", label: "Right Bottom Wing", number: 4, color: "#ff9f1c" },
      { key: "body", label: "Body", number: 5, color: "#8d6e63" },
    ],
    render: (filledParts, handlePartClick) => (
      <svg viewBox="0 0 700 420" className="animal-svg">
        <ellipse
          cx="250"
          cy="145"
          rx="90"
          ry="75"
          fill={filledParts.leftTop}
          stroke="#222"
          strokeWidth="5"
          className="color-part"
          onClick={() => handlePartClick("leftTop")}
        />
        <ellipse
          cx="250"
          cy="290"
          rx="90"
          ry="75"
          fill={filledParts.leftBottom}
          stroke="#222"
          strokeWidth="5"
          className="color-part"
          onClick={() => handlePartClick("leftBottom")}
        />
        <ellipse
          cx="450"
          cy="145"
          rx="90"
          ry="75"
          fill={filledParts.rightTop}
          stroke="#222"
          strokeWidth="5"
          className="color-part"
          onClick={() => handlePartClick("rightTop")}
        />
        <ellipse
          cx="450"
          cy="290"
          rx="90"
          ry="75"
          fill={filledParts.rightBottom}
          stroke="#222"
          strokeWidth="5"
          className="color-part"
          onClick={() => handlePartClick("rightBottom")}
        />
        <rect
          x="330"
          y="100"
          width="40"
          height="220"
          rx="20"
          fill={filledParts.body}
          stroke="#222"
          strokeWidth="5"
          className="color-part"
          onClick={() => handlePartClick("body")}
        />
        <circle cx="350" cy="78" r="26" fill="#fff" stroke="#222" strokeWidth="5" />
        <line x1="338" y1="56" x2="315" y2="20" stroke="#222" strokeWidth="4" />
        <line x1="362" y1="56" x2="385" y2="20" stroke="#222" strokeWidth="4" />
        <circle cx="315" cy="20" r="6" fill="#222" />
        <circle cx="385" cy="20" r="6" fill="#222" />

        <text x="250" y="153" textAnchor="middle" className="part-number">1</text>
        <text x="250" y="298" textAnchor="middle" className="part-number">2</text>
        <text x="450" y="153" textAnchor="middle" className="part-number">3</text>
        <text x="450" y="298" textAnchor="middle" className="part-number">4</text>
        <text x="350" y="220" textAnchor="middle" className="part-number">5</text>
      </svg>
    ),
  },

  {
    name: "Turtle",
    parts: [
      { key: "shell", label: "Shell", number: 1, color: "#6a994e" },
      { key: "head", label: "Head", number: 2, color: "#90be6d" },
      { key: "legs", label: "Legs", number: 3, color: "#43aa8b" },
      { key: "tail", label: "Tail", number: 4, color: "#f9c74f" },
    ],
    render: (filledParts, handlePartClick) => (
      <svg viewBox="0 0 700 420" className="animal-svg">
        <ellipse
          cx="330"
          cy="210"
          rx="150"
          ry="105"
          fill={filledParts.shell}
          stroke="#222"
          strokeWidth="5"
          className="color-part"
          onClick={() => handlePartClick("shell")}
        />
        <circle
          cx="510"
          cy="210"
          r="48"
          fill={filledParts.head}
          stroke="#222"
          strokeWidth="5"
          className="color-part"
          onClick={() => handlePartClick("head")}
        />
        <ellipse
          cx="230"
          cy="130"
          rx="36"
          ry="24"
          fill={filledParts.legs}
          stroke="#222"
          strokeWidth="5"
          className="color-part"
          onClick={() => handlePartClick("legs")}
        />
        <ellipse
          cx="430"
          cy="130"
          rx="36"
          ry="24"
          fill={filledParts.legs}
          stroke="#222"
          strokeWidth="5"
          className="color-part"
          onClick={() => handlePartClick("legs")}
        />
        <ellipse
          cx="230"
          cy="300"
          rx="36"
          ry="24"
          fill={filledParts.legs}
          stroke="#222"
          strokeWidth="5"
          className="color-part"
          onClick={() => handlePartClick("legs")}
        />
        <ellipse
          cx="430"
          cy="300"
          rx="36"
          ry="24"
          fill={filledParts.legs}
          stroke="#222"
          strokeWidth="5"
          className="color-part"
          onClick={() => handlePartClick("legs")}
        />
        <polygon
          points="160,210 120,195 120,225"
          fill={filledParts.tail}
          stroke="#222"
          strokeWidth="5"
          className="color-part"
          onClick={() => handlePartClick("tail")}
        />
        <circle cx="525" cy="200" r="6" fill="#222" />
        <path d="M308 125 L308 295 M252 160 L408 160 M252 260 L408 260 M252 160 L252 260 M408 160 L408 260" fill="none" stroke="#3d5a2b" strokeWidth="4" />
        <text x="330" y="220" textAnchor="middle" className="part-number">1</text>
        <text x="510" y="220" textAnchor="middle" className="part-number small-number">2</text>
        <text x="330" y="132" textAnchor="middle" className="part-number">3</text>
        <text x="138" y="214" textAnchor="middle" className="part-number tiny-number">4</text>
      </svg>
    ),
  },

  {
    name: "Rabbit",
    parts: [
      { key: "face", label: "Face", number: 1, color: "#f1faee" },
      { key: "leftEar", label: "Left Ear", number: 2, color: "#ffafcc" },
      { key: "rightEar", label: "Right Ear", number: 3, color: "#cdb4db" },
      { key: "nose", label: "Nose", number: 4, color: "#ff6b6b" },
      { key: "cheeks", label: "Cheeks", number: 5, color: "#ffd6a5" },
    ],
    render: (filledParts, handlePartClick) => (
      <svg viewBox="0 0 700 420" className="animal-svg">
        <ellipse
          cx="350"
          cy="235"
          rx="120"
          ry="105"
          fill={filledParts.face}
          stroke="#222"
          strokeWidth="5"
          className="color-part"
          onClick={() => handlePartClick("face")}
        />
        <ellipse
          cx="290"
          cy="92"
          rx="35"
          ry="95"
          fill={filledParts.leftEar}
          stroke="#222"
          strokeWidth="5"
          className="color-part"
          onClick={() => handlePartClick("leftEar")}
        />
        <ellipse
          cx="410"
          cy="92"
          rx="35"
          ry="95"
          fill={filledParts.rightEar}
          stroke="#222"
          strokeWidth="5"
          className="color-part"
          onClick={() => handlePartClick("rightEar")}
        />
        <circle
          cx="300"
          cy="272"
          r="28"
          fill={filledParts.cheeks}
          stroke="#222"
          strokeWidth="4"
          className="color-part"
          onClick={() => handlePartClick("cheeks")}
        />
        <circle
          cx="400"
          cy="272"
          r="28"
          fill={filledParts.cheeks}
          stroke="#222"
          strokeWidth="4"
          className="color-part"
          onClick={() => handlePartClick("cheeks")}
        />
        <polygon
          points="338,245 362,245 350,265"
          fill={filledParts.nose}
          stroke="#222"
          strokeWidth="4"
          className="color-part"
          onClick={() => handlePartClick("nose")}
        />
        <circle cx="305" cy="210" r="11" fill="#222" />
        <circle cx="395" cy="210" r="11" fill="#222" />
        <path d="M350 265 Q330 285 320 300" fill="none" stroke="#222" strokeWidth="4" strokeLinecap="round" />
        <path d="M350 265 Q370 285 380 300" fill="none" stroke="#222" strokeWidth="4" strokeLinecap="round" />

        <text x="350" y="238" textAnchor="middle" className="part-number">1</text>
        <text x="290" y="100" textAnchor="middle" className="part-number small-number">2</text>
        <text x="410" y="100" textAnchor="middle" className="part-number small-number">3</text>
        <text x="350" y="258" textAnchor="middle" className="part-number tiny-number">4</text>
        <text x="350" y="315" textAnchor="middle" className="part-number">5</text>
      </svg>
    ),
  },

  {
    name: "Bird",
    parts: [
      { key: "body", label: "Body", number: 1, color: "#ffd166" },
      { key: "wing", label: "Wing", number: 2, color: "#06d6a0" },
      { key: "beak", label: "Beak", number: 3, color: "#f77f00" },
      { key: "tail", label: "Tail", number: 4, color: "#118ab2" },
    ],
    render: (filledParts, handlePartClick) => (
      <svg viewBox="0 0 700 420" className="animal-svg">
        <ellipse
          cx="320"
          cy="230"
          rx="140"
          ry="95"
          fill={filledParts.body}
          stroke="#222"
          strokeWidth="5"
          className="color-part"
          onClick={() => handlePartClick("body")}
        />
        <ellipse
          cx="330"
          cy="235"
          rx="65"
          ry="45"
          fill={filledParts.wing}
          stroke="#222"
          strokeWidth="4"
          className="color-part"
          onClick={() => handlePartClick("wing")}
        />
        <polygon
          points="470,220 545,195 545,245"
          fill={filledParts.beak}
          stroke="#222"
          strokeWidth="5"
          className="color-part"
          onClick={() => handlePartClick("beak")}
        />
        <polygon
          points="190,220 120,170 135,250"
          fill={filledParts.tail}
          stroke="#222"
          strokeWidth="5"
          className="color-part"
          onClick={() => handlePartClick("tail")}
        />
        <circle cx="420" cy="200" r="10" fill="#222" />
        <line x1="280" y1="320" x2="270" y2="355" stroke="#222" strokeWidth="4" />
        <line x1="350" y1="320" x2="360" y2="355" stroke="#222" strokeWidth="4" />

        <text x="320" y="236" textAnchor="middle" className="part-number">1</text>
        <text x="330" y="242" textAnchor="middle" className="part-number small-number">2</text>
        <text x="518" y="225" textAnchor="middle" className="part-number small-number">3</text>
        <text x="145" y="220" textAnchor="middle" className="part-number small-number">4</text>
      </svg>
    ),
  },
];

export default function ColorTheAnimal() {
  const [animalIndex, setAnimalIndex] = useState(0);
  const [selectedNumber, setSelectedNumber] = useState(null);
  const [message, setMessage] = useState("Choose a number and fill the matching part.");
  const currentAnimal = animals[animalIndex];

  const initialFilledParts = useMemo(() => {
    const obj = {};
    currentAnimal.parts.forEach((part) => {
      obj[part.key] = "#ffffff";
    });
    return obj;
  }, [currentAnimal]);

  const [filledParts, setFilledParts] = useState(initialFilledParts);

  useEffect(() => {
    const obj = {};
    currentAnimal.parts.forEach((part) => {
      obj[part.key] = "#ffffff";
    });
    setFilledParts(obj);
    setSelectedNumber(null);
    setMessage("Choose a number and fill the matching part.");
  }, [currentAnimal]);

  const handlePartClick = (partKey) => {
    const part = currentAnimal.parts.find((item) => item.key === partKey);

    if (!selectedNumber) {
      setMessage("Select a number color first.");
      return;
    }

    if (selectedNumber === part.number) {
      setFilledParts((prev) => ({
        ...prev,
        [part.key]: part.color,
      }));
      setMessage(`Good job! Number ${part.number} matched correctly.`);
    } else {
      setMessage(`Oops! That part needs number ${part.number}.`);
    }
  };

  const handleReset = () => {
    const obj = {};
    currentAnimal.parts.forEach((part) => {
      obj[part.key] = "#ffffff";
    });
    setFilledParts(obj);
    setSelectedNumber(null);
    setMessage("Game reset. Choose a number again.");
  };

  const handleNextAnimal = () => {
    setAnimalIndex((prev) => (prev + 1) % animals.length);
  };

  const completedCount = currentAnimal.parts.filter(
    (part) => filledParts[part.key] === part.color
  ).length;

  const isCompleted = completedCount === currentAnimal.parts.length;

  return (
    <div className="color-animal-page">
      <div className="color-animal-card">
        <div className="top-bar">
          <h1>🎨 Color By Number Animal</h1>
          <p>Pick the number and color the matching animal part.</p>
        </div>

        <div className="game-layout">
          <div className="sketch-box">
            <h2>{currentAnimal.name}</h2>
            {currentAnimal.render(filledParts, handlePartClick)}

            <div className="message-box">
              <p>{message}</p>
              <span>
                Completed: {completedCount} / {currentAnimal.parts.length}
              </span>
            </div>

            {isCompleted && (
              <div className="success-box">
                🎉 Awesome! You finished the {currentAnimal.name}.
              </div>
            )}
          </div>

          <div className="tools-box">
            <h3>Pick a Number</h3>

            <div className="palette number-palette">
              {currentAnimal.parts.map((part) => (
                <button
                  key={part.key}
                  className={`number-color-btn ${
                    selectedNumber === part.number ? "active" : ""
                  }`}
                  style={{ backgroundColor: part.color }}
                  onClick={() => setSelectedNumber(part.number)}
                >
                  {part.number}
                </button>
              ))}
            </div>

            <div className="selected-preview">
              <span>Selected Number</span>
              <div className="selected-number-box">
                {selectedNumber || "-"}
              </div>
            </div>

            <div className="legend-box">
              <h4>Color Guide</h4>
              {currentAnimal.parts.map((part) => (
                <div key={part.key} className="legend-item">
                  <div
                    className="legend-color"
                    style={{ backgroundColor: part.color }}
                  >
                    {part.number}
                  </div>
                  <span>{part.label}</span>
                </div>
              ))}
            </div>

            <div className="action-buttons">
              <button className="reset-btn" onClick={handleReset}>
                Reset
              </button>
              <button className="next-btn" onClick={handleNextAnimal}>
                Next Animal
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}