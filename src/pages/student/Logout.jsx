import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiLogOut, FiUser, FiFileText, FiClock, FiShield } from "react-icons/fi";

import DashboardHeader from "../../components/layout/DashboardHeader";
import DashboardSidebar from "../../components/layout/DashboardSidebar";

/*
  FRONTEND-ONLY NOTE
  -------------------
  No backend yet. MOCK_STUDENT stands in for the authenticated student
  (from useAuth() once auth exists). handleConfirm below clears local
  storage and navigates to "/" — swap for a real session-invalidation
  call to the backend first, then redirect.
*/
const MOCK_STUDENT = {
  name: "Afolarin",
  campus: "Abuja",
  reportsFiled: 9,
};

const initialsOf = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("") || "?";

const Logout = () => {
  const navigate = useNavigate();

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

  const handleConfirm = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/");
  };

  const handleCancel = () => {
    navigate("/student/dashboard");
  };

  return (
    <div className={`relative min-h-screen transition-colors duration-500 ${darkMode ? "bg-[#0A0A0C] text-white" : "bg-surface-light text-text"}`}>
      {/* HEADER — reused as-is */}
      <DashboardHeader
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        mobileSidebar={mobileSidebar}
        setMobileSidebar={setMobileSidebar}
      />

      {/* SIDEBAR — reused as-is */}
      <DashboardSidebar
        sidebarOpen={sidebarOpen}
        mobileSidebar={mobileSidebar}
        setMobileSidebar={setMobileSidebar}
        darkMode={darkMode}
      />

      {/* MAIN — no FloatingBottomNav here; this is a terminal page,
          not somewhere a student needs quick navigation from. */}
      <main
        className={`relative z-10 pt-24 md:pt-28 px-4 sm:px-6 lg:px-8 pb-16 transition-all duration-500 min-h-screen flex items-center justify-center ${
          sidebarOpen ? "xl:ml-[290px]" : "xl:ml-[96px]"
        }`}
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`relative w-full max-w-lg border overflow-hidden ${darkMode ? "bg-[#0A0A0C] border-white/10" : "bg-white border-gray-200"} shadow-elevated`}
        >
          {/* Font import — move to index.html for production */}
          <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Zilla+Slab:wght@600;700;900&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
            .lls-display { font-family: 'Zilla Slab', ui-serif, Georgia, serif; }
            .lls-mono { font-family: 'IBM Plex Mono', ui-monospace, SFMono-Regular, monospace; }
          `}</style>

          {/* BACKGROUND GRID — quiet, on-brand, same as the hero sections */}
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(to right, #C1121F 1px, transparent 1px), linear-gradient(to bottom, #C1121F 1px, transparent 1px)",
              backgroundSize: "36px 36px",
            }}
          />

          {/* GLOW */}
          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.12, 0.2, 0.12] }}
            transition={{ duration: 6, repeat: Infinity }}
            className="absolute -top-10 -right-10 w-56 h-56 bg-primary/10 blur-3xl pointer-events-none"
          />

          <div className="h-[3px] w-full bg-primary" />

          <div className="relative z-10 p-8 sm:p-10 text-center">
            {/* ICON — pulsing ring around it, more presence than the old plain box */}
            <div className="relative w-20 h-20 mx-auto mb-7">
              <motion.div
                animate={{ scale: [1, 1.25, 1], opacity: [0.4, 0, 0.4] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 bg-primary/20"
              />
              <motion.div
                initial={{ scale: 0, rotate: -15 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 280, damping: 16, delay: 0.15 }}
                className="relative w-20 h-20 bg-primary text-white flex items-center justify-center text-3xl"
              >
                <FiLogOut />
              </motion.div>
            </div>

            {/* AVATAR + NAME */}
            <div className="flex items-center justify-center gap-2.5 mb-1">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white text-[10px] font-black shrink-0">
                {initialsOf(MOCK_STUDENT.name)}
              </div>
              <span className={`lls-mono text-[11px] font-semibold uppercase tracking-[0.15em] ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                {MOCK_STUDENT.campus} Campus
              </span>
            </div>

            <h1 className={`lls-display text-2xl sm:text-[28px] font-black tracking-tight leading-tight ${darkMode ? "text-white" : "text-gray-950"}`}>
              {MOCK_STUDENT.name}, are you sure you want to leave?
            </h1>

            {/* LETTERHEAD RULE */}
            <div className="mt-4 mx-auto w-16">
              <div className="h-[3px] bg-primary" />
              <div className={`h-px mt-1 ${darkMode ? "bg-white/20" : "bg-gray-300"}`} />
            </div>

            <p className={`mt-5 text-[13.5px] leading-relaxed max-w-sm mx-auto ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              You'll need to sign back in to file reports, confirm issues, or check on the ones you've already submitted.
            </p>

            {/* SESSION SNAPSHOT — small, on-brand mono stat row instead of just a plain sentence */}
            <div className={`mt-7 grid grid-cols-2 divide-x border ${darkMode ? "border-white/10 divide-white/10 bg-white/[0.03]" : "border-gray-200 divide-gray-200 bg-[#FAFAFA]"}`}>
              <div className="px-4 py-3.5">
                <p className={`lls-mono text-[10px] uppercase tracking-[0.15em] flex items-center justify-center gap-1.5 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                  <FiFileText size={11} />
                  Reports Filed
                </p>
                <p className={`lls-mono mt-1.5 text-lg font-semibold ${darkMode ? "text-white" : "text-gray-950"}`}>
                  {MOCK_STUDENT.reportsFiled}
                </p>
              </div>
              <div className="px-4 py-3.5">
                <p className={`lls-mono text-[10px] uppercase tracking-[0.15em] flex items-center justify-center gap-1.5 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                  <FiShield size={11} />
                  Session
                </p>
                <p className={`lls-mono mt-1.5 text-lg font-semibold ${darkMode ? "text-white" : "text-gray-950"}`}>Active</p>
              </div>
            </div>

            <div className="mt-8 flex flex-col-reverse sm:flex-row gap-3">
              <button
                onClick={handleCancel}
                className={`flex-1 h-12 font-bold text-[13.5px] border transition-colors duration-200 ${
                  darkMode ? "border-white/10 text-gray-200 hover:bg-white/[0.05]" : "border-gray-200 text-gray-700 hover:bg-surface-light"
                }`}
              >
                Take Me Back
              </button>
              <button
                onClick={handleConfirm}
                className="group relative overflow-hidden flex-1 h-12 bg-primary text-white font-bold text-[13.5px] hover:bg-primary-dark transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <span className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-all duration-1000" />
                <FiLogOut size={14} />
                I'm Sure, Log Out
              </button>
            </div>

            <p className={`mt-5 flex items-center justify-center gap-1.5 text-[11px] ${darkMode ? "text-gray-600" : "text-gray-400"}`}>
              <FiClock size={11} />
              You can sign back in anytime with your student credentials.
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Logout;