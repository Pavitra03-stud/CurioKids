// =====================================================

// CURIOKIDS BACKEND - COMPLETE SERVER

// Firebase Auth + Firestore + OTP + Gemini AI

// =====================================================



import express from "express";

import cors from "cors";

import dotenv from "dotenv";

import nodemailer from "nodemailer";

import { GoogleGenerativeAI } from "@google/generative-ai";

import { initializeApp, cert } from "firebase-admin/app";

import { getAuth } from "firebase-admin/auth";

import fs from "fs";

import path from "path";

import { fileURLToPath } from "url";



// =====================================================

// ENVIRONMENT

// =====================================================



dotenv.config();

const FRONTEND_URL =
  process.env.FRONTEND_URL ||
  "http://localhost:5173";



const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);



// =====================================================

// FIREBASE ADMIN

// =====================================================



let firebaseServiceAccount;



if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {

  try {

    firebaseServiceAccount = JSON.parse(

      process.env.FIREBASE_SERVICE_ACCOUNT_JSON

    );

  } catch (error) {

    console.error("❌ Invalid FIREBASE_SERVICE_ACCOUNT_JSON");

    console.error(error);

    process.exit(1);

  }

} else {

  const serviceAccountPath = path.join(

    __dirname,

    "curiokids-f13b7-firebase-adminsdk-fbsvc-14a61f3770.json"

  );



  if (!fs.existsSync(serviceAccountPath)) {

    console.error("❌ Firebase service account JSON not found:");

    console.error(serviceAccountPath);

    process.exit(1);

  }



  try {

    firebaseServiceAccount = JSON.parse(

      fs.readFileSync(serviceAccountPath, "utf8")

    );

  } catch (error) {

    console.error("❌ Could not read Firebase service account JSON");

    console.error(error);

    process.exit(1);

  }

}



try {

  initializeApp({

    credential: cert(firebaseServiceAccount),

  });



  console.log("🔥 Firebase Admin connected");

} catch (error) {

  console.error("❌ Firebase Admin initialization failed");

  console.error(error);

  process.exit(1);

}



const firebaseAuth = getAuth();



// =====================================================

// EXPRESS

// =====================================================



const app = express();



app.use(

  cors({

    origin: FRONTEND_URL,

    credentials: true,

  })

);



app.use(express.json({ limit: "2mb" }));



console.log("🔥 SERVER STARTED");



// =====================================================

// EMAIL

// =====================================================



const transporter = nodemailer.createTransport({

  service: "gmail",

  auth: {

    user: process.env.EMAIL_USER,

    pass: process.env.EMAIL_PASS,

  },

});



// =====================================================

// OTP STORAGE

// =====================================================



// email -> {

//   otp,

//   expiresAt,

//   attempts

// }



const otpStore = {};



const OTP_EXPIRY_MS = 5 * 60 * 1000;

const MAX_OTP_ATTEMPTS = 5;



// =====================================================

// GEMINI

// =====================================================



let model = null;



if (process.env.GEMINI_API_KEY) {

  try {

    const genAI = new GoogleGenerativeAI(

      process.env.GEMINI_API_KEY

    );



    model = genAI.getGenerativeModel({

      model: "gemini-1.5-flash",

    });



    console.log("🤖 Gemini connected");

  } catch (error) {

    console.error("⚠️ Gemini initialization failed");

    console.error(error);

  }

} else {

  console.log("⚠️ GEMINI_API_KEY not found");

}



// =====================================================

// GAME MEMORY

// =====================================================



let lastTarget = "";

let lastWord = "";

let lastEndingWord = "";

let lastSoundWord = "";

let lastRhymeWord = "";

let lastBlendWord = "";

let lastBreakWord = "";

let lastBuildWord = "";

let lastMissingWord = "";

let lastSightWord = "";

let lastScrambleWord = "";

let lastSentence = "";

let lastImageWord = "";



// =====================================================

// ROOT

// =====================================================



app.get("/", (req, res) => {

  res.json({

    success: true,

    message: "CurioKids Backend running 🚀",

  });

});



// =====================================================

// REGISTER

// IMPORTANT:

// DO NOT CREATE FIREBASE USER HERE.

// USER IS CREATED ONLY AFTER OTP VERIFICATION.

// =====================================================



// =====================================================

// REGISTER

// IMPORTANT:

// DO NOT CREATE FIREBASE USER HERE.

// USER IS CREATED ONLY AFTER OTP VERIFICATION.

// =====================================================



app.post("/api/register", async (req, res) => {

  try {

    const name = String(req.body?.name || "").trim();



    const email = String(req.body?.email || "")

      .trim()

      .toLowerCase();



    // -------------------------------------------------

    // BASIC VALIDATION

    // -------------------------------------------------



    if (!name || !email) {

      return res.status(400).json({

        success: false,

        message: "Name and email are required",

      });

    }



    // -------------------------------------------------

    // EMAIL VALIDATION

    // -------------------------------------------------



    const emailRegex =

      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;



    if (!emailRegex.test(email)) {

      return res.status(400).json({

        success: false,

        message: "Please enter a valid email address",

      });

    }



    // -------------------------------------------------

    // CHECK IF USER ALREADY EXISTS

    // -------------------------------------------------



    try {

      const existingUser =

        await firebaseAuth.getUserByEmail(email);



      if (existingUser) {

        console.log(

          "⚠️ Registration blocked - user already exists:",

          email

        );



        return res.status(409).json({

          success: false,

          type: "USER_EXISTS",

          message:

            "User already registered! Please login 🔐",

        });

      }

    } catch (error) {

      // Firebase throws this when the user does not exist.

      if (error.code !== "auth/user-not-found") {

        throw error;

      }

    }



    // -------------------------------------------------

    // CHECK IF REGISTRATION / OTP IS ALREADY PENDING

    // -------------------------------------------------



    if (otpStore[email]) {

      console.log(

        "⚠️ Registration blocked - OTP already pending:",

        email

      );



      return res.status(409).json({

        success: false,

        type: "USER_EXISTS",

        message:

          "This email is already registered. Please login 🔐",

      });

    }



    // -------------------------------------------------

    // LOG

    // -------------------------------------------------



    console.log("📝 New register request:", {

      name,

      email,

    });



    // -------------------------------------------------

    // IMPORTANT

    //

    // We do NOT create Firebase user here.

    //

    // Firebase user will be created after OTP

    // verification.

    // -------------------------------------------------



    return res.json({

      success: true,

      message: "Registration details accepted ✅",

      name,

      email,

    });



  } catch (error) {

    console.error(

      "❌ Register error:",

      error

    );



    return res.status(500).json({

      success: false,

      message: "Registration failed ❌",

    });

  }

});



