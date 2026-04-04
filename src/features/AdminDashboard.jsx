import { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp
} from "firebase/firestore";

export default function AdminDashboard() {
  const [email, setEmail] = useState("");
  const [users, setUsers] = useState([]);

  // 🎮 NEW GAME STATES
  const [gameName, setGameName] = useState("");
  const [topic, setTopic] = useState("");
  const [level, setLevel] = useState("easy");
  const [type, setType] = useState("mcq");

  const [games, setGames] = useState([]);

  // 📥 Load users
  useEffect(() => {
    fetchUsers();
    fetchGames();
  }, []);

  const fetchUsers = async () => {
    const snap = await getDocs(collection(db, "users"));
    setUsers(snap.docs.map(doc => doc.data()));
  };

  // 🎮 Load games
  const fetchGames = async () => {
    const snap = await getDocs(collection(db, "games"));
    setGames(snap.docs.map(doc => doc.data()));
  };

  // 🎮 ADD GAME
  const addGame = async () => {
    if (!gameName || !topic) {
      alert("Fill all fields!");
      return;
    }

    await addDoc(collection(db, "games"), {
      name: gameName,
      topic: topic,
      level: level,
      type: type,
      createdAt: serverTimestamp()
    });

    alert("Game Added 🚀");

    setGameName("");
    setTopic("");

    fetchGames();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>🧑‍💼 Admin Dashboard</h1>

      {/* 🎮 ADD GAME */}
      <h2>🎮 Add Game</h2>

      <input
        placeholder="Game Name"
        value={gameName}
        onChange={(e) => setGameName(e.target.value)}
      />

      <input
        placeholder="AI Topic (ex: jungle animals)"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
      />

      <select value={level} onChange={(e) => setLevel(e.target.value)}>
        <option>easy</option>
        <option>medium</option>
        <option>hard</option>
      </select>

      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="mcq">MCQ</option>
        <option value="sound">Sound</option>
        <option value="pattern">Pattern</option>
      </select>

      <button onClick={addGame}>Add Game ➕</button>

      {/* 📊 GAMES LIST */}
      <h2>📚 All Games</h2>
      {games.map((g, i) => (
        <div key={i} style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
          <b>{g.name}</b>
          <p>Topic: {g.topic}</p>
          <p>Level: {g.level}</p>
          <p>Type: {g.type}</p>
        </div>
      ))}

      {/* 👥 USERS */}
      <h2>📊 All Users</h2>
      {users.map((u, i) => (
        <div key={i}>
          {u.email} — {u.score}
        </div>
      ))}
    </div>
  );
}