import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import "../styles/ConnectTheNumbersAnimal.css";

import useGameProgress from "../hooks/useGameProgress";

import connectNumbersIcon from "../assets/02-connect-the-numbers.png";

const GAME_ID = "connect-the-numbers-animal";

const HIT_RADIUS = 28;

/* =========================================================
   ANIMALS
   ========================================================= */

const animals = [
  {
    id: "fish",
    name: "Fish",
    emoji: "🐟",

    points: [
      { x: 520, y: 210 },
      { x: 470, y: 145 },
      { x: 390, y: 110 },
      { x: 290, y: 100 },
      { x: 200, y: 120 },
      { x: 140, y: 165 },
      { x: 120, y: 210 },
      { x: 140, y: 255 },
      { x: 200, y: 300 },
      { x: 290, y: 320 },
      { x: 390, y: 310 },
      { x: 470, y: 275 },
      { x: 520, y: 210 },
      { x: 600, y: 145 },
      { x: 600, y: 275 },
      { x: 520, y: 210 },
    ],

    guide: () => (
      <>
        <ellipse
          cx="315"
          cy="210"
          rx="200"
          ry="112"
          className="guide-shape"
        />

        <polygon
          points="520,210 600,145 600,275"
          className="guide-shape"
        />

        <polygon
          points="290,105 355,55 390,135"
          className="guide-shape"
        />

        <circle
          cx="190"
          cy="190"
          r="20"
          className="guide-shape"
        />

        <path
          d="M155 228 Q185 245 218 228"
          className="guide-line"
        />

        <path
          d="M295 132 Q330 210 295 288"
          className="guide-line"
        />

        <path
          d="M355 142 Q390 210 355 278"
          className="guide-line"
        />
      </>
    ),

    decorate: () => (
      <>
        <ellipse
          cx="315"
          cy="210"
          rx="200"
          ry="112"
          className="final-shape"
        />

        <polygon
          points="520,210 600,145 600,275"
          className="final-shape"
        />

        <polygon
          points="290,105 355,55 390,135"
          className="final-shape"
        />

        <circle
          cx="190"
          cy="190"
          r="20"
          fill="white"
          stroke="#222"
          strokeWidth="4"
        />

        <circle
          cx="196"
          cy="196"
          r="8"
          fill="#222"
        />

        <path
          d="M155 228 Q185 245 218 228"
          fill="none"
          stroke="#222"
          strokeWidth="4"
        />

        <path
          d="M295 132 Q330 210 295 288"
          fill="none"
          stroke="#222"
          strokeWidth="4"
        />

        <path
          d="M355 142 Q390 210 355 278"
          fill="none"
          stroke="#222"
          strokeWidth="4"
        />
      </>
    ),
  },

  {
    id: "turtle",
    name: "Turtle",
    emoji: "🐢",

    points: [
      { x: 170, y: 220 },
      { x: 220, y: 145 },
      { x: 315, y: 110 },
      { x: 415, y: 125 },
      { x: 500, y: 180 },
      { x: 550, y: 205 },
      { x: 520, y: 245 },
      { x: 485, y: 250 },
      { x: 440, y: 315 },
      { x: 390, y: 285 },
      { x: 315, y: 335 },
      { x: 240, y: 285 },
      { x: 190, y: 315 },
      { x: 150, y: 250 },
      { x: 170, y: 220 },
    ],

    guide: () => (
      <>
        <ellipse
          cx="330"
          cy="220"
          rx="165"
          ry="105"
          className="guide-shape"
        />

        <circle
          cx="545"
          cy="205"
          r="28"
          className="guide-shape"
        />

        <ellipse
          cx="225"
          cy="138"
          rx="26"
          ry="18"
          className="guide-shape"
        />

        <ellipse
          cx="430"
          cy="138"
          rx="26"
          ry="18"
          className="guide-shape"
        />

        <ellipse
          cx="225"
          cy="304"
          rx="26"
          ry="18"
          className="guide-shape"
        />

        <ellipse
          cx="430"
          cy="304"
          rx="26"
          ry="18"
          className="guide-shape"
        />

        <polygon
          points="155,220 122,208 122,232"
          className="guide-shape"
        />

        <path
          d="M280 145 L280 295"
          className="guide-line"
        />

        <path
          d="M220 185 L440 185"
          className="guide-line"
        />

        <path
          d="M220 255 L440 255"
          className="guide-line"
        />

        <path
          d="M220 185 L280 145 L440 185 L440 255 L280 295 L220 255 Z"
          className="guide-line"
        />
      </>
    ),

    decorate: () => (
      <>
        <ellipse
          cx="330"
          cy="220"
          rx="165"
          ry="105"
          className="final-shape"
        />

        <circle
          cx="545"
          cy="205"
          r="28"
          className="final-shape"
        />

        <ellipse
          cx="225"
          cy="138"
          rx="26"
          ry="18"
          className="final-shape"
        />

        <ellipse
          cx="430"
          cy="138"
          rx="26"
          ry="18"
          className="final-shape"
        />

        <ellipse
          cx="225"
          cy="304"
          rx="26"
          ry="18"
          className="final-shape"
        />

        <ellipse
          cx="430"
          cy="304"
          rx="26"
          ry="18"
          className="final-shape"
        />

        <polygon
          points="155,220 122,208 122,232"
          className="final-shape"
        />

        <circle
          cx="552"
          cy="198"
          r="4"
          fill="#222"
        />

        <path
          d="M280 145 L280 295"
          fill="none"
          stroke="#355b44"
          strokeWidth="4"
        />

        <path
          d="M220 185 L440 185"
          fill="none"
          stroke="#355b44"
          strokeWidth="4"
        />

        <path
          d="M220 255 L440 255"
          fill="none"
          stroke="#355b44"
          strokeWidth="4"
        />

        <path
          d="M220 185 L280 145 L440 185 L440 255 L280 295 L220 255 Z"
          fill="none"
          stroke="#355b44"
          strokeWidth="4"
        />
      </>
    ),
  },

  {
    id: "rabbit",
    name: "Rabbit",
    emoji: "🐰",

    points: [
      { x: 280, y: 315 },
      { x: 250, y: 225 },
      { x: 255, y: 130 },
      { x: 280, y: 40 },
      { x: 315, y: 130 },
      { x: 350, y: 160 },
      { x: 385, y: 130 },
      { x: 410, y: 40 },
      { x: 435, y: 130 },
      { x: 440, y: 225 },
      { x: 410, y: 315 },
      { x: 360, y: 352 },
      { x: 320, y: 330 },
      { x: 290, y: 352 },
      { x: 280, y: 315 },
    ],

    guide: () => (
      <>
        <ellipse
          cx="345"
          cy="230"
          rx="100"
          ry="105"
          className="guide-shape"
        />

        <ellipse
          cx="292"
          cy="86"
          rx="28"
          ry="82"
          className="guide-shape"
        />

        <ellipse
          cx="398"
          cy="86"
          rx="28"
          ry="82"
          className="guide-shape"
        />

        <circle
          cx="312"
          cy="215"
          r="10"
          className="guide-eye"
        />

        <circle
          cx="378"
          cy="215"
          r="10"
          className="guide-eye"
        />

        <polygon
          points="335,242 355,242 345,258"
          className="guide-shape"
        />

        <path
          d="M345 258 Q332 275 325 290"
          className="guide-line"
        />

        <path
          d="M345 258 Q358 275 365 290"
          className="guide-line"
        />
      </>
    ),

    decorate: () => (
      <>
        <ellipse
          cx="345"
          cy="230"
          rx="100"
          ry="105"
          className="final-shape"
        />

        <ellipse
          cx="292"
          cy="86"
          rx="28"
          ry="82"
          className="final-shape"
        />

        <ellipse
          cx="398"
          cy="86"
          rx="28"
          ry="82"
          className="final-shape"
        />

        <circle
          cx="312"
          cy="215"
          r="10"
          fill="#222"
        />

        <circle
          cx="378"
          cy="215"
          r="10"
          fill="#222"
        />

        <polygon
          points="335,242 355,242 345,258"
          fill="#ff6b6b"
          stroke="#222"
          strokeWidth="3"
        />

        <path
          d="M345 258 Q332 275 325 290"
          fill="none"
          stroke="#222"
          strokeWidth="3"
        />

        <path
          d="M345 258 Q358 275 365 290"
          fill="none"
          stroke="#222"
          strokeWidth="3"
        />
      </>
    ),
  },

  {
    id: "butterfly",
    name: "Butterfly",
    emoji: "🦋",

    points: [
      { x: 350, y: 70 },
      { x: 250, y: 115 },
      { x: 195, y: 190 },
      { x: 245, y: 295 },
      { x: 325, y: 255 },
      { x: 350, y: 205 },
      { x: 375, y: 255 },
      { x: 455, y: 295 },
      { x: 505, y: 190 },
      { x: 450, y: 115 },
      { x: 350, y: 70 },
      { x: 350, y: 320 },
    ],

    guide: () => (
      <>
        <ellipse
          cx="270"
          cy="155"
          rx="82"
          ry="68"
          className="guide-shape"
        />

        <ellipse
          cx="270"
          cy="270"
          rx="82"
          ry="62"
          className="guide-shape"
        />

        <ellipse
          cx="430"
          cy="155"
          rx="82"
          ry="68"
          className="guide-shape"
        />

        <ellipse
          cx="430"
          cy="270"
          rx="82"
          ry="62"
          className="guide-shape"
        />

        <rect
          x="334"
          y="92"
          width="32"
          height="190"
          rx="16"
          className="guide-shape"
        />

        <circle
          cx="350"
          cy="70"
          r="18"
          className="guide-shape"
        />

        <path
          d="M342 54 L325 25"
          className="guide-line"
        />

        <path
          d="M358 54 L375 25"
          className="guide-line"
        />
      </>
    ),

    decorate: () => (
      <>
        <ellipse
          cx="270"
          cy="155"
          rx="82"
          ry="68"
          className="final-shape"
        />

        <ellipse
          cx="270"
          cy="270"
          rx="82"
          ry="62"
          className="final-shape"
        />

        <ellipse
          cx="430"
          cy="155"
          rx="82"
          ry="68"
          className="final-shape"
        />

        <ellipse
          cx="430"
          cy="270"
          rx="82"
          ry="62"
          className="final-shape"
        />

        <rect
          x="334"
          y="92"
          width="32"
          height="190"
          rx="16"
          className="final-shape"
        />

        <circle
          cx="350"
          cy="70"
          r="18"
          className="final-shape"
        />

        <path
          d="M342 54 L325 25"
          fill="none"
          stroke="#222"
          strokeWidth="3"
        />

        <path
          d="M358 54 L375 25"
          fill="none"
          stroke="#222"
          strokeWidth="3"
        />

        <circle
          cx="325"
          cy="25"
          r="4"
          fill="#222"
        />

        <circle
          cx="375"
          cy="25"
          r="4"
          fill="#222"
        />
      </>
    ),
  },

  {
    id: "cat",
    name: "Cat",
    emoji: "🐱",

    points: [
      { x: 230, y: 300 },
      { x: 230, y: 180 },
      { x: 275, y: 85 },
      { x: 322, y: 160 },
      { x: 378, y: 160 },
      { x: 425, y: 85 },
      { x: 470, y: 180 },
      { x: 470, y: 300 },
      { x: 400, y: 350 },
      { x: 300, y: 350 },
      { x: 230, y: 300 },
    ],

    guide: () => (
      <>
        <circle
          cx="350"
          cy="235"
          r="118"
          className="guide-shape"
        />

        <polygon
          points="260,150 290,72 325,150"
          className="guide-shape"
        />

        <polygon
          points="375,150 410,72 440,150"
          className="guide-shape"
        />

        <circle
          cx="315"
          cy="225"
          r="10"
          className="guide-eye"
        />

        <circle
          cx="385"
          cy="225"
          r="10"
          className="guide-eye"
        />

        <polygon
          points="340,255 360,255 350,272"
          className="guide-shape"
        />

        <path
          d="M350 272 Q332 288 324 302"
          className="guide-line"
        />

        <path
          d="M350 272 Q368 288 376 302"
          className="guide-line"
        />

        <path
          d="M240 250 L315 245"
          className="guide-line"
        />

        <path
          d="M240 270 L315 265"
          className="guide-line"
        />

        <path
          d="M385 245 L460 250"
          className="guide-line"
        />

        <path
          d="M385 265 L460 270"
          className="guide-line"
        />
      </>
    ),

    decorate: () => (
      <>
        <circle
          cx="350"
          cy="235"
          r="118"
          className="final-shape"
        />

        <polygon
          points="260,150 290,72 325,150"
          className="final-shape"
        />

        <polygon
          points="375,150 410,72 440,150"
          className="final-shape"
        />

        <circle
          cx="315"
          cy="225"
          r="10"
          fill="#222"
        />

        <circle
          cx="385"
          cy="225"
          r="10"
          fill="#222"
        />

        <polygon
          points="340,255 360,255 350,272"
          fill="#ff66b2"
          stroke="#222"
          strokeWidth="3"
        />

        <path
          d="M350 272 Q332 288 324 302"
          fill="none"
          stroke="#222"
          strokeWidth="3"
        />

        <path
          d="M350 272 Q368 288 376 302"
          fill="none"
          stroke="#222"
          strokeWidth="3"
        />

        <path
          d="M240 250 L315 245"
          fill="none"
          stroke="#222"
          strokeWidth="3"
        />

        <path
          d="M240 270 L315 265"
          fill="none"
          stroke="#222"
          strokeWidth="3"
        />

        <path
          d="M385 245 L460 250"
          fill="none"
          stroke="#222"
          strokeWidth="3"
        />

        <path
          d="M385 265 L460 270"
          fill="none"
          stroke="#222"
          strokeWidth="3"
        />
      </>
    ),
  },

  {
    id: "bird",
    name: "Bird",
    emoji: "🐦",

    points: [
      { x: 190, y: 230 },
      { x: 240, y: 160 },
      { x: 325, y: 130 },
      { x: 410, y: 145 },
      { x: 470, y: 190 },
      { x: 535, y: 180 },
      { x: 575, y: 205 },
      { x: 535, y: 230 },
      { x: 480, y: 248 },
      { x: 440, y: 312 },
      { x: 360, y: 335 },
      { x: 275, y: 310 },
      { x: 210, y: 270 },
      { x: 190, y: 230 },
    ],

    guide: () => (
      <>
        <ellipse
          cx="335"
          cy="230"
          rx="155"
          ry="102"
          className="guide-shape"
        />

        <ellipse
          cx="350"
          cy="235"
          rx="70"
          ry="46"
          className="guide-shape"
        />

        <polygon
          points="470,190 548,170 548,210"
          className="guide-shape"
        />

        <polygon
          points="195,225 132,178 145,255"
          className="guide-shape"
        />

        <circle
          cx="420"
          cy="195"
          r="9"
          className="guide-eye"
        />

        <line
          x1="290"
          y1="325"
          x2="282"
          y2="356"
          className="guide-line"
        />

        <line
          x1="360"
          y1="325"
          x2="368"
          y2="356"
          className="guide-line"
        />
      </>
    ),

    decorate: () => (
      <>
        <ellipse
          cx="335"
          cy="230"
          rx="155"
          ry="102"
          className="final-shape"
        />

        <ellipse
          cx="350"
          cy="235"
          rx="70"
          ry="46"
          className="final-shape"
        />

        <polygon
          points="470,190 548,170 548,210"
          className="final-shape"
        />

        <polygon
          points="195,225 132,178 145,255"
          className="final-shape"
        />

        <circle
          cx="420"
          cy="195"
          r="9"
          fill="#222"
        />

        <line
          x1="290"
          y1="325"
          x2="282"
          y2="356"
          stroke="#222"
          strokeWidth="4"
        />

        <line
          x1="360"
          y1="325"
          x2="368"
          y2="356"
          stroke="#222"
          strokeWidth="4"
        />
      </>
    ),
  },
];