// =====================================================

// SEND OTP

// =====================================================



app.post("/api/send-otp", async (req, res) => {

  try {

    const email = String(req.body?.email || "")

      .trim()

      .toLowerCase();



    if (!email) {

      return res.status(400).json({

        success: false,

        message: "Email is required 📧",

      });

    }



    const emailRegex =

      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;



    if (!emailRegex.test(email)) {

      return res.status(400).json({

        success: false,

        message: "Invalid email address",

      });

    }



    // Generate 6-digit OTP

    const otp = Math.floor(

      100000 + Math.random() * 900000

    );



    otpStore[email] = {

      otp: String(otp),

      expiresAt: Date.now() + OTP_EXPIRY_MS,

      attempts: 0,

    };



    console.log(`📧 Sending OTP to ${email}`);



    await transporter.sendMail({

      from: process.env.EMAIL_USER,

      to: email,

      subject: "CurioKids OTP",

      html: `

        <div

          style="

            font-family: Arial, sans-serif;

            padding: 20px;

            max-width: 500px;

            margin: auto;

          "

        >

          <h2>🌴 CurioKids</h2>



          <p>

            Your CurioKids verification code is:

          </p>



          <h1

            style="

              letter-spacing: 8px;

              font-size: 36px;

            "

          >

            ${otp}

          </h1>



          <p>

            Enter this OTP in CurioKids to continue.

          </p>



          <p>

            ⏰ This OTP expires in 5 minutes.

          </p>



          <p>

            Please do not share this code with anyone.

          </p>

        </div>

      `,

    });



    console.log(

      `✅ OTP sent successfully: ${email}`

    );



    return res.json({

      success: true,

      message: "OTP sent successfully 📧",

    });

  } catch (error) {

    console.error("❌ OTP email error:");

    console.error(error);



    return res.status(500).json({

      success: false,

      message: "Email failed ❌",

    });

  }

});



// =====================================================

// VERIFY OTP + FIREBASE CUSTOM TOKEN

// =====================================================



app.post("/api/verify-otp", async (req, res) => {

  try {

    const email = String(req.body?.email || "")

      .trim()

      .toLowerCase();



    const otp = String(req.body?.otp || "").trim();



    if (!email || !otp) {

      return res.status(400).json({

        success: false,

        message: "Email and OTP are required",

      });

    }



    // -------------------------------------------------

    // CHECK OTP EXISTS

    // -------------------------------------------------



    const storedOtp = otpStore[email];



    if (!storedOtp) {

      return res.status(400).json({

        success: false,

        message:

          "OTP not found. Please request a new OTP.",

      });

    }



    // -------------------------------------------------

    // CHECK EXPIRY

    // -------------------------------------------------



    if (Date.now() > storedOtp.expiresAt) {

      delete otpStore[email];



      return res.status(400).json({

        success: false,

        message:

          "OTP expired. Please request a new OTP.",

      });

    }



    // -------------------------------------------------

    // CHECK ATTEMPTS

    // -------------------------------------------------



    if (

      storedOtp.attempts >=

      MAX_OTP_ATTEMPTS

    ) {

      delete otpStore[email];



      return res.status(400).json({

        success: false,

        message:

          "Too many incorrect attempts. Please request a new OTP.",

      });

    }



    // -------------------------------------------------

    // CHECK OTP

    // -------------------------------------------------



    if (storedOtp.otp !== otp) {

      storedOtp.attempts += 1;



      return res.status(400).json({

        success: false,

        message: "Invalid OTP ❌",

        attemptsRemaining:

          MAX_OTP_ATTEMPTS -

          storedOtp.attempts,

      });

    }



    // -------------------------------------------------

    // OTP VALID

    // -------------------------------------------------



    delete otpStore[email];



    console.log(

      `✅ OTP verified: ${email}`

    );



    // -------------------------------------------------

    // FIND OR CREATE FIREBASE USER

    // -------------------------------------------------



    let firebaseUser;



    try {

      firebaseUser =

        await firebaseAuth.getUserByEmail(

          email

        );



      console.log(

        "✅ Existing Firebase user:",

        firebaseUser.uid

      );

    } catch (error) {

      if (

        error.code ===

        "auth/user-not-found"

      ) {

        firebaseUser =

          await firebaseAuth.createUser({

            email,

            emailVerified: true,

          });



        console.log(

          "🆕 Firebase user created:",

          firebaseUser.uid

        );

      } else {

        throw error;

      }

    }



    // -------------------------------------------------

    // UPDATE EMAIL VERIFIED

    // -------------------------------------------------



    if (!firebaseUser.emailVerified) {

      firebaseUser =

        await firebaseAuth.updateUser(

          firebaseUser.uid,

          {

            emailVerified: true,

          }

        );

    }



    // -------------------------------------------------

    // CREATE FIREBASE CUSTOM TOKEN

    // -------------------------------------------------



    const customToken =

      await firebaseAuth.createCustomToken(

        firebaseUser.uid

      );



    console.log(

      "🎟️ Firebase custom token created"

    );



    // -------------------------------------------------

    // RESPONSE

    // -------------------------------------------------



    return res.json({

      success: true,

      message:

        "OTP verified successfully 🎉",

      uid: firebaseUser.uid,

      email: firebaseUser.email,

      customToken,

    });

  } catch (error) {

    console.error(

      "❌ OTP verification error:"

    );



    console.error(error);



    return res.status(500).json({

      success: false,

      message:

        "OTP verification failed ❌",

    });

  }

});



