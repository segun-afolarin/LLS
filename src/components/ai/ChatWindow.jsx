import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiCpu, FiSend, FiUser, FiFileText, FiSearch, FiTag } from "react-icons/fi";

/*
  FRONTEND-ONLY NOTE
  -------------------
  No backend/LLM connected yet. getMockReply() below returns a
  keyword-matched canned response instead of a real model call.

  TO SWAP IN A REAL GEMINI API CALL LATER:
  Replace the body of `sendMessage` where it currently does:
      const replyText = await getMockReply(trimmed);
  with something like:
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed, history: messages }),
      });
      const data = await res.json();
      const replyText = data.reply;
  Route that through your Laravel backend (which calls Gemini server-side)
  rather than calling Gemini directly from the browser, so your API key
  is never exposed client-side. The rest of this component — message
  list, typing indicator, suggestions — needs no changes either way.
*/

const SUGGESTIONS = [
  { icon: <FiFileText size={13} />, text: "Help me draft a report about a broken hostel light" },
  { icon: <FiSearch size={13} />, text: "What's the status of LLS-2291?" },
  { icon: <FiTag size={13} />, text: "What category does a Wi-Fi outage fall under?" },
];

const getMockReply = (input) => {
  const q = input.toLowerCase();

  return new Promise((resolve) => {
    const delay = 900 + Math.random() * 600;

    setTimeout(() => {
      if (q.includes("draft") || q.includes("write") || q.includes("help me report") || q.includes("help me file")) {
        resolve(
          "Sure — let's put that together. Tell me three things: (1) what's happening, (2) exactly where it's happening (block, room, or area), and (3) how long it's been going on. Once I have those, I'll draft a clear, admin-ready title and description you can paste straight into Report Issue."
        );
      } else if (q.match(/lls-\d+/i) || q.includes("status") || q.includes("track")) {
        const idMatch = q.match(/lls-\d+/i);
        const id = idMatch ? idMatch[0].toUpperCase() : "that report";
        resolve(
          `${id} is currently in the "Confirming" stage — it has gathered 6 out of 10 required community confirmations. Once it crosses that threshold, it moves to admin verification. You can see the live progress anytime on your My Reports page.`
        );
      } else if (q.includes("category") || q.includes("wi-fi") || q.includes("wifi") || q.includes("portal")) {
        resolve(
          'Network and login issues like that fall under "Portal/ICT." If it were a physical router or cabling problem in a hostel room specifically, "Hostel" could also apply — but for a general Wi-Fi outage, Portal/ICT is the right choice.'
        );
      } else if (q.includes("confirm")) {
        resolve(
          "Every report needs community confirmations before it reaches the administration — this stops single unverified complaints from clogging the admin queue. You can confirm reports you've personally witnessed from the Campus Feed page."
        );
      } else if (q.includes("harassment") || q.includes("security") || q.includes("unsafe")) {
        resolve(
          "For anything involving personal safety or harassment, please mark the urgency as \"Critical\" when filing — these reports are flagged for faster admin attention regardless of confirmation count. If you're in immediate danger, contact campus security directly rather than waiting on this platform."
        );
      } else {
        resolve(
          "I can help you draft a new report, check the status of an existing one, or figure out the right category for an issue. Try asking something like \"help me report a water leak\" or \"what's the status of LLS-2290?\""
        );
      }
    }, delay);
  });
};

const TypingIndicator = ({ darkMode }) => (
  <div className="flex items-center gap-1.5 px-1">
    {[0, 1, 2].map((i) => (
      <motion.span
        key={i}
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.15 }}
        className={`w-1.5 h-1.5 rounded-full ${darkMode ? "bg-gray-500" : "bg-gray-400"}`}
      />
    ))}
  </div>
);

const MessageBubble = ({ message, darkMode }) => {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}
    >
      <div
        className={`w-8 h-8 shrink-0 flex items-center justify-center text-sm ${
          isUser ? (darkMode ? "bg-white/[0.08] text-gray-300" : "bg-gray-200 text-gray-600") : "bg-primary text-white"
        }`}
      >
        {isUser ? <FiUser size={13} /> : <FiCpu size={13} />}
      </div>

      <div
        className={`max-w-[80%] sm:max-w-[75%] px-4 py-3 text-[13.5px] leading-relaxed ${
          isUser
            ? "bg-primary text-white"
            : darkMode
            ? "bg-white/[0.04] border border-white/10 text-gray-200"
            : "bg-white border border-gray-200 text-gray-800"
        }`}
      >
        {message.content}
      </div>
    </motion.div>
  );
};

