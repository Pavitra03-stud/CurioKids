// import { useState, useRef, useEffect } from "react";
// import "../styles/AIChat.css";

// const WORKER_URL =
//   "https://curiokids-worker.gvpavitraganesh.workers.dev/ai";

// export default function AIChat() {
//   const [message, setMessage] = useState("");
//   const [chatHistory, setChatHistory] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const [allChats, setAllChats] = useState([]);
//   const [currentChatIndex, setCurrentChatIndex] = useState(null);

//   const chatEndRef = useRef(null);

//   // 📥 LOAD SAVED CHATS
//   useEffect(() => {
//     try {
//       const saved = localStorage.getItem("allChats");

//       if (saved) {
//         const parsed = JSON.parse(saved);

//         if (Array.isArray(parsed)) {
//           setAllChats(parsed);

//           if (parsed.length > 0) {
//             setChatHistory(parsed[parsed.length - 1]);
//             setCurrentChatIndex(parsed.length - 1);
//           }
//         }
//       }
//     } catch (error) {
//       console.error("Error loading chats:", error);
//       localStorage.removeItem("allChats");
//     }
//   }, []);

//   // 💾 SAVE CHATS
//   useEffect(() => {
//     localStorage.setItem("allChats", JSON.stringify(allChats));
//   }, [allChats]);

//   // 🔽 AUTO SCROLL
//   useEffect(() => {
//     chatEndRef.current?.scrollIntoView({
//       behavior: "smooth",
//     });
//   }, [chatHistory, loading]);

//   // 🆕 NEW CHAT
//   const startNewChat = () => {
//     if (chatHistory.length > 0) {
//       const updated = [...allChats];

//       if (currentChatIndex !== null) {
//         updated[currentChatIndex] = chatHistory;
//       } else {
//         updated.push(chatHistory);
//       }

//       setAllChats(updated);
//     }

//     setChatHistory([]);
//     setCurrentChatIndex(null);
//   };

//   // 📂 LOAD CHAT
//   const loadChat = (index) => {
//     setChatHistory(allChats[index]);
//     setCurrentChatIndex(index);
//   };

//   // 🤖 CALL CURIOKIDS AI
//   const askAI = async (prompt) => {
//     const response = await fetch(WORKER_URL, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         prompt: prompt,
//         type: "chat",
//       }),
//     });

//     const data = await response.json();

//     console.log("CurioKids AI Response:", data);

//     if (!response.ok) {
//       throw new Error(
//         data?.error || "AI request failed"
//       );
//     }

//     if (!data?.reply) {
//       throw new Error("AI returned an empty response");
//     }

//     return data.reply;
//   };

//   // 📤 SEND MESSAGE
//   const sendMessage = async () => {
//     const trimmedMessage = message.trim();

//     if (!trimmedMessage || loading) return;

//     const userMsg = {
//       sender: "user",
//       text: trimmedMessage,
//     };

//     const newChat = [
//       ...chatHistory,
//       userMsg,
//     ];

//     setChatHistory(newChat);
//     setMessage("");
//     setLoading(true);

//     try {
//       // 🤖 Send directly to Cloudflare Worker
//       const reply = await askAI(trimmedMessage);

//       const updatedChat = [
//         ...newChat,
//         {
//           sender: "ai",
//           text: reply,
//         },
//       ];

//       setChatHistory(updatedChat);

//       const updatedChats = [...allChats];

//       if (currentChatIndex !== null) {
//         updatedChats[currentChatIndex] = updatedChat;
//       } else {
//         updatedChats.push(updatedChat);
//         setCurrentChatIndex(updatedChats.length - 1);
//       }

//       setAllChats(updatedChats);
//     } catch (error) {
//       console.error("AI Error:", error);

//       const errorMessage = {
//         sender: "ai",
//         text:
//           "⚠️ I'm having a little trouble connecting right now. Please try again! 🌱",
//       };

//       const failedChat = [
//         ...newChat,
//         errorMessage,
//       ];