// =====================================================

// AI TEACH

// =====================================================



app.post("/ai/teach", async (req, res) => {

  try {

    const topic = String(

      req.body?.topic || "animals"

    );



    if (!model) {

      return res.json({

        explanation:

          "🌿 Let's learn about " +

          topic +

          "! It is fun to discover new things!",

      });

    }



    const prompt = `

Explain ${topic} to a small kid

in a jungle theme.



Use very simple and friendly language.

Keep the answer to 2 short lines.

Do not use difficult words.

`;



    const response =

      await model.generateContent(prompt);



    return res.json({

      explanation:

        response.response.text(),

    });

  } catch (error) {

    console.error(

      "❌ TEACH ERROR:",

      error

    );



    return res.json({

      explanation:

        "🌿 In the jungle, animals make sounds. Listen carefully!",

    });

  }

});



// =====================================================

// AI ANALYZE

// =====================================================



app.post("/ai/analyze", async (req, res) => {

  try {

    const {

      letter,

      drawing,

      answers,

    } = req.body || {};



    console.log("Letter:", letter);

    console.log("Drawing:", drawing);

    console.log("Answers:", answers);



    if (answers?.correct) {

      return res.json({

        score: 90,

        status: "correct",

        message: "✅ Good job!",

        analysis:

          "🌟 Great job! You are learning fast!",

      });

    }



    const score =

      Math.floor(Math.random() * 101);



    let status;

    let message;



    if (score < 30) {

      status = "wrong";

      message = "❌ Incorrect letter";

    } else if (score <= 60) {

      status = "practice";

      message = "⚠️ Needs practice";

    } else {

      status = "correct";

      message = "✅ Good job!";

    }



    return res.json({

      score,

      status,

      message,

      analysis:

        status === "correct"

          ? "🌟 Great job! You are learning fast!"

          : "💡 Try again! Keep practicing!",

    });

  } catch (error) {

    console.error(

      "❌ ANALYZE ERROR:",

      error

    );



    return res.status(500).json({

      message:

        "AI analysis failed ❌",

    });

  }

});



// =====================================================

// SOUND TAP / QUESTION

// =====================================================



app.post(

  "/ai/generate-question",

  async (req, res) => {

    try {

      const animals = [

        "🐵 Monkey",

        "🦁 Lion",

        "🐘 Elephant",

        "🐦 Bird",

      ];



      const animal =

        animals[

        Math.floor(

          Math.random() *

          animals.length

        )

        ];



      const count =

        Math.floor(Math.random() * 4) + 1;



      return res.json({

        question:

          `${animal} made sound ${count} times. ` +

          `How many sounds did you hear?`,

        options: [

          "1",

          "2",

          "3",

          "4",

        ],

        answer: String(count),

      });

    } catch (error) {

      console.error(

        "❌ QUESTION ERROR:",

        error

      );



      return res.json({

        question:

          "🐵 Monkey made 2 sounds. How many?",

        options: [

          "1",

          "2",

          "3",

          "4",

        ],

        answer: "2",

      });

    }

  }

);



// =====================================================

// CONFUSING LETTER

// =====================================================



app.post(

  "/api/generate-confusing-letter",

  async (req, res) => {

    try {

      const sets = [

        ["b", "d", "p", "q"],

        ["m", "n", "u", "v"],

        ["c", "k", "g", "j", "s", "z"],

      ];



      const set =

        sets[

        Math.floor(

          Math.random() *

          sets.length

        )

        ];



      let target =

        set[

        Math.floor(

          Math.random() *

          set.length

        )

        ];



      if (target === lastTarget) {

        const available = set.filter(

          (item) =>

            item !== lastTarget

        );



        target =

          available[

          Math.floor(

            Math.random() *

            available.length

          )

          ];

      }



      lastTarget = target;



      const options = [

        ...set,

        ...set,

      ]

        .sort(

          () => 0.5 - Math.random()

        )

        .slice(0, 8);



      return res.json({

        target,

        options,

      });

    } catch (error) {

      console.error(error);



      return res.json({

        target: "b",

        options: [

          "b",

          "d",

          "p",

          "q",

          "b",

          "d",

          "p",

          "q",

        ],

      });

    }

  }

);



// =====================================================

// BEGINNING SOUND

// =====================================================



app.post(

  "/api/generate-beginning-sound",

  async (req, res) => {

    try {

      const words = [

        {

          word: "Dog",

          sound: "D",

          emoji: "🐶",

        },

        {

          word: "Cat",

          sound: "C",

          emoji: "🐱",

        },

        {

          word: "Ball",

          sound: "B",

          emoji: "⚽",

        },

        {

          word: "Monkey",

          sound: "M",

          emoji: "🐵",

        },

        {

          word: "Fish",

          sound: "F",

          emoji: "🐟",

        },

        {

          word: "Sun",

          sound: "S",

          emoji: "☀️",

        },

        {

          word: "Lion",

          sound: "L",

          emoji: "🦁",

        },

        {

          word: "Apple",

          sound: "A",

          emoji: "🍎",

        },

      ];



      let randomWord;



      do {

        randomWord =

          words[

          Math.floor(

            Math.random() *

            words.length

          )

          ];

      } while (

        randomWord.word ===

        lastWord &&

        words.length > 1

      );



      lastWord = randomWord.word;



      const letters =

        "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");



      const wrong = letters

        .filter(

          (letter) =>

            letter !==

            randomWord.sound

        )

        .sort(

          () => 0.5 - Math.random()

        )

        .slice(0, 3);



      const options = [

        ...wrong,

        randomWord.sound,

      ].sort(

        () => 0.5 - Math.random()

      );



      return res.json({

        word: randomWord.word,

        sound: randomWord.sound,

        emoji: randomWord.emoji,

        options,

      });

    } catch (error) {

      console.error(error);



      return res.json({

        word: "Dog",

        sound: "D",

        emoji: "🐶",

        options: [

          "D",

          "B",

          "M",

          "S",

        ],

      });

    }

  }

);