const ChatWindow = ({ darkMode }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = async (text) => {
    const trimmed = text.trim();
    if (!trimmed || isTyping) return;

    setMessages((prev) => [...prev, { role: "user", content: trimmed }]);
    setInput("");
    setIsTyping(true);

    const replyText = await getMockReply(trimmed);

    setMessages((prev) => [...prev, { role: "assistant", content: replyText }]);
    setIsTyping(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  const isEmpty = messages.length === 0;

  return (
    <div className={`flex-1 flex flex-col min-h-0 border ${darkMode ? "bg-[#0A0A0C] border-white/10" : "bg-white border-gray-200"} shadow-subtle`}>
      {/* HEADER STRIP */}
      <div className={`flex items-center gap-3 px-5 py-4 border-b shrink-0 ${darkMode ? "border-white/10" : "border-gray-200"}`}>
        <div className="w-9 h-9 shrink-0 bg-primary text-white flex items-center justify-center">
          <FiCpu size={15} />
        </div>
        <div>
          <p className={`text-[13.5px] font-bold leading-none ${darkMode ? "text-white" : "text-gray-950"}`}>LLS AI Assistant</p>
          <p className={`mt-1 text-[11px] flex items-center gap-1.5 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
            <span className="w-1.5 h-1.5 bg-emerald-500" /> Online — mocked responses
          </p>
        </div>
      </div>

      {/* MESSAGES */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-5 space-y-5 min-h-0">
        {isEmpty ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-4">
            <div className={`w-14 h-14 flex items-center justify-center mb-4 ${darkMode ? "bg-white/[0.05] text-gray-400" : "bg-surface-light text-gray-400"}`}>
              <FiCpu size={22} />
            </div>
            <p className={`text-[15px] font-bold ${darkMode ? "text-white" : "text-gray-950"}`}>How can I help?</p>
            <p className={`mt-1.5 text-[12.5px] max-w-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
              Ask me to draft a report, check a report's status, or find the right category for an issue.
            </p>

            <div className="mt-6 flex flex-col gap-2 w-full max-w-sm">
              {SUGGESTIONS.map((s, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(s.text)}
                  className={`flex items-center gap-2.5 text-left px-4 py-2.5 text-[12.5px] font-medium border transition-colors duration-150 ${
                    darkMode ? "border-white/10 text-gray-300 hover:bg-white/[0.05]" : "border-gray-200 text-gray-600 hover:bg-surface-light"
                  }`}
                >
                  <span className="text-primary shrink-0">{s.icon}</span>
                  {s.text}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((m, i) => (
              <MessageBubble key={i} message={m} darkMode={darkMode} />
            ))}

            <AnimatePresence>
              {isTyping && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex gap-3">
                  <div className="w-8 h-8 shrink-0 flex items-center justify-center text-sm bg-primary text-white">
                    <FiCpu size={13} />
                  </div>
                  <div className={`px-4 py-3.5 ${darkMode ? "bg-white/[0.04] border border-white/10" : "bg-white border border-gray-200"}`}>
                    <TypingIndicator darkMode={darkMode} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>

      {/* INPUT */}
      <form onSubmit={handleSubmit} className={`flex items-center gap-2.5 p-4 border-t shrink-0 ${darkMode ? "border-white/10" : "border-gray-200"}`}>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask the AI Assistant anything..."
          className={`flex-1 h-11 px-4 border text-sm outline-none transition-colors duration-150 ${
            darkMode
              ? "bg-white/[0.03] border-white/10 text-white placeholder:text-gray-600 focus:border-primary/50"
              : "bg-surface-light border-gray-200 text-gray-950 placeholder:text-gray-400 focus:border-primary/50"
          }`}
        />
        <button
          type="submit"
          disabled={!input.trim() || isTyping}
          className="h-11 w-11 shrink-0 flex items-center justify-center bg-primary text-white hover:bg-primary-dark transition-colors duration-200 disabled:opacity-50"
          aria-label="Send message"
        >
          <FiSend size={16} />
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;