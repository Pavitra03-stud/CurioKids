import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

console.log("🔥 SERVER STARTED");

// ================= EMAIL =================
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ================= OTP =================
const otpStore = {};

// ================= GEMINI =================
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

// ================= MEMORY =================
let lastTarget = "";
let lastWord = "";

// ================= ROOT =================
app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

// ================= REGISTER =================
app.post("/api/register", (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: "Missing fields" });
  }

  res.json({ success: true });
});

// ================= SEND OTP =================
app.post("/api/send-otp", async (req, res) => {
  try {
    const { email } = req.body;

    const otp = Math.floor(100000 + Math.random() * 900000);
    otpStore[email] = otp;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP",
      html: `<h2>${otp}</h2>`,
    });

    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Email failed" });
  }
});

// ================= VERIFY OTP =================
app.post("/api/verify-otp", (req, res) => {
  const { email, otp } = req.body;

  if (otpStore[email] == otp) {
    delete otpStore[email];
    return res.json({ success: true });
  }

  res.status(400).json({ message: "Invalid OTP" });
});

// ================= AI TEACH =================
app.post("/ai/teach", async (req, res) => {
  try {
    const { topic } = req.body;

    const prompt = `Explain ${topic} to a small kid in jungle theme in 2 lines`;

    const response = await model.generateContent(prompt);

    res.json({
      explanation: response.response.text(),
    });

  } catch (err) {
    console.error("TEACH ERROR:", err);

    res.json({
      explanation:
        "🌿 In the jungle, animals make sounds. Listen carefully!",
    });
  }
});

// ================= AI SOUND TAP =================
app.post("/ai/generate-question", async (req, res) => {
  try {
    const animals = ["🐵 Monkey", "🦁 Lion", "🐘 Elephant", "🐦 Bird"];
    const animal = animals[Math.floor(Math.random() * animals.length)];
    const count = Math.floor(Math.random() * 4) + 1;

    res.json({
      question: `${animal} made sound ${count} times. How many sounds did you hear?`,
      options: ["1", "2", "3", "4"],
      answer: String(count),
    });

  } catch (err) {
    console.error("QUESTION ERROR:", err);

    res.json({
      question: "🐵 Monkey made 2 sounds. How many?",
      options: ["1", "2", "3", "4"],
      answer: "2",
    });
  }
});

// ================= 🤖 CONFUSING LETTER =================
app.post("/api/generate-confusing-letter", async (req, res) => {
  try {
    const sets = [
      ["b", "d", "p", "q"],
      ["m", "n", "u", "v"],
      ["c", "k", "g", "j", "s", "z"]
    ];

    const set = sets[Math.floor(Math.random() * sets.length)];

    let target = set[Math.floor(Math.random() * set.length)];

    if (target === lastTarget) {
      target = set[Math.floor(Math.random() * set.length)];
    }

    lastTarget = target;

    const options = [...set, ...set]
      .sort(() => 0.5 - Math.random())
      .slice(0, 8);

    res.json({ target, options });

  } catch (err) {
    console.error("AI ERROR:", err);

    res.json({
      target: "b",
      options: ["b","d","p","q","b","d","p","q"]
    });
  }
});

// ================= 🤖 BEGINNING SOUND =================
app.post("/api/generate-beginning-sound", async (req, res) => {
  try {

    const words = [
      { word: "Dog", sound: "D", emoji: "🐶" },
      { word: "Cat", sound: "C", emoji: "🐱" },
      { word: "Ball", sound: "B", emoji: "⚽" },
      { word: "Monkey", sound: "M", emoji: "🐵" },
      { word: "Fish", sound: "F", emoji: "🐟" },
      { word: "Sun", sound: "S", emoji: "☀️" },
      { word: "Lion", sound: "L", emoji: "🦁" },
      { word: "Apple", sound: "A", emoji: "🍎" }
    ];

    let randomWord = words[Math.floor(Math.random() * words.length)];

    // 🔥 prevent repeat
    if (randomWord.word === lastWord) {
      randomWord = words[Math.floor(Math.random() * words.length)];
    }

    lastWord = randomWord.word;

    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

    const wrong = letters
      .filter((l) => l !== randomWord.sound)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);

    const options = [...wrong, randomWord.sound].sort(
      () => 0.5 - Math.random()
    );

    res.json({
      word: randomWord.word,
      sound: randomWord.sound,
      emoji: randomWord.emoji,
      options
    });

  } catch (err) {
    console.error(err);

    res.json({
      word: "Dog",
      sound: "D",
      emoji: "🐶",
      options: ["D","B","M","S"]
    });
  }
});