// =====================================================

// ENDING SOUND

// =====================================================



app.post(

  "/api/generate-ending-sound",

  async (req, res) => {

    try {

      const words = [

        {

          word: "Dog",

          sound: "G",

          emoji: "🐶",

        },

        {

          word: "Cat",

          sound: "T",

          emoji: "🐱",

        },

        {

          word: "Ball",

          sound: "L",

          emoji: "⚽",

        },

        {

          word: "Fish",

          sound: "H",

          emoji: "🐟",

        },

        {

          word: "Sun",

          sound: "N",

          emoji: "☀️",

        },

        {

          word: "Book",

          sound: "K",

          emoji: "📘",

        },

        {

          word: "Hat",

          sound: "T",

          emoji: "🎩",

        },

        {

          word: "Cup",

          sound: "P",

          emoji: "☕",

        },

      ];



      let randomWord;



      do {

        randomWord =

          words[

          Math.floor(

            Math.random() *

            words.length

          )

          ];

      } while (

        randomWord.word ===

        lastEndingWord &&

        words.length > 1

      );



      lastEndingWord =

        randomWord.word;



      const letters =

        "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");



      const wrong = letters

        .filter(

          (letter) =>

            letter !==

            randomWord.sound

        )

        .sort(

          () => 0.5 - Math.random()

        )

        .slice(0, 3);



      const options = [

        ...wrong,

        randomWord.sound,

      ].sort(

        () => 0.5 - Math.random()

      );



      return res.json({

        word: randomWord.word,

        sound: randomWord.sound,

        emoji: randomWord.emoji,

        options,

      });

    } catch (error) {

      console.error(error);



      return res.json({

        word: "Dog",

        sound: "G",

        emoji: "🐶",

        options: [

          "G",

          "D",

          "M",

          "S",

        ],

      });

    }

  }

);



// =====================================================

// SOUND MATCHING

// =====================================================



app.post(

  "/api/generate-sound-matching",

  async (req, res) => {

    try {

      const words = [

        {

          word: "Ball",

          sound: "B",

          emoji: "⚽",

        },

        {

          word: "Cat",

          sound: "C",

          emoji: "🐱",

        },

        {

          word: "Dog",

          sound: "D",

          emoji: "🐶",

        },

        {

          word: "Sun",

          sound: "S",

          emoji: "☀️",

        },

        {

          word: "Fish",

          sound: "F",

          emoji: "🐟",

        },

        {

          word: "Hat",

          sound: "H",

          emoji: "🎩",

        },

        {

          word: "Book",

          sound: "B",

          emoji: "📘",

        },

        {

          word: "Cup",

          sound: "C",

          emoji: "☕",

        },

      ];



      let correct;



      do {

        correct =

          words[

          Math.floor(

            Math.random() *

            words.length

          )

          ];

      } while (

        correct.word ===

        lastSoundWord &&

        words.length > 1

      );



      lastSoundWord =

        correct.word;



      const wrong = words

        .filter(

          (word) =>

            word.sound !==

            correct.sound

        )

        .sort(

          () => 0.5 - Math.random()

        )

        .slice(0, 3);



      const options = [

        correct,

        ...wrong,

      ].sort(

        () => 0.5 - Math.random()

      );



      return res.json({

        sound: correct.sound,

        options,

      });

    } catch (error) {

      console.error(error);



      return res.json({

        sound: "B",

        options: [

          {

            word: "Ball",

            sound: "B",

            emoji: "⚽",

          },

          {

            word: "Cat",

            sound: "C",

            emoji: "🐱",

          },

          {

            word: "Dog",

            sound: "D",

            emoji: "🐶",

          },

          {

            word: "Sun",

            sound: "S",

            emoji: "☀️",

          },

        ],

      });

    }

  }

);



// =====================================================

// 🎵 RHYMING WORDS

// =====================================================



// Large controlled question bank.

// Each question has:

// - one target word

// - one correct rhyming word

// - three wrong options

// - emoji

//

// Questions are shuffled into a rotation.

// A question will NOT repeat until the whole rotation

// has been completed.

// =====================================================