/* =========================================================
   COMPONENT
   ========================================================= */

export default function ConnectTheNumbersAnimal() {
  const {
    savedState,
    loading: progressLoading,
    save,
  } = useGameProgress(GAME_ID, {
    animalIndex: 0,
    currentStep: 1,
    connectedLines: [],
    message: "Start tracing from number 1.",
    completed: false,
  });

  const [animalIndex, setAnimalIndex] =
    useState(0);

  const [currentStep, setCurrentStep] =
    useState(1);

  const [connectedLines, setConnectedLines] =
    useState([]);

  const [message, setMessage] = useState(
    "Start tracing from number 1."
  );

  const [completed, setCompleted] =
    useState(false);

  const [isTracing, setIsTracing] =
    useState(false);

  const [dragLine, setDragLine] =
    useState(null);

  const [restored, setRestored] =
    useState(false);

  const [showCompletionPopup, setShowCompletionPopup] =
    useState(false);

  const [wholeGameCompleted, setWholeGameCompleted] =
    useState(false);

  const svgRef = useRef(null);

  const animal = animals[animalIndex];

  const numberedPoints = useMemo(() => {
    return animal.points.map(
      (point, index) => ({
        ...point,
        number: index + 1,
      })
    );
  }, [animal]);

  /* =========================================================
     RESTORE FIREBASE PROGRESS
     ========================================================= */

  useEffect(() => {
    if (
      progressLoading ||
      restored ||
      !savedState
    ) {
      return;
    }

    const savedAnimalIndex =
      Number.isInteger(
        savedState.animalIndex
      )
        ? savedState.animalIndex
        : 0;

    const safeAnimalIndex =
      savedAnimalIndex >= 0 &&
      savedAnimalIndex < animals.length
        ? savedAnimalIndex
        : 0;

    const savedAnimal =
      animals[safeAnimalIndex];

    const maxStep =
      savedAnimal.points.length;

    const safeStep =
      Number.isInteger(
        savedState.currentStep
      ) &&
      savedState.currentStep >= 1
        ? Math.min(
            savedState.currentStep,
            maxStep
          )
        : 1;

    setAnimalIndex(
      safeAnimalIndex
    );

    setCurrentStep(
      safeStep
    );

    setConnectedLines(
      Array.isArray(
        savedState.connectedLines
      )
        ? savedState.connectedLines
        : []
    );

    setMessage(
      savedState.message ||
        "Start tracing from number 1."
    );

    setCompleted(
      Boolean(savedState.completed)
    );

    setIsTracing(false);
    setDragLine(null);

    setRestored(true);

    console.log(
      "🔥 Connect Numbers restored:",
      savedState
    );
  }, [
    progressLoading,
    savedState,
    restored,
  ]);

  /* =========================================================
     SAVE STATE
     ========================================================= */

  const saveCurrentState = async ({
    nextAnimalIndex = animalIndex,
    nextStep = currentStep,
    nextLines = connectedLines,
    nextMessage = message,
    nextCompleted = completed,
  } = {}) => {
    await save({
      animalIndex:
        nextAnimalIndex,

      currentStep:
        nextStep,

      connectedLines:
        nextLines,

      message:
        nextMessage,

      completed:
        nextCompleted,
    });
  };

  /* =========================================================
     RESET
     ========================================================= */

  const resetGame = async () => {
    const resetMessage =
      "Start tracing from number 1.";

    setCurrentStep(1);
    setConnectedLines([]);
    setMessage(resetMessage);
    setCompleted(false);

    setIsTracing(false);
    setDragLine(null);

    setShowCompletionPopup(false);
    setWholeGameCompleted(false);

    await saveCurrentState({
      nextAnimalIndex:
        animalIndex,

      nextStep: 1,

      nextLines: [],

      nextMessage:
        resetMessage,

      nextCompleted:
        false,
    });
  };

  /* =========================================================
     NEXT ANIMAL
     ========================================================= */

  const nextAnimal = async () => {
    const isLastAnimal =
      animalIndex ===
      animals.length - 1;

    setShowCompletionPopup(false);

    if (isLastAnimal) {
      const firstAnimal =
        animals[0];

      const nextMessage =
        "Start tracing from number 1.";

      setAnimalIndex(0);
      setCurrentStep(1);
      setConnectedLines([]);
      setMessage(nextMessage);
      setCompleted(false);

      setIsTracing(false);
      setDragLine(null);

      setWholeGameCompleted(false);

      await save({
        animalIndex: 0,
        currentStep: 1,
        connectedLines: [],
        message: nextMessage,
        completed: false,
      });

      return;
    }

    const nextIndex =
      animalIndex + 1;

    const nextMessage =
      "Start tracing from number 1.";

    setAnimalIndex(
      nextIndex
    );

    setCurrentStep(1);

    setConnectedLines([]);

    setMessage(
      nextMessage
    );

    setCompleted(false);

    setIsTracing(false);
    setDragLine(null);

    setWholeGameCompleted(false);

    await save({
      animalIndex:
        nextIndex,

      currentStep: 1,

      connectedLines: [],

      message:
        nextMessage,

      completed: false,
    });
  };

  /* =========================================================
     SWITCH ANIMAL
     ========================================================= */

  const selectAnimal = async (
    index
  ) => {
    const selected =
      animals[index];

    if (!selected) return;

    const nextMessage =
      "Start tracing from number 1.";

    setAnimalIndex(index);

    setCurrentStep(1);

    setConnectedLines([]);

    setMessage(
      nextMessage
    );

    setCompleted(false);

    setIsTracing(false);
    setDragLine(null);

    setShowCompletionPopup(false);

    await save({
      animalIndex:
        index,

      currentStep: 1,

      connectedLines: [],

      message:
        nextMessage,

      completed: false,
    });
  };

  /* =========================================================
     SVG POSITION
     ========================================================= */

  const getSvgPoint = (
    event
  ) => {
    const svg =
      svgRef.current;

    if (!svg) return null;

    const rect =
      svg.getBoundingClientRect();

    const scaleX =
      700 / rect.width;

    const scaleY =
      420 / rect.height;

    return {
      x:
        (event.clientX -
          rect.left) *
        scaleX,

      y:
        (event.clientY -
          rect.top) *
        scaleY,
    };
  };

  /* =========================================================
     DISTANCE
     ========================================================= */

  const distance = (
    a,
    b
  ) => {
    return Math.sqrt(
      (a.x - b.x) ** 2 +
        (a.y - b.y) ** 2
    );
  };

  /* =========================================================
     POINTER DOWN
     ========================================================= */

  const handlePointerDown = (
    event
  ) => {
    if (completed) return;

    const point =
      getSvgPoint(event);

    const startDot =
      numberedPoints[
        currentStep - 1
      ];

    if (
      !point ||
      !startDot
    ) {
      return;
    }

    if (
      distance(
        point,
        startDot
      ) <= HIT_RADIUS
    ) {
      setIsTracing(true);

      setDragLine({
        x1: startDot.x,
        y1: startDot.y,
        x2: point.x,
        y2: point.y,
      });

      setMessage(
        currentStep ===
          numberedPoints.length
          ? `Trace to finish at number ${currentStep}.`
          : `Now trace from ${currentStep} to ${
              currentStep + 1
            }.`
      );
    } else {
      setMessage(
        `Start from number ${currentStep}.`
      );
    }
  };

  /* =========================================================
     POINTER MOVE
     ========================================================= */

  const handlePointerMove = (
    event
  ) => {
    if (
      !isTracing ||
      completed
    ) {
      return;
    }

    const point =
      getSvgPoint(event);

    const startDot =
      numberedPoints[
        currentStep - 1
      ];

    if (
      !point ||
      !startDot
    ) {
      return;
    }

    setDragLine({
      x1: startDot.x,
      y1: startDot.y,
      x2: point.x,
      y2: point.y,
    });
  };

  /* =========================================================
     POINTER UP
     ========================================================= */

  const handlePointerUp = async (
    event
  ) => {
    if (
      !isTracing ||
      completed
    ) {
      return;
    }

    const point =
      getSvgPoint(event);

    const startDot =
      numberedPoints[
        currentStep - 1
      ];

    const nextDot =
      numberedPoints[
        currentStep
      ];

    if (
      !point ||
      !startDot
    ) {
      setIsTracing(false);
      setDragLine(null);
      return;
    }

    /* -------------------------------------------------------
       NO NEXT DOT
    ------------------------------------------------------- */

    if (!nextDot) {
      const completedMessage =
        `Awesome! You finished the ${animal.name}!`;

      setIsTracing(false);
      setDragLine(null);

      setCompleted(true);
      setMessage(
        completedMessage
      );

      await saveCurrentState({
        nextAnimalIndex:
          animalIndex,

        nextStep:
          currentStep,

        nextLines:
          connectedLines,

        nextMessage:
          completedMessage,

        nextCompleted:
          true,
      });

      setWholeGameCompleted(
        animalIndex ===
          animals.length - 1
      );

      setTimeout(() => {
        setShowCompletionPopup(
          true
        );
      }, 350);

      return;
    }

    /* -------------------------------------------------------
       CORRECT ENDPOINT
    ------------------------------------------------------- */

    if (
      distance(
        point,
        nextDot
      ) <= HIT_RADIUS
    ) {
      const newLine = {
        x1: startDot.x,
        y1: startDot.y,
        x2: nextDot.x,
        y2: nextDot.y,
      };

      const newLines = [
        ...connectedLines,
        newLine,
      ];

      const newStep =
        currentStep + 1;

      let newCompleted =
        false;

      let newMessage = "";

      if (
        newStep ===
        numberedPoints.length
      ) {
        newCompleted = true;

        newMessage =
          `Awesome! You finished the ${animal.name}!`;
      } else {
        newMessage =
          `Good job! Now trace from ${newStep} to ${
            newStep + 1
          }.`;
      }

      setConnectedLines(
        newLines
      );

      setCurrentStep(
        newStep
      );

      setMessage(
        newMessage
      );

      setCompleted(
        newCompleted
      );

      await saveCurrentState({
        nextAnimalIndex:
          animalIndex,

        nextStep:
          newStep,

        nextLines:
          newLines,

        nextMessage:
          newMessage,

        nextCompleted:
          newCompleted,
      });

      /* -----------------------------------------------------
         SHOW POPUP AFTER COMPLETING ANIMAL
      ----------------------------------------------------- */

      if (newCompleted) {
        setWholeGameCompleted(
          animalIndex ===
            animals.length - 1
        );

        setTimeout(() => {
          setShowCompletionPopup(
            true
          );
        }, 350);
      }
    } else {
      const retryMessage =
        `Try again. Trace from ${currentStep} to ${
          currentStep + 1
        }.`;

      setMessage(
        retryMessage
      );

      await saveCurrentState({
        nextAnimalIndex:
          animalIndex,

        nextStep:
          currentStep,

        nextLines:
          connectedLines,

        nextMessage:
          retryMessage,

        nextCompleted:
          completed,
      });
    }

    setIsTracing(false);
    setDragLine(null);
  };

  /* =========================================================
     LOADING
     ========================================================= */

  if (
    progressLoading ||
    !restored
  ) {
    return (
      <div className="connect-animal-page">
        <div className="connect-animal-card">

          <div className="connect-top-bar">

            <h1 className="connect-title">
              <img
                src={
                  connectNumbersIcon
                }
                alt="Connect the Numbers"
                className="connect-title-icon"
              />

              <span>
                Connect the Numbers
              </span>
            </h1>

            <p>
              Loading your saved game...
            </p>

          </div>

        </div>
      </div>
    );
  }

  /* =========================================================
     UI
     ========================================================= */

  return (
    <div className="connect-animal-page">

      <div className="connect-animal-card">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="connect-top-bar">

          <h1 className="connect-title">

            <img
              src={
                connectNumbersIcon
              }
              alt="Connect the Numbers"
              className="connect-title-icon"
            />

            <span>
              Connect the Numbers
            </span>

          </h1>

          <p>
            Connect the numbers in order
            and discover the animal!
          </p>

          <div className="animal-progress">
            Animal {animalIndex + 1} /{" "}
            {animals.length}
          </div>

        </div>

        {/* =================================================
            GAME
        ================================================= */}

        <div className="connect-layout">

          {/* =================================================
              CANVAS
          ================================================= */}

          <div className="canvas-box">

            <h2>
              {animal.emoji}{" "}
              {animal.name}
            </h2>

            <div className="instruction-pill">
              Start at{" "}
              <strong>
                number {currentStep}
              </strong>{" "}
              and connect to the next number
            </div>

            <svg
              ref={svgRef}
              viewBox="0 0 700 420"
              className="connect-svg"
              onPointerDown={
                handlePointerDown
              }
              onPointerMove={
                handlePointerMove
              }
              onPointerUp={
                handlePointerUp
              }
              onPointerLeave={
                handlePointerUp
              }
              style={{
                touchAction: "none",
              }}
            >

              {/* Guide */}
              {!completed &&
                animal.guide()}

              {/* Completed animal */}
              {completed &&
                animal.decorate()}

              {/* Connected lines */}
              {connectedLines.map(
                (
                  line,
                  index
                ) => (
                  <line
                    key={index}
                    x1={line.x1}
                    y1={line.y1}
                    x2={line.x2}
                    y2={line.y2}
                    stroke="#333"
                    strokeWidth="5"
                    strokeLinecap="round"
                    className="connected-line"
                  />
                )
              )}

              {/* Dragging line */}
              {dragLine && (
                <line
                  x1={
                    dragLine.x1
                  }
                  y1={
                    dragLine.y1
                  }
                  x2={
                    dragLine.x2
                  }
                  y2={
                    dragLine.y2
                  }
                  stroke="#73c943"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray="8 5"
                />
              )}

              {/* Numbered dots */}
              {numberedPoints.map(
                (point) => {

                  const isCurrent =
                    point.number ===
                    currentStep;

                  const isDone =
                    point.number <
                      currentStep ||
                    completed;

                  return (
                    <g
                      key={
                        point.number
                      }
                    >

                      <circle
                        cx={
                          point.x
                        }
                        cy={
                          point.y
                        }
                        r={
                          isCurrent
                            ? 11
                            : 7
                        }
                        className={
                          isCurrent
                            ? "current-dot"
                            : isDone
                            ? "completed-dot"
                            : "normal-dot"
                        }
                      />

                      <text
                        x={
                          point.x -
                          14
                        }
                        y={
                          point.y -
                          12
                        }
                        textAnchor="middle"
                        className={`dot-number ${
                          isDone
                            ? "done-dot-number"
                            : ""
                        }`}
                      >
                        {
                          point.number
                        }
                      </text>

                    </g>
                  );
                }
              )}

            </svg>

            {/* =================================================
                STATUS
            ================================================= */}

            <div className="status-box">

              <p>
                {message}
              </p>

              <span>
                Step{" "}
                {Math.min(
                  currentStep,
                  numberedPoints.length
                )}{" "}
                /{" "}
                {
                  numberedPoints.length
                }
              </span>

            </div>

            {completed && (
              <div className="done-box">
                🎉 Amazing! You completed{" "}
                {animal.emoji}{" "}
                {animal.name}!
              </div>
            )}

          </div>

          {/* =================================================
              SIDE PANEL
          ================================================= */}

          <div className="side-box">

            <h3>
              How to Play
            </h3>

            <div className="info-card">

              <div className="instruction-row">
                <span>1</span>
                <p>
                  Start from the green dot
                </p>
              </div>

              <div className="instruction-row">
                <span>2</span>
                <p>
                  Drag to the next number
                </p>
              </div>

              <div className="instruction-row">
                <span>3</span>
                <p>
                  Follow all the numbers
                </p>
              </div>

              <div className="instruction-row">
                <span>4</span>
                <p>
                  Discover the animal!
                </p>
              </div>

            </div>

            {/* Current step */}

            <div className="preview-card">

              <div
                className={
                  completed
                    ? "preview-circle completed-preview"
                    : "preview-circle"
                }
              >
                {completed
                  ? "✓"
                  : currentStep}
              </div>

              <span>
                {completed
                  ? "Finished!"
                  : "Current Number"}
              </span>

            </div>

            {/* Animal list */}

            <div className="animal-list-box">

              <h4>
                Animals
              </h4>

              <div className="animal-list">

                {animals.map(
                  (
                    item,
                    index
                  ) => (
                    <button
                      key={
                        item.id
                      }
                      className={`animal-switch ${
                        animalIndex ===
                        index
                          ? "active-switch"
                          : ""
                      }`}
                      onClick={() =>
                        selectAnimal(
                          index
                        )
                      }
                    >
                      <span>
                        {
                          item.emoji
                        }
                      </span>

                      {
                        item.name
                      }
                    </button>
                  )
                )}

              </div>

            </div>

            <div className="btn-group">

              <button
                className="reset-btn"
                onClick={
                  resetGame
                }
              >
                🔄 Reset
              </button>

            </div>

          </div>

        </div>

      </div>

      {/* =====================================================
          COMPLETION POPUP
      ===================================================== */}

      {showCompletionPopup && (
        <div className="connect-completion-overlay">

          <div className="connect-completion-modal">

            <div className="popup-stars">
              ⭐ ⭐ ⭐
            </div>

            <div className="popup-animal">
              {wholeGameCompleted
                ? "🏆"
                : animal.emoji}
            </div>

            <h2>
              {wholeGameCompleted
                ? "Amazing! You Did It!"
                : "Great Job!"}
            </h2>

            <p>
              {wholeGameCompleted
                ? "You connected all the animals!"
                : `You completed the ${animal.name}!`}
            </p>

            <div className="popup-message">
              {wholeGameCompleted
                ? "You finished the whole Connect the Numbers game! 🎉"
                : "Ready for the next animal?"}
            </div>

            <button
              className="popup-next-btn"
              onClick={
                nextAnimal
              }
            >
              {wholeGameCompleted
                ? "START AGAIN →"
                : "NEXT ANIMAL →"}
            </button>

          </div>

        </div>
      )}

    </div>
  );
}