let lastEndingWord = "";

app.post("/api/generate-ending-sound", async (req, res) => {
  try {
    const words = [
      { word: "Dog", sound: "G", emoji: "🐶" },
      { word: "Cat", sound: "T", emoji: "🐱" },
      { word: "Ball", sound: "L", emoji: "⚽" },
      { word: "Fish", sound: "H", emoji: "🐟" },
      { word: "Sun", sound: "N", emoji: "☀️" },
      { word: "Book", sound: "K", emoji: "📘" },
      { word: "Hat", sound: "T", emoji: "🎩" },
      { word: "Cup", sound: "P", emoji: "☕" }
    ];

    let randomWord;

    // 🔥 LOOP UNTIL DIFFERENT
    do {
      randomWord = words[Math.floor(Math.random() * words.length)];
    } while (randomWord.word === lastEndingWord);

    lastEndingWord = randomWord.word;

    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

    const wrong = letters
      .filter((l) => l !== randomWord.sound)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);

    const options = [...wrong, randomWord.sound].sort(
      () => 0.5 - Math.random()
    );

    console.log("NEW WORD:", randomWord.word); // 🔥 debug

    res.json({
      word: randomWord.word,
      sound: randomWord.sound,
      emoji: randomWord.emoji,
      options
    });

  } catch (err) {
    console.error(err);

    res.json({
      word: "Dog",
      sound: "G",
      emoji: "🐶",
      options: ["G","D","M","S"]
    });
  }
});

let lastSoundWord = "";

app.post("/api/generate-sound-matching", async (req, res) => {
  try {
    const words = [
      { word: "Ball", sound: "B", emoji: "⚽" },
      { word: "Cat", sound: "C", emoji: "🐱" },
      { word: "Dog", sound: "D", emoji: "🐶" },
      { word: "Sun", sound: "S", emoji: "☀️" },
      { word: "Fish", sound: "F", emoji: "🐟" },
      { word: "Hat", sound: "H", emoji: "🎩" },
      { word: "Book", sound: "B", emoji: "📘" },
      { word: "Cup", sound: "C", emoji: "☕" }
    ];

    let correct;

    // 🔥 prevent repeat
    do {
      correct = words[Math.floor(Math.random() * words.length)];
    } while (correct.word === lastSoundWord);

    lastSoundWord = correct.word;

    const wrong = words
      .filter(w => w.sound !== correct.sound)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);

    const options = [correct, ...wrong].sort(() => 0.5 - Math.random());

    res.json({
      sound: correct.sound,
      options
    });

  } catch (err) {
    console.error(err);

    res.json({
      sound: "B",
      options: [
        { word: "Ball", sound: "B", emoji: "⚽" },
        { word: "Cat", sound: "C", emoji: "🐱" },
        { word: "Dog", sound: "D", emoji: "🐶" },
        { word: "Sun", sound: "S", emoji: "☀️" }
      ]
    });
  }
});

let lastRhymeWord = "";

app.post("/api/generate-rhyming", async (req, res) => {
  try {
    const words = [
      { word: "Cat", rhyme: "Hat", emoji: "🐱" },
      { word: "Dog", rhyme: "Log", emoji: "🐶" },
      { word: "Sun", rhyme: "Fun", emoji: "☀️" },
      { word: "Ball", rhyme: "Tall", emoji: "⚽" },
      { word: "Fish", rhyme: "Dish", emoji: "🐟" },
      { word: "Book", rhyme: "Cook", emoji: "📘" },
      { word: "Car", rhyme: "Star", emoji: "🚗" }
    ];

    let correct;

    // 🔥 prevent repeat
    do {
      correct = words[Math.floor(Math.random() * words.length)];
    } while (correct.word === lastRhymeWord);

    lastRhymeWord = correct.word;

    const wrong = words
      .map(item => item.rhyme)
      .filter(r => r !== correct.rhyme)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);

    const options = [correct.rhyme, ...wrong].sort(() => 0.5 - Math.random());

    res.json({
      word: correct.word,
      emoji: correct.emoji,
      answer: correct.rhyme,
      options
    });

  } catch (err) {
    console.error(err);

    res.json({
      word: "Cat",
      emoji: "🐱",
      answer: "Hat",
      options: ["Hat","Log","Fun","Tall"]
    });
  }
});