const rhymingQuestionBank = [

  {

    word: "Cat",

    emoji: "🐱",

    answer: "Hat",

    options: ["Hat", "Dog", "Sun", "Book"],

  },

  {

    word: "Dog",

    emoji: "🐶",

    answer: "Log",

    options: ["Log", "Fish", "Moon", "Cup"],

  },

  {

    word: "Sun",

    emoji: "☀️",

    answer: "Fun",

    options: ["Fun", "Tree", "Dog", "Ball"],

  },

  {

    word: "Ball",

    emoji: "⚽",

    answer: "Tall",

    options: ["Tall", "Fish", "Moon", "Cake"],

  },

  {

    word: "Fish",

    emoji: "🐟",

    answer: "Dish",

    options: ["Dish", "Tree", "Sun", "Car"],

  },

  {

    word: "Book",

    emoji: "📖",

    answer: "Cook",

    options: ["Cook", "Dog", "Rain", "Star"],

  },

  {

    word: "Car",

    emoji: "🚗",

    answer: "Star",

    options: ["Star", "Fish", "Dog", "Tree"],

  },

  {

    word: "Rain",

    emoji: "🌧️",

    answer: "Train",

    options: ["Train", "Ball", "Fish", "Cake"],

  },

  {

    word: "Cake",

    emoji: "🍰",

    answer: "Lake",

    options: ["Lake", "Dog", "Tree", "Book"],

  },

  {

    word: "Lake",

    emoji: "🏞️",

    answer: "Cake",

    options: ["Cake", "Fish", "Moon", "Sun"],

  },

  {

    word: "Moon",

    emoji: "🌙",

    answer: "Tune",

    options: ["Tune", "Cat", "Dog", "Tree"],

  },

  {

    word: "Tune",

    emoji: "🎵",

    answer: "Moon",

    options: ["Moon", "Cat", "Book", "Sun"],

  },

  {

    word: "Bee",

    emoji: "🐝",

    answer: "Tree",

    options: ["Tree", "Dog", "Cup", "Rain"],

  },

  {

    word: "Tree",

    emoji: "🌳",

    answer: "Bee",

    options: ["Bee", "Cat", "Book", "Sun"],

  },

  {

    word: "Boat",

    emoji: "⛵",

    answer: "Goat",

    options: ["Goat", "Cat", "Moon", "Book"],

  },

  {

    word: "Goat",

    emoji: "🐐",

    answer: "Boat",

    options: ["Boat", "Dog", "Rain", "Tree"],

  },

  {

    word: "Light",

    emoji: "💡",

    answer: "Night",

    options: ["Night", "Dog", "Cake", "Tree"],

  },

  {

    word: "Night",

    emoji: "🌙",

    answer: "Light",

    options: ["Light", "Fish", "Ball", "Cup"],

  },

  {

    word: "Day",

    emoji: "🌞",

    answer: "Play",

    options: ["Play", "Moon", "Dog", "Book"],

  },

  {

    word: "Play",

    emoji: "🎮",

    answer: "Day",

    options: ["Day", "Cat", "Fish", "Rain"],

  },

  {

    word: "Blue",

    emoji: "🔵",

    answer: "Glue",

    options: ["Glue", "Dog", "Tree", "Sun"],

  },

  {

    word: "Glue",

    emoji: "🧴",

    answer: "Blue",

    options: ["Blue", "Fish", "Moon", "Cake"],

  },

  {

    word: "Red",

    emoji: "🔴",

    answer: "Bed",

    options: ["Bed", "Cat", "Rain", "Book"],

  },

  {

    word: "Bed",

    emoji: "🛏️",

    answer: "Red",

    options: ["Red", "Dog", "Tree", "Ball"],

  },

  {

    word: "King",

    emoji: "👑",

    answer: "Ring",

    options: ["Ring", "Cat", "Sun", "Book"],

  },

  {

    word: "Ring",

    emoji: "💍",

    answer: "King",

    options: ["King", "Fish", "Moon", "Tree"],

  },

  {

    word: "Bell",

    emoji: "🔔",

    answer: "Shell",

    options: ["Shell", "Dog", "Sun", "Cake"],

  },

  {

    word: "Shell",

    emoji: "🐚",

    answer: "Bell",

    options: ["Bell", "Cat", "Rain", "Book"],

  },

  {

    word: "Chair",

    emoji: "🪑",

    answer: "Bear",

    options: ["Bear", "Fish", "Moon", "Tree"],

  },

  {

    word: "Bear",

    emoji: "🐻",

    answer: "Chair",

    options: ["Chair", "Dog", "Sun", "Cake"],

  },

  {

    word: "Mouse",

    emoji: "🐭",

    answer: "House",

    options: ["House", "Sun", "Fish", "Car"],

  },

  {

    word: "House",

    emoji: "🏠",

    answer: "Mouse",

    options: ["Mouse", "Tree", "Ball", "Book"],

  },

  {

    word: "Frog",

    emoji: "🐸",

    answer: "Log",

    options: ["Log", "Cake", "Sun", "Fish"],

  },

  {

    word: "Fox",

    emoji: "🦊",

    answer: "Box",

    options: ["Box", "Rain", "Fish", "Moon"],

  },

  {

    word: "Box",

    emoji: "📦",

    answer: "Fox",

    options: ["Fox", "Cat", "Tree", "Cake"],

  },

  {

    word: "Pig",

    emoji: "🐷",

    answer: "Wig",

    options: ["Wig", "Dog", "Tree", "Rain"],

  },

  {

    word: "Wig",

    emoji: "💇",

    answer: "Pig",

    options: ["Pig", "Cat", "Moon", "Book"],

  },

  {

    word: "Big",

    emoji: "🐘",

    answer: "Pig",

    options: ["Pig", "Dog", "Sun", "Book"],

  },

  {

    word: "Run",

    emoji: "🏃",

    answer: "Fun",

    options: ["Fun", "Dog", "Book", "Cat"],

  },

  {

    word: "Fun",

    emoji: "🎉",

    answer: "Run",

    options: ["Run", "Fish", "Tree", "Moon"],

  },

  {

    word: "Hop",

    emoji: "🐰",

    answer: "Mop",

    options: ["Mop", "Cat", "Sun", "Tree"],

  },

  {

    word: "Mop",

    emoji: "🧹",

    answer: "Hop",

    options: ["Hop", "Dog", "Moon", "Cake"],

  },

  {

    word: "Top",

    emoji: "🔝",

    answer: "Pop",

    options: ["Pop", "Fish", "Cat", "Rain"],

  },

  {

    word: "Pop",

    emoji: "🍭",

    answer: "Top",

    options: ["Top", "Dog", "Tree", "Book"],

  },

  {

    word: "Man",

    emoji: "👨",

    answer: "Van",

    options: ["Van", "Fish", "Moon", "Cake"],

  },

  {

    word: "Van",

    emoji: "🚐",

    answer: "Man",

    options: ["Man", "Cat", "Rain", "Book"],

  },

  {

    word: "Star",

    emoji: "⭐",

    answer: "Jar",

    options: ["Jar", "Fish", "Dog", "Tree"],

  },

  {

    word: "Jar",

    emoji: "🫙",

    answer: "Star",

    options: ["Star", "Cat", "Moon", "Book"],

  },

  {

    word: "Way",

    emoji: "🛣️",

    answer: "Day",

    options: ["Day", "Dog", "Book", "Rain"],

  },

  {

    word: "Snow",

    emoji: "❄️",

    answer: "Go",

    options: ["Go", "Dog", "Tree", "Sun"],

  },

  {

    word: "Go",

    emoji: "➡️",

    answer: "Snow",

    options: ["Snow", "Cat", "Fish", "Book"],

  },

  {

    word: "Fox",

    emoji: "🦊",

    answer: "Socks",

    options: ["Socks", "Dog", "Rain", "Tree"],

  },

  {

    word: "Socks",

    emoji: "🧦",

    answer: "Fox",

    options: ["Fox", "Cat", "Sun", "Book"],

  },

  {

    word: "Bell",

    emoji: "🔔",

    answer: "Shell",

    options: ["Shell", "Dog", "Tree", "Moon"],

  },

  {

    word: "Cake",

    emoji: "🎂",

    answer: "Snake",

    options: ["Snake", "Moon", "Dog", "Book"],

  },

  {

    word: "Snake",

    emoji: "🐍",

    answer: "Cake",

    options: ["Cake", "Fish", "Tree", "Sun"],

  },

  {

    word: "Plane",

    emoji: "✈️",

    answer: "Train",

    options: ["Train", "Dog", "Cat", "Book"],

  },

  {

    word: "Train",

    emoji: "🚂",

    answer: "Rain",

    options: ["Rain", "Fish", "Tree", "Ball"],

  },

  {

    word: "Park",

    emoji: "🌳",

    answer: "Shark",

    options: ["Shark", "Dog", "Moon", "Book"],

  },

  {

    word: "Shark",

    emoji: "🦈",

    answer: "Park",

    options: ["Park", "Cat", "Rain", "Tree"],

  },

  {

    word: "Fox",

    emoji: "🦊",

    answer: "Box",

    options: ["Box", "Sun", "Tree", "Fish"],

  },

  {

    word: "Mail",

    emoji: "✉️",

    answer: "Sail",

    options: ["Sail", "Dog", "Moon", "Book"],

  },

  {

    word: "Sail",

    emoji: "⛵",

    answer: "Mail",

    options: ["Mail", "Cat", "Fish", "Tree"],

  },

  {

    word: "Feet",

    emoji: "🦶",

    answer: "Meet",

    options: ["Meet", "Dog", "Sun", "Book"],

  },

  {

    word: "Meet",

    emoji: "🤝",

    answer: "Feet",

    options: ["Feet", "Cat", "Rain", "Moon"],

  },

  {

    word: "Cake",

    emoji: "🍰",

    answer: "Snake",

    options: ["Snake", "Dog", "Tree", "Ball"],

  },

  {

    word: "Blue",

    emoji: "🔵",

    answer: "Glue",

    options: ["Glue", "Cat", "Fish", "Rain"],

  },

];