//       setChatHistory(failedChat);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="app-container">

//       {/* 📁 SIDEBAR */}
//       <div className="sidebar">

//         <h3>🤖 Jungle AI</h3>

//         <button
//           className="new-chat"
//           onClick={startNewChat}
//         >
//           + New Chat
//         </button>

//         <div className="chat-list">

//           {allChats.length === 0 ? (
//             <p style={{ padding: "10px" }}>
//               No chats yet
//             </p>
//           ) : (
//             allChats.map((chat, i) => (
//               <div
//                 key={i}
//                 className={`chat-item ${
//                   currentChatIndex === i
//                     ? "active"
//                     : ""
//                 }`}
//                 onClick={() => loadChat(i)}
//               >
//                 💬 Chat {i + 1}
//               </div>
//             ))
//           )}

//         </div>
//       </div>

//       {/* 💬 CHAT AREA */}
//       <div className="chat-section">

//         {/* HEADER */}
//         <div className="chat-header">
//           🤖 Jungle AI Chat
//         </div>

//         {/* CHAT MESSAGES */}
//         <div className="chat-box">

//           {chatHistory.length === 0 && (
//             <div className="empty-chat">
//               <div className="empty-icon">
//                 🤖🌱
//               </div>

//               <h3>
//                 Hi! I'm Jungle AI 👋
//               </h3>

//               <p>
//                 Ask me anything and let's learn
//                 something fun together! ✨
//               </p>
//             </div>
//           )}

//           {chatHistory.map((msg, i) => (
//             <div
//               key={i}
//               className={`msg-row ${
//                 msg.sender === "user"
//                   ? "right"
//                   : "left"
//               }`}
//             >
//               <div className="msg">
//                 {msg.text}
//               </div>
//             </div>
//           ))}

//           {/* TYPING */}
//           {loading && (
//             <div className="msg-row left">
//               <div className="msg typing">
//                 🤖 Thinking...
//               </div>
//             </div>
//           )}

//           <div ref={chatEndRef} />

//         </div>

//         {/* 📝 INPUT */}
//         <div className="chat-input">

//           <input
//             type="text"
//             value={message}
//             onChange={(e) =>
//               setMessage(e.target.value)
//             }
//             placeholder="Ask me anything..."
//             disabled={loading}
//             onKeyDown={(e) => {
//               if (
//                 e.key === "Enter" &&
//                 !e.shiftKey
//               ) {
//                 e.preventDefault();
//                 sendMessage();
//               }
//             }}
//           />

//           <button
//             onClick={sendMessage}
//             disabled={
//               loading ||
//               !message.trim()
//             }
//           >
//             {loading ? "..." : "Send"}
//           </button>

//         </div>

//       </div>
//     </div>
//   );
// }



import { useState, useRef, useEffect } from "react";
import "../styles/AIChat.css";
import { useGame } from "../context/GameContext";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  doc,
  getDoc,
} from "firebase/firestore";

const WORKER_URL =
  "https://curiokids-worker.curiokids25.workers.dev/ai";

