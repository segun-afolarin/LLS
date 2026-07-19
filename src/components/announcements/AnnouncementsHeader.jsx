import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  FiBell,
  FiZap,
  FiFileText,
  FiBookmark,
  FiCheckCircle,
  FiClock,
} from "react-icons/fi";

/*
  FRONTEND-ONLY NOTE
  -------------------
  No backend yet. ANNOUNCEMENT_STATS and LATEST_NOTICE stand in for a
  real GET /api/announcements/summary call. Once wired up, compute
  these from the same fetched list AnnouncementsList uses instead of
  hardcoding them. "Mark All as Read" is purely local state here — it
  flips unreadCount to 0 on click but doesn't persist anywhere, so a
  refresh brings the unread count back. Swap for a real
  POST /api/announcements/read-all once the backend exists.
*/

const ANNOUNCEMENT_STATS = {
  unread: 2,
  totalThisMonth: 14,
  pinned: 1,
};

const LATEST_NOTICE = {
  title: "Second semester exam timetable released",
  category: "Academic",
  time: "2h ago",
};

const heroContent = [
  {
    title1: "Straight From",
    title2: "Administration.",
    paragraph:
      "Official updates from your campus administration, in one place. No rumors, no group-chat forwards — just what's actually been announced.",
  },
  {
    title1: "Two New,",
    title2: "Since You Checked.",
    paragraph:
      "New notices land here the moment they're published. Exam schedules, maintenance windows, policy changes — nothing official slips past you.",
  },
  {
    title1: "Pinned Means",
    title2: "Pay Attention.",
    paragraph:
      "Time-sensitive notices get pinned to the top of the list. If administration marks something urgent, you'll see it before anything else.",
  },
  {
    title1: "Read Once.",
    title2: "Stays On Record.",
    paragraph:
      "Every announcement stays archived here for the semester, so you can always scroll back and find exactly what was said and when.",
  },
  {
    title1: "No Noise.",
    title2: "Just Notices.",
    paragraph:
      "This feed carries only verified updates from campus administration — a clean, official channel separate from the community report feed.",
  },
];