// =====================================================

// 🔀 SHUFFLE

// =====================================================



function shuffleRhymingQuestions(array) {

  const shuffled = [...array];



  for (let i = shuffled.length - 1; i > 0; i--) {

    const j = Math.floor(

      Math.random() * (i + 1)

    );



    [shuffled[i], shuffled[j]] = [

      shuffled[j],

      shuffled[i],

    ];

  }



  return shuffled;

}





// =====================================================

// 🎯 RHYMING ROTATION

// =====================================================



// Current shuffled question list

let rhymingRotation = [];



// Current position

let rhymingIndex = 0;





// =====================================================

// 🔄 CREATE NEW ROTATION

// =====================================================



function createRhymingRotation() {

  rhymingRotation =

    shuffleRhymingQuestions(

      rhymingQuestionBank

    );



  rhymingIndex = 0;



  console.log(

    `🎵 New rhyming rotation created: ${rhymingRotation.length} questions`

  );

}





// Create first rotation when backend starts

createRhymingRotation();





// =====================================================

// 🎵 GENERATE RHYMING QUESTION

// =====================================================



app.post(

  "/api/generate-rhyming",

  async (req, res) => {

    try {



      // -------------------------------------------------

      // If all questions were already used,

      // create a completely new shuffled rotation.

      // -------------------------------------------------



      if (

        rhymingIndex >=

        rhymingRotation.length

      ) {

        console.log(

          "🔄 All rhyming questions used."

        );



        console.log(

          "🎲 Creating a new shuffled rotation..."

        );



        createRhymingRotation();

      }





      // -------------------------------------------------

      // Get next question

      // -------------------------------------------------



      const question =

        rhymingRotation[

        rhymingIndex

        ];





      // Move to next position

      rhymingIndex++;





      // -------------------------------------------------

      // Shuffle answer options

      // -------------------------------------------------



      const shuffledOptions =

        shuffleRhymingQuestions(

          question.options

        );





      // -------------------------------------------------

      // Console information

      // -------------------------------------------------



      console.log(

        `🎵 Rhyming Question ${rhymingIndex}/${rhymingRotation.length}`

      );



      console.log(

        `👉 ${question.word} → ${question.answer}`

      );





      // -------------------------------------------------

      // Send response

      // -------------------------------------------------



      return res.json({

        success: true,



        word: question.word,



        emoji: question.emoji,



        answer: question.answer,



        options: shuffledOptions,

      });



    } catch (error) {



      console.error(

        "❌ RHYMING ERROR:",

        error

      );





      // -------------------------------------------------

      // Safe fallback

      // -------------------------------------------------



      return res.status(500).json({

        success: false,



        message:

          "Failed to generate rhyming question",



        word: "Cat",



        emoji: "🐱",



        answer: "Hat",



        options: [

          "Hat",

          "Dog",

          "Sun",

          "Book",

        ],

      });

    }

  }

);



// =====================================================

// BLEND WORD

// =====================================================



