import { useState, useEffect } from "react";
import { motion } from "framer-motion";

import DashboardHeader from "../../components/layout/DashboardHeader";
import DashboardSidebar from "../../components/layout/DashboardSidebar";

import ChatWindow from "../../components/ai/ChatWindow";

const AIAssistant = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(
    typeof window !== "undefined" ? window.innerWidth >= 1280 : true
  );
  const [mobileSidebar, setMobileSidebar] = useState(false);

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [darkMode]);

  useEffect(() => {
    const handleResize = () => setSidebarOpen(window.innerWidth >= 1280);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className={`relative min-h-screen overflow-hidden transition-colors duration-500 ${darkMode ? "bg-[#0A0A0C] text-white" : "bg-surface-light text-text"}`}>
      {/* AMBIENT FIELD — two slow-drifting glows behind everything, signalling
          "something intelligent is alive here" without stealing focus from
          the chat. Pure decoration: pointer-events-none, z-0, blurred hard
          enough that it reads as atmosphere rather than shape. */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 -left-40 w-[520px] h-[520px] rounded-full bg-primary/[0.10] blur-[120px]"
          animate={{ x: [0, 60, 0], y: [0, 40, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-40 -right-20 w-[420px] h-[420px] rounded-full bg-primary/[0.08] blur-[110px]"
          animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
          transition={{ duration: 26, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
      </div>

      {/* Thin animated accent line under the header — a quiet "signal" motif
          that ties the AI page to the rest of the brand's sharp-edged
          language instead of introducing a new shape. */}
      <motion.div
        className="absolute top-[72px] md:top-[76px] left-0 right-0 h-px z-20 bg-gradient-to-r from-transparent via-primary/60 to-transparent"
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 1.1, ease: "easeOut" }}
      />

      <DashboardHeader
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        mobileSidebar={mobileSidebar}
        setMobileSidebar={setMobileSidebar}
      />

      <DashboardSidebar
        sidebarOpen={sidebarOpen}
        mobileSidebar={mobileSidebar}
        setMobileSidebar={setMobileSidebar}
        darkMode={darkMode}
      />

      {/* MAIN — fixed-height chat shell rather than a scrolling page body,
          since a chat interface should own its own scroll region. */}
      <main
        className={`relative z-10 pt-24 md:pt-28 pb-4 md:pb-8 px-4 sm:px-6 lg:px-8 transition-all duration-500 h-screen flex flex-col ${
          sidebarOpen ? "xl:ml-[290px]" : "xl:ml-[96px]"
        }`}
      >
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="max-w-[900px] w-full mx-auto flex-1 flex flex-col min-h-0"
        >
          {/* LIVE STATUS STRIP — same bold/uppercase/no-radius language as
              the category chips elsewhere in the app, so the "online"
              signal feels native rather than bolted on. */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            className="flex items-center gap-2 mb-3 shrink-0"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            <span className={`text-[11px] font-bold uppercase tracking-widest ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              NationAura AI — Online
            </span>
          </motion.div>

          <div className="flex-1 flex flex-col min-h-0">
            <ChatWindow darkMode={darkMode} />
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default AIAssistant;