export default function AIChat() {
  const {
    stars,
    history,
    streak,
    activeGames,
  } = useGame();
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const [allChats, setAllChats] = useState([]);
  const [currentChatIndex, setCurrentChatIndex] = useState(null);

  const [loadingChats, setLoadingChats] = useState(true);

  const chatEndRef = useRef(null);

  // 🔐 GET LOGGED-IN USER
  const userId = localStorage.getItem("userId");
 const [childName, setChildName] = useState("");
 useEffect(() => {
  const loadChildName = async () => {
    try {
      if (!userId) return;

      const userRef = doc(db, "users", userId);
      const snap = await getDoc(userRef);

      if (snap.exists()) {
        const data = snap.data();
        setChildName(data.name || "");
      }
    } catch (error) {
      console.error("❌ Failed to load child name:", error);

      // Fallback to localStorage
      const childProfile = JSON.parse(
        localStorage.getItem("childProfile") || "{}"
      );

      setChildName(childProfile.name || "");
    }
  };

  loadChildName();
}, [userId]);
  // =========================================================
  // 📥 LOAD SAVED CHATS FROM FIRESTORE
  // =========================================================
  useEffect(() => {
    const loadChats = async () => {
      if (!userId) {
        console.warn("⚠️ No Firebase userId found");
        setLoadingChats(false);
        return;
      }

      try {
        setLoadingChats(true);

        const chatsRef = collection(
          db,
          "users",
          userId,
          "ai_chats"
        );

        const q = query(
          chatsRef,
          orderBy("createdAt", "asc")
        );

        const snapshot = await getDocs(q);

        const chats = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        console.log("🤖 Firebase AI chats:", chats);

        setAllChats(chats);

        // Open latest chat automatically
        if (chats.length > 0) {
          const lastIndex = chats.length - 1;

          setChatHistory(chats[lastIndex].messages || []);
          setCurrentChatIndex(lastIndex);
        }
      } catch (error) {
        console.error("❌ Error loading AI chats:", error);
      } finally {
        setLoadingChats(false);
      }
    };

    loadChats();
  }, [userId]);

  // =========================================================
  // 🔽 AUTO SCROLL
  // =========================================================
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [chatHistory, loading]);

  // =========================================================
  // 🆕 NEW CHAT
  // =========================================================
  const startNewChat = () => {
    setChatHistory([]);
    setCurrentChatIndex(null);
  };

  // =========================================================
  // 📂 LOAD CHAT
  // =========================================================
  const loadChat = (index) => {
    const selectedChat = allChats[index];

    if (!selectedChat) return;

    setChatHistory(selectedChat.messages || []);
    setCurrentChatIndex(index);
  };

  // =========================================================
  // 💾 SAVE CHAT TO FIRESTORE
  // =========================================================
  const saveChatToFirebase = async (messages, existingChat = null) => {
    if (!userId) {
      console.warn("⚠️ No userId. Chat cannot be saved.");
      return null;
    }

    try {
      const chatsRef = collection(
        db,
        "users",
        userId,
        "ai_chats"
      );

      // Existing chat
      if (existingChat?.id) {
        const { doc, updateDoc } = await import("firebase/firestore");

        const chatRef = doc(
          db,
          "users",
          userId,
          "ai_chats",
          existingChat.id
        );

        await updateDoc(chatRef, {
          messages,
          updatedAt: serverTimestamp(),
        });

        return existingChat.id;
      }

      // New chat
      const docRef = await addDoc(chatsRef, {
        messages,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      return docRef.id;
    } catch (error) {
      console.error("❌ Error saving AI chat:", error);
      return null;
    }
  };

  // =========================================================
  // 🤖 CALL CURIOKIDS AI
  // =========================================================
  const askAI = async (prompt) => {
    const response = await fetch(WORKER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
      prompt,
      type: "chat",

     context: {
  childName,
  stars,
  streak,

  progressSummary: {
    totalActivities: history.length,
    recentActivities: history.slice(-5),
    activeGames:
      activeGames && typeof activeGames === "object"
        ? Object.entries(activeGames).slice(0, 5)
        : [],
  },

  conversation: chatHistory.slice(-4),
},
    }),
    });

    const data = await response.json();

    console.log("🤖 CurioKids AI Response:", data);

    if (!response.ok) {
      throw new Error(
        data?.error || "AI request failed"
      );
    }

    if (!data?.reply) {
      throw new Error(
        "AI returned an empty response"
      );
    }

    return data.reply;
  };

  // =========================================================
  // 📤 SEND MESSAGE
  // =========================================================
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
      // 🤖 Ask AI
      const reply = await askAI(trimmedMessage);

      const updatedChat = [
        ...newChat,
        {
          sender: "ai",
          text: reply,
        },
      ];

      setChatHistory(updatedChat);

      // =====================================================
      // 💾 SAVE TO FIREBASE
      // =====================================================

      const existingChat =
        currentChatIndex !== null
          ? allChats[currentChatIndex]
          : null;

      const chatId = await saveChatToFirebase(
        updatedChat,
        existingChat
      );

      // =====================================================
      // UPDATE LOCAL STATE
      // =====================================================

      if (existingChat) {
        const updatedChats = [...allChats];

        updatedChats[currentChatIndex] = {
          ...existingChat,
          messages: updatedChat,
        };

        setAllChats(updatedChats);
      } else if (chatId) {
        const newChatObject = {
          id: chatId,
          messages: updatedChat,
        };

        setAllChats((prev) => [
          ...prev,
          newChatObject,
        ]);

        setCurrentChatIndex(allChats.length);
      }
    } catch (error) {
      console.error("❌ AI Error:", error);

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

  const CURIOKIDS_GAMES = {
  "Letter Recognition": "/letter-recognition",
  "Sound Matching": "/sound-matching",
  "Word Builder": "/word-builder",
  "Letter Tracing": "/letter-tracing",
  "Confusing Letters": "/confusing-letters",
  "Beginning Sounds": "/beginning-sounds",
  "Ending Sounds": "/ending-sounds",
  "Blend Sounds": "/blend-sounds",
  "Break Word": "/break-word",
  "Missing Letter": "/missing-letter",
  "Sight Words": "/sight-words",
  "Word Scramble": "/word-scramble",
  "Sentence Builder": "/sentence-builder",
  "Match Word To Picture": "/match-word-picture",
  "Number Tracing": "/number-tracing",
  "Sound Tap": "/sound-tap",
  "Pattern Copy": "/pattern-copy",
  "Find Friend": "/find-friend",
  "Catch Word": "/catch-word",
  "Fill Bucket": "/fill-bucket",
  "Weather Clothes": "/weather-clothes",
  "Choose Friend": "/choose-friend",
};
const renderAIText = (text) => {
  const formatBoldText = (value) => {
    const parts = value.split(/(\*\*.*?\*\*)/g);

    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={i}>
            {part.slice(2, -2)}
          </strong>
        );
      }

      return part;
    });
  };

  return text.split("\n").map((line, index) => {
    const trimmed = line.trim();

    if (!trimmed) {
      return <div key={index} className="ai-space" />;
    }

    // 🎮 CurioKids internal game link
    const gameMatch = trimmed.match(/^\[\[GAME:(.*?)\]\]$/);

    if (gameMatch) {
      const gameName = gameMatch[1].trim();
      const gamePath = CURIOKIDS_GAMES[gameName];

      if (!gamePath) {
        return null;
      }

      return (
        <div key={index} className="ai-game-link">
          <a href={gamePath}>
            🎮 Play {gameName}
          </a>
        </div>
      );
    }

    // 🏷️ Heading
    if (trimmed.startsWith("**") && trimmed.endsWith("**")) {
      return (
        <div key={index} className="ai-heading">
          {formatBoldText(trimmed)}
        </div>
      );
    }

    // • Bullet point
    if (trimmed.startsWith("- ")) {
      return (
        <div key={index} className="ai-bullet">
          • {formatBoldText(trimmed.slice(2))}
        </div>
      );
    }

    // Normal text
    return (
      <div key={index} className="ai-line">
        {formatBoldText(trimmed)}
      </div>
    );
  });
};

  // =========================================================
  // ⏳ LOADING SCREEN
  // =========================================================
  if (loadingChats) {
    return (
      <div className="app-container">
        <div className="chat-section">
          <div className="empty-chat">
            <div className="empty-icon">
              🤖🌱
            </div>

            <h3>Loading Jungle AI...</h3>

            <p>
              Getting your previous chats ready ✨
            </p>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================
  // 🎨 UI
  // =========================================================
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
                key={chat.id || i}
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
                {msg.sender === "ai"
                  ? renderAIText(msg.text)
                  : msg.text}
              </div>
            </div>
          ))}

          {/* 🤖 THINKING */}
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