app.post(

  "/api/generate-blend",

  async (req, res) => {

    try {

      const words = [

        "cat",

        "dog",

        "pen",

        "sun",

        "bat",

        "cup",

        "hat",

      ];



      let word;



      do {

        word =

          words[

          Math.floor(

            Math.random() *

            words.length

          )

          ];

      } while (

        word === lastBlendWord &&

        words.length > 1

      );



      lastBlendWord = word;



      const sounds =

        word.split("");



      const wrong = words

        .filter(

          (item) => item !== word

        )

        .sort(

          () => 0.5 - Math.random()

        )

        .slice(0, 2);



      const options = [

        word,

        ...wrong,

      ].sort(

        () => 0.5 - Math.random()

      );



      return res.json({

        sounds,

        options,

        answer: word,

      });

    } catch (error) {

      console.error(error);



      return res.json({

        sounds: [

          "c",

          "a",

          "t",

        ],

        options: [

          "cat",

          "cap",

          "can",

        ],

        answer: "cat",

      });

    }

  }

);



// =====================================================

// BREAK WORD

// =====================================================



app.post(

  "/api/generate-break-word",

  async (req, res) => {

    try {

      const words = [

        "cat",

        "dog",

        "sun",

        "pen",

        "bat",

        "cup",

        "hat",

      ];



      let word;



      do {

        word =

          words[

          Math.floor(

            Math.random() *

            words.length

          )

          ];

      } while (

        word === lastBreakWord &&

        words.length > 1

      );



      lastBreakWord = word;



      const correct =

        word

          .split("")

          .join(" - ");



      const wrong = [

        word.slice(0, 2) +

        " - " +

        word.slice(2),



        word[0] +

        " - " +

        word.slice(1),



        word,

      ];



      const options = [

        correct,

        ...wrong,

      ].sort(

        () => 0.5 - Math.random()

      );



      return res.json({

        word: word.toUpperCase(),

        answer: correct,

        options,

      });

    } catch (error) {

      console.error(error);



      return res.json({

        word: "CAT",

        answer: "c - a - t",

        options: [

          "c - a - t",

          "ca - t",

          "c - at",

          "cat",

        ],

      });

    }

  }

);



// =====================================================

// BUILD WORD

// =====================================================



app.post(

  "/api/generate-build-word",

  async (req, res) => {

    try {

      const words = [

        "cat",

        "dog",

        "sun",

        "pen",

        "bat",

        "cup",

      ];



      let word;



      do {

        word =

          words[

          Math.floor(

            Math.random() *

            words.length

          )

          ];

      } while (

        word === lastBuildWord &&

        words.length > 1

      );



      lastBuildWord = word;



      const missingIndex =

        Math.floor(

          Math.random() *

          word.length

        );



      const correctLetter =

        word[missingIndex];



      const letters =

        "abcdefghijklmnopqrstuvwxyz".split("");



      const wrong = letters

        .filter(

          (letter) =>

            letter !==

            correctLetter

        )

        .sort(

          () => 0.5 - Math.random()

        )

        .slice(0, 3);



      const options = [

        correctLetter,

        ...wrong,

      ].sort(

        () => 0.5 - Math.random()

      );



      const displayWord =

        word

          .split("")

          .map(

            (letter, index) =>

              index === missingIndex

                ? "_"

                : letter

          )

          .join(" ");



      return res.json({

        word: word.toUpperCase(),

        display: displayWord,

        answer: correctLetter,

        options,

      });

    } catch (error) {

      console.error(error);



      return res.json({

        word: "CAT",

        display: "_ A T",

        answer: "c",

        options: [

          "c",

          "b",

          "m",

          "s",

        ],

      });

    }

  }

);



// =====================================================

// MISSING LETTER

// =====================================================



app.post(

  "/api/generate-missing-letter",

  async (req, res) => {

    try {

      const words = [

        "cat",

        "dog",

        "sun",

        "pen",

        "bat",

        "cup",

        "hat",

      ];



      let word;



      do {

        word =

          words[

          Math.floor(

            Math.random() *

            words.length

          )

          ];

      } while (

        word === lastMissingWord &&

        words.length > 1

      );



      lastMissingWord = word;



      const missingIndex =

        Math.floor(

          Math.random() *

          word.length

        );



      const correctLetter =

        word[missingIndex];



      const letters =

        "abcdefghijklmnopqrstuvwxyz".split("");



      const wrong = letters

        .filter(

          (letter) =>

            letter !==

            correctLetter

        )

        .sort(

          () => 0.5 - Math.random()

        )

        .slice(0, 3);



      const options = [

        correctLetter,

        ...wrong,

      ].sort(

        () => 0.5 - Math.random()

      );



      const display =

        word

          .split("")

          .map(

            (letter, index) =>

              index === missingIndex

                ? "_"

                : letter.toUpperCase()

          )

          .join(" ");



      return res.json({

        display,

        answer: correctLetter,

        options,

      });

    } catch (error) {

      console.error(error);



      return res.json({

        display: "C _ T",

        answer: "a",

        options: [

          "a",

          "e",

          "i",

          "o",

        ],

      });

    }

  }

);



// =====================================================

// SIGHT WORD

// =====================================================



app.post(

  "/api/generate-sight-word",

  async (req, res) => {

    try {

      const words = [

        {

          word: "cat",

          emoji: "🐱",

        },

        {

          word: "dog",

          emoji: "🐶",

        },

        {

          word: "sun",

          emoji: "☀️",

        },

        {

          word: "pen",

          emoji: "✏️",

        },

        {

          word: "ball",

          emoji: "⚽",

        },

        {

          word: "book",

          emoji: "📘",

        },

      ];



      let correct;



      do {

        correct =

          words[

          Math.floor(

            Math.random() *

            words.length

          )

          ];

      } while (

        correct.word ===

        lastSightWord &&

        words.length > 1

      );



      lastSightWord =

        correct.word;



      const wrong = words

        .filter(

          (word) =>

            word.word !==

            correct.word

        )

        .sort(

          () => 0.5 - Math.random()

        )

        .slice(0, 3);



      const options = [

        correct,

        ...wrong,

      ].sort(

        () => 0.5 - Math.random()

      );



      return res.json({

        emoji: correct.emoji,

        answer: correct.word,

        options: options.map(

          (item) => item.word

        ),

      });

    } catch (error) {

      console.error(error);



      return res.json({

        emoji: "🐱",

        answer: "cat",

        options: [

          "cat",

          "dog",

          "sun",

          "pen",

        ],

      });

    }

  }

);