let lastBlendWord = "";

app.post("/api/generate-blend", async (req, res) => {
  try {
    const words = ["cat", "dog", "pen", "sun", "bat", "cup", "hat"];

    let word;

    // 🔥 prevent repeat
    do {
      word = words[Math.floor(Math.random() * words.length)];
    } while (word === lastBlendWord);

    lastBlendWord = word;

    const sounds = word.split("");

    const wrong = words
      .filter(w => w !== word)
      .sort(() => 0.5 - Math.random())
      .slice(0, 2);

    const options = [word, ...wrong].sort(() => 0.5 - Math.random());

    res.json({
      sounds,
      options,
      answer: word
    });

  } catch (err) {
    console.error(err);

    res.json({
      sounds: ["c","a","t"],
      options: ["cat","cap","can"],
      answer: "cat"
    });
  }
});

let lastBreakWord = "";

app.post("/api/generate-break-word", async (req, res) => {
  try {
    const words = ["cat", "dog", "sun", "pen", "bat", "cup", "hat"];

    let word;

    // 🔥 prevent repeat
    do {
      word = words[Math.floor(Math.random() * words.length)];
    } while (word === lastBreakWord);

    lastBreakWord = word;

    const correct = word.split("").join(" - ");

    const wrong = [
      word.slice(0, 2) + " - " + word.slice(2),
      word[0] + " - " + word.slice(1),
      word
    ];

    const options = [correct, ...wrong].sort(() => 0.5 - Math.random());

    res.json({
      word: word.toUpperCase(),
      answer: correct,
      options
    });

  } catch (err) {
    console.error(err);

    res.json({
      word: "CAT",
      answer: "c - a - t",
      options: ["c - a - t","ca - t","c - at","cat"]
    });
  }
});
let lastBuildWord = "";

app.post("/api/generate-build-word", async (req, res) => {
  try {
    const words = ["cat", "dog", "sun", "pen", "bat", "cup"];

    let word;

    do {
      word = words[Math.floor(Math.random() * words.length)];
    } while (word === lastBuildWord);

    lastBuildWord = word;

    const missingIndex = Math.floor(Math.random() * word.length);

    const correctLetter = word[missingIndex];

    const letters = "abcdefghijklmnopqrstuvwxyz".split("");

    const wrong = letters
      .filter(l => l !== correctLetter)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);

    const options = [correctLetter, ...wrong].sort(() => 0.5 - Math.random());

    const displayWord = word
      .split("")
      .map((l, i) => (i === missingIndex ? "_" : l))
      .join(" ");

    res.json({
      word: word.toUpperCase(),
      display: displayWord,
      answer: correctLetter,
      options
    });

  } catch (err) {
    console.error(err);

    res.json({
      word: "CAT",
      display: "_ A T",
      answer: "c",
      options: ["c","b","m","s"]
    });
  }
});

let lastMissingWord = "";

app.post("/api/generate-missing-letter", async (req, res) => {
  try {
    const words = ["cat", "dog", "sun", "pen", "bat", "cup", "hat"];

    let word;

    // 🔥 prevent repeat
    do {
      word = words[Math.floor(Math.random() * words.length)];
    } while (word === lastMissingWord);

    lastMissingWord = word;

    const missingIndex = Math.floor(Math.random() * word.length);
    const correctLetter = word[missingIndex];

    const letters = "abcdefghijklmnopqrstuvwxyz".split("");

    const wrong = letters
      .filter(l => l !== correctLetter)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);

    const options = [correctLetter, ...wrong].sort(() => 0.5 - Math.random());

    const display = word
      .split("")
      .map((l, i) => (i === missingIndex ? "_" : l.toUpperCase()))
      .join(" ");

    res.json({
      display,
      answer: correctLetter,
      options
    });

  } catch (err) {
    console.error(err);

    res.json({
      display: "C _ T",
      answer: "a",
      options: ["a","e","i","o"]
    });
  }
});
let lastSightWord = "";

