import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiCpu, FiSend, FiUser, FiFileText, FiSearch, FiTag, FiMic, FiMicOff, FiVolume2, FiVolumeX } from "react-icons/fi";

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
  list, typing indicator, suggestions, mic input, and read-aloud — needs
  no changes either way.

  VOICE FEATURES
  --------------
  Both mic input and read-aloud use the browser's native Web Speech API
  (SpeechRecognition + SpeechSynthesis) — no extra package, no backend.
  Support varies: Chrome/Edge/Safari support both; Firefox currently
  doesn't support SpeechRecognition. Everything degrades gracefully —
  unsupported features just don't render their button.
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

const MessageBubble = ({ message, darkMode, onToggleSpeak, isSpeaking, speechSupported }) => {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex gap-2 sm:gap-3 ${isUser ? "flex-row-reverse" : ""}`}
    >
      <div
        className={`w-7 h-7 sm:w-8 sm:h-8 shrink-0 flex items-center justify-center text-sm ${
          isUser ? (darkMode ? "bg-white/[0.08] text-gray-300" : "bg-gray-200 text-gray-600") : "bg-primary text-white"
        }`}
      >
        {isUser ? <FiUser size={12} /> : <FiCpu size={12} />}
      </div>

      <div className={`flex items-end gap-1 sm:gap-1.5 min-w-0 ${isUser ? "flex-row-reverse" : ""}`}>
        <div
          className={`max-w-[78vw] sm:max-w-[75%] px-3.5 sm:px-4 py-2.5 sm:py-3 text-[13px] sm:text-[13.5px] leading-relaxed break-words ${
            isUser
              ? "bg-primary text-white"
              : darkMode
              ? "bg-white/[0.04] border border-white/10 text-gray-200"
              : "bg-white border border-gray-200 text-gray-800"
          }`}
        >
          {message.content}
        </div>

        {/* Read-aloud button — only on AI replies, and only if the
            browser supports speech synthesis. Lets someone who can't
            read tap to hear the answer spoken back to them. */}
        {!isUser && speechSupported && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onToggleSpeak(message.content)}
            aria-label={isSpeaking ? "Stop reading aloud" : "Read this reply aloud"}
            className={`shrink-0 w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center transition-colors duration-150 ${
              isSpeaking
                ? "bg-primary text-white"
                : darkMode
                ? "text-gray-500 hover:text-white hover:bg-white/[0.05]"
                : "text-gray-400 hover:text-primary hover:bg-surface-light"
            }`}
          >
            {isSpeaking ? <FiVolumeX size={13} /> : <FiVolume2 size={13} />}
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

const ChatWindow = ({ darkMode }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [autoRead, setAutoRead] = useState(false);
  const [speakingIndex, setSpeakingIndex] = useState(null);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);

  const speechRecognitionSupported =
    typeof window !== "undefined" && (window.SpeechRecognition || window.webkitSpeechRecognition);
  const speechSynthesisSupported = typeof window !== "undefined" && "speechSynthesis" in window;

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping]);

  // Set up SpeechRecognition once on mount.
  useEffect(() => {
    if (!speechRecognitionSupported) return;
    const SpeechRecognitionCtor = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognitionCtor();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      let transcript = "";
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setInput(transcript);
    };
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognitionRef.current = recognition;

    return () => {
      recognition.onresult = null;
      recognition.onend = null;
      recognition.onerror = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Stop any speech synthesis on unmount.
  useEffect(() => {
    return () => {
      if (speechSynthesisSupported) window.speechSynthesis.cancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setInput("");
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const speak = useCallback(
    (text, index) => {
      if (!speechSynthesisSupported) return;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.onend = () => setSpeakingIndex(null);
      utterance.onerror = () => setSpeakingIndex(null);
      setSpeakingIndex(index);
      window.speechSynthesis.speak(utterance);
    },
    [speechSynthesisSupported]
  );

  const stopSpeaking = () => {
    if (speechSynthesisSupported) window.speechSynthesis.cancel();
    setSpeakingIndex(null);
  };

  const handleToggleSpeakForMessage = (content, index) => {
    if (speakingIndex === index) {
      stopSpeaking();
    } else {
      speak(content, index);
    }
  };

  const sendMessage = async (text) => {
    const trimmed = text.trim();
    if (!trimmed || isTyping) return;

    setMessages((prev) => [...prev, { role: "user", content: trimmed }]);
    setInput("");
    setIsTyping(true);

    const replyText = await getMockReply(trimmed);

    setMessages((prev) => {
      const next = [...prev, { role: "assistant", content: replyText }];
      if (autoRead) {
        // Speak the reply once it's in state, indexed at its final position.
        setTimeout(() => speak(replyText, next.length - 1), 50);
      }
      return next;
    });
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
      <div className={`flex items-center gap-2 sm:gap-3 px-3.5 sm:px-5 py-3 sm:py-4 border-b shrink-0 ${darkMode ? "border-white/10" : "border-gray-200"}`}>
        <div className="w-8 h-8 sm:w-9 sm:h-9 shrink-0 bg-primary text-white flex items-center justify-center">
          <FiCpu size={14} className="sm:hidden" />
          <FiCpu size={15} className="hidden sm:block" />
        </div>
        <div className="flex-1 min-w-0">
          <p className={`text-[13px] sm:text-[13.5px] font-bold leading-none truncate ${darkMode ? "text-white" : "text-gray-950"}`}>
            LLS AI Assistant
          </p>
          <p className={`mt-1 text-[10.5px] sm:text-[11px] flex items-center gap-1.5 truncate ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
            <span className="w-1.5 h-1.5 bg-emerald-500 shrink-0" />
            <span className="truncate">Online — mocked responses</span>
          </p>
        </div>

        {/* Auto-read toggle — for users who'd rather have every reply
            spoken automatically than tap the speaker icon each time. */}
        {speechSynthesisSupported && (
          <button
            type="button"
            onClick={() => {
              const next = !autoRead;
              setAutoRead(next);
              if (!next) stopSpeaking();
            }}
            aria-pressed={autoRead}
            aria-label="Toggle auto-read replies"
            className={`shrink-0 flex items-center gap-1.5 h-8 sm:h-auto px-2.5 sm:px-3 py-0 sm:py-2 text-[11px] sm:text-[11.5px] font-semibold border transition-colors duration-150 ${
              autoRead
                ? "bg-primary border-primary text-white"
                : darkMode
                ? "border-white/10 text-gray-400 hover:border-white/25"
                : "border-gray-200 text-gray-500 hover:border-gray-300"
            }`}
          >
            {autoRead ? <FiVolume2 size={13} /> : <FiVolumeX size={13} />}
            <span className="hidden sm:inline">Auto-read replies</span>
          </button>
        )}
      </div>

      {/* MESSAGES */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-3.5 sm:px-5 py-4 sm:py-5 space-y-4 sm:space-y-5 min-h-0">
        {isEmpty ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-2 sm:px-4">
            <div className={`w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center mb-3.5 sm:mb-4 ${darkMode ? "bg-white/[0.05] text-gray-400" : "bg-surface-light text-gray-400"}`}>
              <FiCpu size={20} className="sm:hidden" />
              <FiCpu size={22} className="hidden sm:block" />
            </div>
            <p className={`text-[14px] sm:text-[15px] font-bold ${darkMode ? "text-white" : "text-gray-950"}`}>How can I help?</p>
            <p className={`mt-1.5 text-[12px] sm:text-[12.5px] max-w-[280px] sm:max-w-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
              Ask me to draft a report, check a report's status, or find the right category for an issue. You can
              type, tap the mic to speak, or turn on auto-read to have replies read aloud.
            </p>

            <div className="mt-5 sm:mt-6 flex flex-col gap-2 w-full max-w-sm">
              {SUGGESTIONS.map((s, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(s.text)}
                  className={`flex items-center gap-2.5 text-left px-3.5 sm:px-4 py-2.5 text-[12px] sm:text-[12.5px] font-medium border transition-colors duration-150 ${
                    darkMode ? "border-white/10 text-gray-300 hover:bg-white/[0.05]" : "border-gray-200 text-gray-600 hover:bg-surface-light"
                  }`}
                >
                  <span className="text-primary shrink-0">{s.icon}</span>
                  <span className="min-w-0">{s.text}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((m, i) => (
              <MessageBubble
                key={i}
                message={m}
                darkMode={darkMode}
                speechSupported={speechSynthesisSupported}
                isSpeaking={speakingIndex === i}
                onToggleSpeak={(content) => handleToggleSpeakForMessage(content, i)}
              />
            ))}

            <AnimatePresence>
              {isTyping && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex gap-2 sm:gap-3">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 shrink-0 flex items-center justify-center text-sm bg-primary text-white">
                    <FiCpu size={12} />
                  </div>
                  <div className={`px-3.5 sm:px-4 py-3 sm:py-3.5 ${darkMode ? "bg-white/[0.04] border border-white/10" : "bg-white border border-gray-200"}`}>
                    <TypingIndicator darkMode={darkMode} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>

      {/* INPUT */}
      <form onSubmit={handleSubmit} className={`flex items-center gap-2 sm:gap-2.5 p-3 sm:p-4 border-t shrink-0 ${darkMode ? "border-white/10" : "border-gray-200"}`}>
        {/* Mic button — speech-to-text so someone who can't type well
            (or can't read to check their spelling) can just talk instead. */}
        {speechRecognitionSupported && (
          <motion.button
            type="button"
            whileTap={{ scale: 0.92 }}
            onClick={toggleListening}
            aria-label={isListening ? "Stop voice input" : "Speak your message"}
            aria-pressed={isListening}
            className={`relative h-10 w-10 sm:h-11 sm:w-11 shrink-0 flex items-center justify-center border transition-colors duration-200 ${
              isListening
                ? "bg-primary border-primary text-white"
                : darkMode
                ? "border-white/10 text-gray-400 hover:text-white hover:border-white/25"
                : "border-gray-200 text-gray-500 hover:text-primary hover:border-gray-300"
            }`}
          >
            {isListening && (
              <motion.span
                className="absolute inset-0 border-2 border-primary"
                initial={{ opacity: 0.6, scale: 1 }}
                animate={{ opacity: 0, scale: 1.4 }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut" }}
              />
            )}
            {isListening ? <FiMicOff size={15} /> : <FiMic size={15} />}
          </motion.button>
        )}

        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={isListening ? "Listening..." : "Ask the AI Assistant anything..."}
          /* text-base (16px) on mobile avoids iOS Safari's
             auto-zoom-on-focus for inputs under 16px. */
          className={`flex-1 min-w-0 h-10 sm:h-11 px-3.5 sm:px-4 border text-base sm:text-sm outline-none transition-colors duration-150 ${
            darkMode
              ? "bg-white/[0.03] border-white/10 text-white placeholder:text-gray-600 focus:border-primary/50"
              : "bg-surface-light border-gray-200 text-gray-950 placeholder:text-gray-400 focus:border-primary/50"
          }`}
        />
        <button
          type="submit"
          disabled={!input.trim() || isTyping}
          className="h-10 w-10 sm:h-11 sm:w-11 shrink-0 flex items-center justify-center bg-primary text-white hover:bg-primary-dark transition-colors duration-200 disabled:opacity-50"
          aria-label="Send message"
        >
          <FiSend size={15} />
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;