// =====================================================

// SCRAMBLE

// =====================================================



app.post(

  "/api/generate-scramble",

  async (req, res) => {

    try {

      const words = [

        "cat",

        "dog",

        "sun",

        "pen",

        "bat",

        "cup",

        "hat",

      ];



      let word;



      do {

        word =

          words[

          Math.floor(

            Math.random() *

            words.length

          )

          ];

      } while (

        word === lastScrambleWord &&

        words.length > 1

      );



      lastScrambleWord = word;



      let scrambled;



      do {

        scrambled =

          word

            .split("")

            .sort(

              () => 0.5 - Math.random()

            )

            .join("")

            .toUpperCase();

      } while (

        scrambled.toLowerCase() ===

        word &&

        word.length > 1

      );



      const wrong = words

        .filter(

          (item) => item !== word

        )

        .sort(

          () => 0.5 - Math.random()

        )

        .slice(0, 3);



      const options = [

        word,

        ...wrong,

      ].sort(

        () => 0.5 - Math.random()

      );



      return res.json({

        scrambled,

        answer: word,

        options,

      });

    } catch (error) {

      console.error(error);



      return res.json({

        scrambled: "TAC",

        answer: "cat",

        options: [

          "cat",

          "act",

          "cut",

          "bat",

        ],

      });

    }

  }

);



// =====================================================

// SENTENCE

// =====================================================



app.post(

  "/api/generate-sentence",

  async (req, res) => {

    try {

      const sentences = [

        "the cat is",

        "I like apples",

        "she is happy",

        "he is running",

        "we play games",

        "this is fun",

      ];



      let correct;



      do {

        correct =

          sentences[

          Math.floor(

            Math.random() *

            sentences.length

          )

          ];

      } while (

        correct === lastSentence &&

        sentences.length > 1

      );



      lastSentence = correct;



      const words =

        correct.split(" ");



      const shuffled =

        [...words].sort(

          () => 0.5 - Math.random()

        );



      const wrong = sentences

        .filter(

          (sentence) =>

            sentence !== correct

        )

        .sort(

          () => 0.5 - Math.random()

        )

        .slice(0, 2);



      const options = [

        correct,

        ...wrong,

      ].sort(

        () => 0.5 - Math.random()

      );



      return res.json({

        shuffled,

        answer: correct,

        options,

      });

    } catch (error) {

      console.error(error);



      return res.json({

        shuffled: [

          "the",

          "cat",

          "is",

        ],

        answer: "the cat is",

        options: [

          "the cat is",

          "cat is the",

          "is the cat",

        ],

      });

    }

  }

);



// =====================================================

// MATCH IMAGE

// =====================================================



app.post(

  "/api/generate-match-image",

  async (req, res) => {

    try {

      const data = [

        {

          word: "Dog",

          emoji: "🐶",

        },

        {

          word: "Cat",

          emoji: "🐱",

        },

        {

          word: "Apple",

          emoji: "🍎",

        },

        {

          word: "Ball",

          emoji: "⚽",

        },

        {

          word: "Car",

          emoji: "🚗",

        },

        {

          word: "Fish",

          emoji: "🐟",

        },

      ];



      let correct;



      do {

        correct =

          data[

          Math.floor(

            Math.random() *

            data.length

          )

          ];

      } while (

        correct.word ===

        lastImageWord &&

        data.length > 1

      );



      lastImageWord =

        correct.word;



      const wrong = data

        .filter(

          (item) =>

            item.word !==

            correct.word

        )

        .sort(

          () => 0.5 - Math.random()

        )

        .slice(0, 3);



      const options = [

        correct,

        ...wrong,

      ].sort(

        () => 0.5 - Math.random()

      );



      return res.json({

        word: correct.word,

        options,

      });

    } catch (error) {

      console.error(error);



      return res.json({

        word: "Dog",

        options: [

          {

            word: "Dog",

            emoji: "🐶",

          },

          {

            word: "Cat",

            emoji: "🐱",

          },

          {

            word: "Ball",

            emoji: "⚽",

          },

          {

            word: "Fish",

            emoji: "🐟",

          },

        ],

      });

    }

  }

);



// =====================================================

// HEALTH CHECK

// =====================================================



app.get("/api/health", async (req, res) => {

  let firebaseStatus = "connected";



  try {

    await firebaseAuth.listUsers(1);

  } catch (error) {

    firebaseStatus = "error";

  }



  return res.json({

    success: true,

    server: "running",

    firebase: firebaseStatus,

    gemini: model

      ? "connected"

      : "not configured",

    time: new Date().toISOString(),

  });

});



// =====================================================

// ERROR HANDLER

// =====================================================



app.use(

  (err, req, res, next) => {

    console.error(

      "❌ SERVER ERROR:",

      err

    );



    res.status(500).json({

      success: false,

      message:

        "Internal server error ❌",

    });

  }

);



// =====================================================

// START SERVER

// =====================================================



const PORT =

  process.env.PORT || 5000;



app.listen(PORT, () => {

  console.log("");

  console.log(

    "===================================="

  );

  console.log("🌴 CURIOKIDS BACKEND");

  console.log(

    "===================================="

  );

  console.log(

    `🚀 Server running on port ${PORT}`

  );

  console.log(

    `🌐 http://localhost:${PORT}`

  );

  console.log(

    "🔥 Firebase Admin: READY"

  );

  console.log(

    `🤖 Gemini: ${model ? "READY" : "NOT CONFIGURED"

    }`

  );

  console.log(

    "===================================="

  );

  console.log("");

});