app.post("/api/generate-sight-word", async (req, res) => {
  try {
    const words = [
      { word: "cat", emoji: "🐱" },
      { word: "dog", emoji: "🐶" },
      { word: "sun", emoji: "☀️" },
      { word: "pen", emoji: "✏️" },
      { word: "ball", emoji: "⚽" },
      { word: "book", emoji: "📘" }
    ];

    let correct;

    // 🔥 prevent repeat
    do {
      correct = words[Math.floor(Math.random() * words.length)];
    } while (correct.word === lastSightWord);

    lastSightWord = correct.word;

    const wrong = words
      .filter(w => w.word !== correct.word)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);

    const options = [correct, ...wrong].sort(() => 0.5 - Math.random());

    res.json({
      emoji: correct.emoji,
      answer: correct.word,
      options: options.map(o => o.word)
    });

  } catch (err) {
    console.error(err);

    res.json({
      emoji: "🐱",
      answer: "cat",
      options: ["cat","dog","sun","pen"]
    });
  }
});
// ================= AI ANALYZE =================
app.post("/ai/analyze", (req, res) => {
  const { answers } = req.body;

  if (answers.correct) {
    return res.json({
      analysis: "🌟 Great job! You are learning fast!",
    });
  }

  res.json({
    analysis: "💡 Try again! Keep practicing!",
  });
});

let lastScrambleWord = "";

app.post("/api/generate-scramble", async (req, res) => {
  try {
    const words = ["cat", "dog", "sun", "pen", "bat", "cup", "hat"];

    let word;

    // 🔥 prevent repeat
    do {
      word = words[Math.floor(Math.random() * words.length)];
    } while (word === lastScrambleWord);

    lastScrambleWord = word;

    // 🔀 scramble word
    const scrambled = word
      .split("")
      .sort(() => 0.5 - Math.random())
      .join("")
      .toUpperCase();

    const wrong = words
      .filter(w => w !== word)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);

    const options = [word, ...wrong].sort(() => 0.5 - Math.random());

    res.json({
      scrambled,
      answer: word,
      options
    });

  } catch (err) {
    console.error(err);

    res.json({
      scrambled: "TAC",
      answer: "cat",
      options: ["cat","act","cut","bat"]
    });
  }
});
let lastSentence = "";

app.post("/api/generate-sentence", async (req, res) => {
  try {
    const sentences = [
      "the cat is",
      "I like apples",
      "she is happy",
      "he is running",
      "we play games",
      "this is fun"
    ];

    let correct;

    // 🔥 prevent repeat
    do {
      correct = sentences[Math.floor(Math.random() * sentences.length)];
    } while (correct === lastSentence);

    lastSentence = correct;

    // 🔀 shuffle words
    const words = correct.split(" ");
    const shuffled = [...words].sort(() => 0.5 - Math.random());

    // wrong options
    const wrong = sentences
      .filter(s => s !== correct)
      .sort(() => 0.5 - Math.random())
      .slice(0, 2);

    const options = [correct, ...wrong].sort(() => 0.5 - Math.random());

    res.json({
      shuffled,
      answer: correct,
      options
    });

  } catch (err) {
    console.error(err);

    res.json({
      shuffled: ["the","cat","is"],
      answer: "the cat is",
      options: ["the cat is","cat is the","is the cat"]
    });
  }
});

let lastImageWord = "";

app.post("/api/generate-match-image", async (req, res) => {
  try {
    const data = [
      { word: "Dog", emoji: "🐶" },
      { word: "Cat", emoji: "🐱" },
      { word: "Apple", emoji: "🍎" },
      { word: "Ball", emoji: "⚽" },
      { word: "Car", emoji: "🚗" },
      { word: "Fish", emoji: "🐟" }
    ];

    let correct;

    // 🔥 avoid repeat
    do {
      correct = data[Math.floor(Math.random() * data.length)];
    } while (correct.word === lastImageWord);

    lastImageWord = correct.word;

    const wrong = data
      .filter(d => d.word !== correct.word)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);

    const options = [correct, ...wrong].sort(() => 0.5 - Math.random());

    res.json({
      word: correct.word,
      options
    });

  } catch (err) {
    console.error(err);

    res.json({
      word: "Dog",
      options: [
        { word: "Dog", emoji: "🐶" },
        { word: "Cat", emoji: "🐱" },
        { word: "Ball", emoji: "⚽" },
        { word: "Fish", emoji: "🐟" }
      ]
    });
  }
});
// ================= START =================
app.listen(5000, () => {
  console.log("🚀 Server running on http://localhost:5000");
});