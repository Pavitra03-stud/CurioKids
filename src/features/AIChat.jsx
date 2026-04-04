import { useState, useRef, useEffect } from "react";
import { chat } from "../services/aiEngine";
import "../styles/AIChat.css";

export default function AIChat({ goBack }) {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [allChats, setAllChats] = useState([]);
  const [currentChatIndex, setCurrentChatIndex] = useState(null);

  const chatEndRef = useRef(null);

  // 📥 LOAD SAVED CHATS
  useEffect(() => {
    const saved = localStorage.getItem("allChats");
    if (saved) {
      setAllChats(JSON.parse(saved));
    }
  }, []);

  // 💾 SAVE CHATS
  useEffect(() => {
    localStorage.setItem("allChats", JSON.stringify(allChats));
  }, [allChats]);

  // 🔽 AUTO SCROLL
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, loading]);

  // 🆕 NEW CHAT
  const startNewChat = () => {
    if (chatHistory.length > 0) {
      const updated = [...allChats, chatHistory];
      setAllChats(updated);
    }
    setChatHistory([]);
    setCurrentChatIndex(null);
  };

  // 📂 LOAD CHAT
  const loadChat = (index) => {
    setChatHistory(allChats[index]);
    setCurrentChatIndex(index);
  };

  // 📤 SEND MESSAGE
  const sendMessage = async () => {
    if (!message.trim() || loading) return;

    const newChat = [...chatHistory, { sender: "user", text: message }];
    setChatHistory(newChat);
    setLoading(true);

    try {
      const reply = await chat(message);

      const updatedChat = [
        ...newChat,
        { sender: "ai", text: reply }
      ];

      setChatHistory(updatedChat);

      let updatedChats = [...allChats];

      if (currentChatIndex !== null) {
        updatedChats[currentChatIndex] = updatedChat;
      } else {
        updatedChats.push(updatedChat);
        setCurrentChatIndex(updatedChats.length - 1);
      }

      setAllChats(updatedChats);
    } catch {
      setChatHistory([
        ...newChat,
        { sender: "ai", text: "⚠️ AI failed." }
      ]);
    }

    setMessage("");
    setLoading(false);
  };

  return (
    <div className="app-container">

      {/* 📁 SIDEBAR */}
      <div className="sidebar">
        <h3>🤖 Jungle AI</h3>

        <button className="new-chat" onClick={startNewChat}>
          + New Chat
        </button>

        <div className="chat-list">
          {allChats.map((chat, i) => (
            <div
              key={i}
              className="chat-item"
              onClick={() => loadChat(i)}
            >
              Chat {i + 1}
            </div>
          ))}
        </div>
      </div>

      {/* 💬 CHAT AREA */}
      <div className="chat-section">

        {/* 🔙 BACK BUTTON (FIXED) */}
        <button className="back-btn" onClick={goBack}>
          ←
        </button>

        <div className="chat-header">
          Jungle AI Chat
        </div>

        <div className="chat-box">
          {chatHistory.map((msg, i) => (
            <div
              key={i}
              className={`msg-row ${
                msg.sender === "user" ? "right" : "left"
              }`}
            >
              <div className="msg">{msg.text}</div>
            </div>
          ))}

          {loading && <div className="typing">🤖 Typing...</div>}

          <div ref={chatEndRef} />
        </div>

        {/* 📝 INPUT */}
        <div className="chat-input">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button onClick={sendMessage}>Send</button>
        </div>

      </div>

      {/* 🤖 FLOATING BOT */}
      <div className="bot-float">🤖</div>

    </div>
  );
}