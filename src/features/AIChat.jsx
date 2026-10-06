import { useState, useRef, useEffect } from "react";
import "../styles/AIChat.css";

const WORKER_URL =
  "https://curiokids-worker.gvpavitraganesh.workers.dev/ai";

export default function AIChat() {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const [allChats, setAllChats] = useState([]);
  const [currentChatIndex, setCurrentChatIndex] = useState(null);

  const chatEndRef = useRef(null);

  // 📥 LOAD SAVED CHATS
  useEffect(() => {
    try {
      const saved = localStorage.getItem("allChats");

      if (saved) {
        const parsed = JSON.parse(saved);

        if (Array.isArray(parsed)) {
          setAllChats(parsed);

          if (parsed.length > 0) {
            setChatHistory(parsed[parsed.length - 1]);
            setCurrentChatIndex(parsed.length - 1);
          }
        }
      }
    } catch (error) {
      console.error("Error loading chats:", error);
      localStorage.removeItem("allChats");
    }
  }, []);

  // 💾 SAVE CHATS
  useEffect(() => {
    localStorage.setItem("allChats", JSON.stringify(allChats));
  }, [allChats]);

  // 🔽 AUTO SCROLL
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [chatHistory, loading]);

  // 🆕 NEW CHAT
  const startNewChat = () => {
    if (chatHistory.length > 0) {
      const updated = [...allChats];

      if (currentChatIndex !== null) {
        updated[currentChatIndex] = chatHistory;
      } else {
        updated.push(chatHistory);
      }

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

  // 🤖 CALL CURIOKIDS AI
  const askAI = async (prompt) => {
    const response = await fetch(WORKER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: prompt,
        type: "chat",
      }),
    });

    const data = await response.json();

    console.log("CurioKids AI Response:", data);

    if (!response.ok) {
      throw new Error(
        data?.error || "AI request failed"
      );
    }

    if (!data?.reply) {
      throw new Error("AI returned an empty response");
    }

    return data.reply;
  };

  // 📤 SEND MESSAGE
  const sendMessage = async () => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage || loading) return;

    const userMsg = {
      sender: "user",
      text: trimmedMessage,
    };

    const newChat = [
      ...chatHistory,
      userMsg,
    ];

    setChatHistory(newChat);
    setMessage("");
    setLoading(true);

    try {
      // 🤖 Send directly to Cloudflare Worker
      const reply = await askAI(trimmedMessage);

      const updatedChat = [
        ...newChat,
        {
          sender: "ai",
          text: reply,
        },
      ];

      setChatHistory(updatedChat);

      const updatedChats = [...allChats];

      if (currentChatIndex !== null) {
        updatedChats[currentChatIndex] = updatedChat;
      } else {
        updatedChats.push(updatedChat);
        setCurrentChatIndex(updatedChats.length - 1);
      }

      setAllChats(updatedChats);
    } catch (error) {
      console.error("AI Error:", error);

      const errorMessage = {
        sender: "ai",
        text:
          "⚠️ I'm having a little trouble connecting right now. Please try again! 🌱",
      };

      const failedChat = [
        ...newChat,
        errorMessage,
      ];

      setChatHistory(failedChat);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">

      {/* 📁 SIDEBAR */}
      <div className="sidebar">

        <h3>🤖 Jungle AI</h3>

        <button
          className="new-chat"
          onClick={startNewChat}
        >
          + New Chat
        </button>

        <div className="chat-list">

          {allChats.length === 0 ? (
            <p style={{ padding: "10px" }}>
              No chats yet
            </p>
          ) : (
            allChats.map((chat, i) => (
              <div
                key={i}
                className={`chat-item ${
                  currentChatIndex === i
                    ? "active"
                    : ""
                }`}
                onClick={() => loadChat(i)}
              >
                💬 Chat {i + 1}
              </div>
            ))
          )}

        </div>
      </div>

      {/* 💬 CHAT AREA */}
      <div className="chat-section">

        {/* HEADER */}
        <div className="chat-header">
          🤖 Jungle AI Chat
        </div>

        {/* CHAT MESSAGES */}
        <div className="chat-box">

          {chatHistory.length === 0 && (
            <div className="empty-chat">
              <div className="empty-icon">
                🤖🌱
              </div>

              <h3>
                Hi! I'm Jungle AI 👋
              </h3>

              <p>
                Ask me anything and let's learn
                something fun together! ✨
              </p>
            </div>
          )}

          {chatHistory.map((msg, i) => (
            <div
              key={i}
              className={`msg-row ${
                msg.sender === "user"
                  ? "right"
                  : "left"
              }`}
            >
              <div className="msg">
                {msg.text}
              </div>
            </div>
          ))}

          {/* TYPING */}
          {loading && (
            <div className="msg-row left">
              <div className="msg typing">
                🤖 Thinking...
              </div>
            </div>
          )}

          <div ref={chatEndRef} />

        </div>

        {/* 📝 INPUT */}
        <div className="chat-input">

          <input
            type="text"
            value={message}
            onChange={(e) =>
              setMessage(e.target.value)
            }
            placeholder="Ask me anything..."
            disabled={loading}
            onKeyDown={(e) => {
              if (
                e.key === "Enter" &&
                !e.shiftKey
              ) {
                e.preventDefault();
                sendMessage();
              }
            }}
          />

          <button
            onClick={sendMessage}
            disabled={
              loading ||
              !message.trim()
            }
          >
            {loading ? "..." : "Send"}
          </button>

        </div>

      </div>
    </div>
  );
}