const AnnouncementsHeader = ({ darkMode }) => {
  const shouldReduceMotion = useReducedMotion();
  const [loading, setLoading] = useState(true);
  const [currentHero, setCurrentHero] = useState(0);
  const [unreadCount, setUnreadCount] = useState(ANNOUNCEMENT_STATS.unread);

  useEffect(() => {
    // Simulated fetch delay so loading states render correctly once wired
    // to a real endpoint — remove the timeout, keep the shape.
    const t = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHero((prev) => (prev === heroContent.length - 1 ? 0 : prev + 1));
    }, 9000);
    return () => clearInterval(interval);
  }, []);

  const statsTiles = [
    { title: "Unread", value: loading ? "—" : `${unreadCount}` },
    { title: "This Month", value: loading ? "—" : `${ANNOUNCEMENT_STATS.totalThisMonth}` },
    { title: "Pinned", value: loading ? "—" : `${ANNOUNCEMENT_STATS.pinned}` },
  ];

  const focusRing = darkMode
    ? "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0C]"
    : "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-white";

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`relative overflow-hidden border ${
        darkMode ? "bg-[#0A0A0C] border-white/10" : "bg-white border-gray-200"
      }`}
    >
      {/* Font imports — move to index.html for production */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Zilla+Slab:wght@500;600;700;900&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
        .lls-display { font-family: 'Zilla Slab', ui-serif, Georgia, serif; }
        .lls-mono { font-family: 'IBM Plex Mono', ui-monospace, SFMono-Regular, monospace; }
      `}</style>

      {/* BACKGROUND GRID — quiet, on-brand */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #C1121F 1px, transparent 1px), linear-gradient(to bottom, #C1121F 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* WATERMARK — this channel is administration's, not students' */}
      <div
        aria-hidden="true"
        className="lls-display pointer-events-none select-none absolute -top-6 right-2 sm:right-6 text-[90px] sm:text-[140px] lg:text-[180px] font-black leading-none tracking-tight"
        style={{
          color: darkMode ? "rgba(255,255,255,0.025)" : "rgba(10,10,12,0.025)",
          transform: "rotate(-6deg)",
        }}
      >
        OFFICIAL
      </div>

      {/* GLOW — single, subtle, brand-colored */}
      <motion.div
        animate={shouldReduceMotion ? { opacity: 0.14 } : { scale: [1, 1.1, 1], opacity: [0.12, 0.2, 0.12] }}
        transition={shouldReduceMotion ? {} : { duration: 6, repeat: Infinity }}
        className="absolute top-0 right-0 w-72 h-72 bg-primary/10 blur-3xl"
      />

      {/* CONTENT */}
      <div className="relative z-10 p-5 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-6 items-start">
          {/* LEFT */}
          <div>
            {/* BADGE — reframed around unread count, since that's what matters here */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={`inline-flex items-center gap-3 border px-4 py-2 mb-5 ${
                darkMode ? "bg-primary/10 border-primary/25 text-red-300" : "bg-red-50 border-red-200 text-primary-dark"
              }`}
            >
              {unreadCount > 0 ? (
                <span className="relative flex w-2.5 h-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping bg-primary/60" />
                  <span className="relative inline-flex h-2.5 w-2.5 bg-primary" />
                </span>
              ) : (
                <FiCheckCircle size={12} />
              )}
              <span className="lls-mono text-[11px] font-semibold tracking-[0.15em] uppercase">
                {loading ? "Loading —" : unreadCount > 0 ? `${unreadCount} Unread — Campus Administration` : "All Caught Up"}
              </span>
            </motion.div>

            {/* TITLE — rotates through heroContent, same carousel pattern as the other headers */}
            <div className="min-h-[220px] sm:min-h-[250px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentHero}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.7 }}
                >
                  <h1
                    className={`lls-display text-[38px] sm:text-[54px] lg:text-[68px] leading-[0.95] tracking-[-0.02em] font-black break-words ${
                      darkMode ? "text-white" : "text-gray-950"
                    }`}
                  >
                    <motion.span
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: currentHero === 0 ? 0.3 : 0.1 }}
                      className="block"
                    >
                      {heroContent[currentHero].title1}
                    </motion.span>

                    <motion.span
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: currentHero === 0 ? 0.45 : 0.25 }}
                      className="block mt-1 text-primary"
                    >
                      {heroContent[currentHero].title2}
                    </motion.span>
                  </h1>

                  {/* LETTERHEAD RULE — double rule under the headline, document-header cue */}
                  <div className="mt-4 w-20 sm:w-28">
                    <div className="h-[3px] bg-primary" />
                    <div className={`h-px mt-1 ${darkMode ? "bg-white/20" : "bg-gray-300"}`} />
                  </div>

                  {/* PARAGRAPH */}
                  <motion.p
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: currentHero === 0 ? 0.55 : 0.35 }}
                    className={`mt-5 max-w-2xl text-sm sm:text-base leading-relaxed ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {heroContent[currentHero].paragraph}
                  </motion.p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* STATS — index-card treatment: thin top rule per tile, mono figures */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-2 grid grid-cols-3 gap-3"
            >
              {statsTiles.map((item, index) => (
                <motion.div
                  key={index}
                  whileHover={shouldReduceMotion ? {} : { y: -4 }}
                  className={`border-t-2 border-primary p-4 transition-colors duration-300 ${
                    darkMode
                      ? "bg-white/[0.03] border-x border-b border-x-white/10 border-b-white/10 hover:bg-white/[0.05]"
                      : "bg-surface-light border-x border-b border-x-gray-200 border-b-gray-200 hover:bg-white"
                  }`}
                >
                  <h3
                    className={`lls-mono text-xl sm:text-2xl font-semibold ${
                      darkMode ? "text-white" : "text-gray-950"
                    }`}
                  >
                    {item.value}
                  </h3>
                  <p
                    className={`lls-mono mt-1 text-[10px] sm:text-xs uppercase tracking-[0.12em] ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {item.title}
                  </p>
                </motion.div>
              ))}
            </motion.div>

            {/* BUTTONS */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="mt-7 flex flex-col sm:flex-row gap-4"
            >
              <motion.div whileHover={shouldReduceMotion ? {} : { y: -2 }} whileTap={{ scale: 0.98 }}>
                <button
                  onClick={() => setUnreadCount(0)}
                  disabled={unreadCount === 0}
                  className={`group relative overflow-hidden h-[52px] px-6 bg-primary text-white font-semibold flex items-center justify-center gap-3 shadow-[0_15px_40px_rgba(193,18,31,0.25)] disabled:opacity-50 disabled:cursor-default ${focusRing}`}
                >
                  <span className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-all duration-1000" />
                  <FiCheckCircle />
                  {unreadCount === 0 ? "All Caught Up" : "Mark All as Read"}
                </button>
              </motion.div>

              <motion.div whileHover={shouldReduceMotion ? {} : { y: -2 }} whileTap={{ scale: 0.98 }}>
                <a
                  href="#announcements-list"
                  className={`h-[52px] px-6 border font-semibold transition-colors duration-300 flex items-center justify-center gap-2 ${focusRing} ${
                    darkMode
                      ? "border-white/10 bg-white/[0.03] text-white hover:bg-white/[0.05]"
                      : "border-gray-200 bg-surface-light text-gray-950 hover:bg-white"
                  }`}
                >
                  Jump to List
                </a>
              </motion.div>
            </motion.div>
          </div>

          {/* RIGHT PANEL — "Case File" latest notice card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className={`relative border p-5 ${
              darkMode ? "bg-white/[0.03] border-white/10" : "bg-surface-light border-gray-200"
            }`}
          >
            {/* STAMP — reads NEW while there's unread mail, OFFICIAL once cleared */}
            <AnimatePresence>
              {!loading && (
                <motion.div
                  initial={{ opacity: 0, scale: 1.4, rotate: -18 }}
                  animate={{ opacity: 0.8, scale: 1, rotate: -12 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="absolute top-4 right-4 flex items-center gap-1.5 border-2 border-primary text-primary px-2.5 py-1 pointer-events-none"
                >
                  {unreadCount > 0 ? (
                    <motion.span
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 1.6, repeat: Infinity }}
                      className="w-1.5 h-1.5 bg-primary"
                    />
                  ) : (
                    <FiCheckCircle className="text-xs" />
                  )}
                  <span className="lls-mono text-[10px] font-bold tracking-[0.15em]">
                    {unreadCount > 0 ? "NEW" : "READ"}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* HEADER */}
            <div>
              <p
                className={`lls-mono text-[10px] uppercase tracking-[0.2em] ${
                  darkMode ? "text-gray-500" : "text-gray-400"
                }`}
              >
                <FiFileText className="inline -mt-0.5 mr-1" />
                LATEST NOTICE
              </p>
              <h3 className={`lls-display mt-2 text-2xl font-bold leading-tight ${darkMode ? "text-white" : "text-gray-950"}`}>
                {LATEST_NOTICE.title}
              </h3>
            </div>

            {/* META ROWS */}
            <div className="mt-6 flex flex-col gap-2.5">
              {[
                { icon: <FiBell />, label: "Category", value: LATEST_NOTICE.category },
                { icon: <FiClock />, label: "Posted", value: LATEST_NOTICE.time },
                { icon: <FiBookmark />, label: "Pinned notices", value: `${ANNOUNCEMENT_STATS.pinned}` },
              ].map((row, i) => (
                <motion.div
                  key={row.label}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: shouldReduceMotion ? 0 : 0.7 + i * 0.08 }}
                  className={`flex items-center justify-between gap-3 border px-3.5 py-2.5 ${
                    darkMode ? "border-white/10 bg-white/[0.02]" : "border-gray-200 bg-white"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 shrink-0 bg-primary/10 text-primary flex items-center justify-center text-sm">
                      {row.icon}
                    </div>
                    <span className={`text-[12.5px] font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                      {row.label}
                    </span>
                  </div>
                  <span className={`text-[12.5px] font-bold ${darkMode ? "text-white" : "text-gray-950"}`}>{row.value}</span>
                </motion.div>
              ))}
            </div>

            {/* PERFORATION — dashed tear-line, ledger-stub cue */}
            <div className={`mt-6 border-t border-dashed ${darkMode ? "border-white/15" : "border-gray-300"}`} />

            {/* TIP CARD */}
            <motion.div whileHover={shouldReduceMotion ? {} : { y: -4 }} className="mt-6 flex items-start gap-3">
              <div className="w-9 h-9 shrink-0 bg-primary text-white flex items-center justify-center">
                <FiZap className="text-sm" />
              </div>
              <div>
                <h4
                  className={`lls-mono text-[10px] font-bold uppercase tracking-[0.15em] ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Good to Know
                </h4>
                <p className={`mt-1.5 text-sm leading-relaxed ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                  Pinned notices stay at the top of the list regardless of date — check them first.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default AnnouncementsHeader;