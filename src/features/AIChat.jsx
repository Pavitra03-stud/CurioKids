import { useState } from "react";
import "../styles/AIChat.css";

export default function AIChat({ childId }) {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!question.trim()) return;

    const userMessage = { type: "user", text: question };
    setMessages(prev => [...prev, userMessage]);

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          childId,
          question,
        }),
      });

      const data = await res.json();

      const botMessage = {
        type: "bot",
        text: data.answer,
      };

      setMessages(prev => [...prev, botMessage]);
      setQuestion("");

    } catch (err) {
      console.log(err);
    }

    setLoading(false);
  };

  return (
    <div className="chat-container">
      <h2>🤖 AI Assistant</h2>

      <div className="chat-box">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={msg.type === "user" ? "user-msg" : "bot-msg"}
          >
            {msg.text}
          </div>
        ))}

        {loading && <p className="bot-msg">Typing...</p>}
      </div>

      <div className="chat-input">
        <input
          type="text"
          placeholder="Ask about your child..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />

        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}