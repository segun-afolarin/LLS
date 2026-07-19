import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiCompass,
  FiMapPin,
  FiHome,
  FiArrowLeft,
  FiAlertTriangle,
  FiRadio,
  FiSearch,
} from "react-icons/fi";

import DashboardHeader from "../../components/layout/DashboardHeader";
import DashboardSidebar from "../../components/layout/DashboardSidebar";
import FloatingBottomNav from "../../components/layout/FloatingBottomNav";

/*
  On-brand 404 page. Reuses the exact same three-layout shell every
  other dashboard page uses (DashboardHeader, DashboardSidebar,
  FloatingBottomNav) so the nav never disappears just because the
  route didn't resolve — the student can always get back.

  The illustration is pure CSS/SVG + framer-motion (radar sweep,
  drifting map pin, glitching "404", scattered "signal lost" blips) —
  no external image assets, so it can't break/404 itself.
*/

const NotFound = () => {
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

  return (
    <div className={`relative min-h-screen transition-colors duration-500 ${darkMode ? "bg-[#0A0A0C] text-white" : "bg-surface-light text-text"}`}>
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

      <main
        className={`relative z-10 pt-24 md:pt-28 pb-32 px-4 sm:px-6 lg:px-8 transition-all duration-500 ${
          sidebarOpen ? "xl:ml-[290px]" : "xl:ml-[96px]"
        }`}
      >
        <div className="max-w-[1100px] mx-auto">
          <div
            className={`relative overflow-hidden border ${
              darkMode ? "bg-[#0A0A0C] border-white/10" : "bg-white border-gray-200"
            }`}
          >
            {/* ---- animated backdrop ---- */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {/* faint grid */}
              <div
                className={`absolute inset-0 ${darkMode ? "opacity-[0.06]" : "opacity-[0.035]"}`}
                style={{
                  backgroundImage: `linear-gradient(${darkMode ? "#fff" : "#000"} 1px, transparent 1px), linear-gradient(90deg, ${
                    darkMode ? "#fff" : "#000"
                  } 1px, transparent 1px)`,
                  backgroundSize: "42px 42px",
                }}
              />

              {/* radar sweep, centered behind the 404 */}
              <div className="absolute left-1/2 top-[38%] -translate-x-1/2 -translate-y-1/2">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0.5, scale: 0.2 }}
                    animate={{ opacity: 0, scale: 3.2 }}
                    transition={{ duration: 3.4, repeat: Infinity, delay: i * 1.13, ease: "easeOut" }}
                    className="absolute left-1/2 top-1/2 w-40 h-40 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary"
                  />
                ))}
              </div>

              {/* drifting map pin, "searching" for the page */}
              <motion.div
                animate={{ x: [0, 60, -40, 0], y: [0, -24, 18, 0], rotate: [0, 8, -6, 0] }}
                transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
                className={`absolute right-[12%] top-[18%] text-primary/25 ${darkMode ? "opacity-60" : "opacity-70"}`}
              >
                <FiMapPin size={54} />
              </motion.div>

              {/* stray "signal lost" blips */}
              {[
                { top: "22%", left: "10%", delay: 0 },
                { top: "68%", left: "16%", delay: 0.6 },
                { top: "78%", left: "82%", delay: 1.1 },
                { top: "16%", left: "84%", delay: 1.7 },
              ].map((blip, i) => (
                <motion.div
                  key={i}
                  animate={{ opacity: [0, 1, 0], scale: [0.6, 1.15, 0.6] }}
                  transition={{ duration: 2.6, repeat: Infinity, delay: blip.delay, ease: "easeInOut" }}
                  className="absolute"
                  style={{ top: blip.top, left: blip.left }}
                >
                  <FiRadio className="text-primary/50" size={16} />
                </motion.div>
              ))}
            </div>

            {/* ---- foreground content ---- */}
            <div className="relative z-10 px-6 sm:px-10 py-20 sm:py-28 flex flex-col items-center text-center">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className={`inline-flex items-center gap-2 px-3 py-1.5 border text-[11px] font-black uppercase tracking-[0.18em] ${
                  darkMode ? "bg-primary/10 border-primary/25 text-red-300" : "bg-red-50 border-red-200 text-primary-dark"
                }`}
              >
                <FiAlertTriangle size={12} />
                Error 404
              </motion.div>

              {/* glitching 404 numerals */}
              <div className="mt-8 flex items-center justify-center select-none">
                {["4", "0", "4"].map((digit, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{
                      opacity: 1,
                      y: [0, -6, 0],
                    }}
                    transition={{
                      opacity: { duration: 0.5, delay: i * 0.1 },
                      y: { duration: 3.2 + i * 0.4, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 },
                    }}
                    className={`text-[92px] sm:text-[130px] leading-none font-black tracking-tight ${
                      i === 1 ? "text-primary" : darkMode ? "text-white" : "text-gray-950"
                    }`}
                    style={i === 1 ? { textShadow: "0 0 40px rgba(220,38,38,0.35)" } : undefined}
                  >
                    {digit}
                  </motion.span>
                ))}
              </div>

              {/* rotating compass instead of a 4th digit / accent */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                className={`mt-2 mb-6 w-11 h-11 flex items-center justify-center border ${
                  darkMode ? "border-white/10 text-gray-400" : "border-gray-200 text-gray-400"
                }`}
              >
                <FiCompass size={20} />
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className={`text-xl sm:text-2xl font-black ${darkMode ? "text-white" : "text-gray-950"}`}
              >
                This page didn't make it through verification.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className={`mt-3 max-w-md text-[13.5px] leading-relaxed ${darkMode ? "text-gray-400" : "text-gray-500"}`}
              >
                We searched every hostel block, lecture hall and hidden corner of campus — this route
                just isn't on record. It may have been moved, renamed, or never existed.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
                className="mt-9 flex flex-col sm:flex-row items-center gap-3"
              >
                <button
                  onClick={() => navigate("/student/dashboard")}
                  className="flex items-center justify-center gap-2 h-12 px-6 w-full sm:w-auto bg-primary hover:bg-primary-dark text-white font-bold uppercase tracking-[0.12em] text-xs transition-colors"
                >
                  <FiHome size={14} />
                  Back to Dashboard
                </button>

                <button
                  onClick={() => navigate(-1)}
                  className={`flex items-center justify-center gap-2 h-12 px-6 w-full sm:w-auto border font-bold uppercase tracking-[0.12em] text-xs transition-colors ${
                    darkMode ? "border-white/10 text-gray-300 hover:bg-white/[0.05]" : "border-gray-200 text-gray-600 hover:bg-surface-light"
                  }`}
                >
                  <FiArrowLeft size={14} />
                  Go Back
                </button>
              </motion.div>

              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.55 }}
                onClick={() => navigate("/student/report-issue")}
                className={`mt-6 flex items-center gap-1.5 text-[12px] font-semibold underline-offset-4 hover:underline ${
                  darkMode ? "text-gray-500 hover:text-gray-300" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <FiSearch size={12} />
                Think something on campus is actually broken? Report it instead.
              </motion.button>
            </div>
          </div>
        </div>
      </main>

      <FloatingBottomNav darkMode={darkMode} />
    </div>
  );
};

export default NotFound;