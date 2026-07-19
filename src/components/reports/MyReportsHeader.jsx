import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  FiArrowUpRight,
  FiFolder,
  FiZap,
  FiFileText,
  FiClock,
  FiLoader,
  FiCheckCircle,
  FiArchive,
} from "react-icons/fi";

/*
  FRONTEND-ONLY NOTE
  -------------------
  No backend yet. SUMMARY is derived from MOCK_MY_REPORTS in
  MyReportsList.jsx conceptually — kept as a separate constant here for
  simplicity. Once wired to a real endpoint, compute these counts from
  the same fetched list instead of hardcoding them.
*/
const SUMMARY = {
  total: 9,
  pending: 2,
  confirming: 3,
  verified: 2,
  resolved: 2,
};

const STATUS_TABS = [
  { key: "all", label: "All", count: SUMMARY.total },
  { key: "pending", label: "Pending", count: SUMMARY.pending },
  { key: "confirming", label: "Confirming", count: SUMMARY.confirming },
  { key: "verified", label: "Verified", count: SUMMARY.verified },
  { key: "resolved", label: "Resolved", count: SUMMARY.resolved },
];

const heroContent = [
  {
    title1: "Every Report",
    title2: "You've Filed.",
    paragraph:
      "Every issue you've personally reported, in one place, and exactly where each one stands — from the moment it's filed to the moment it's resolved.",
  },
  {
    title1: "Your Voice,",
    title2: "On the Record.",
    paragraph:
      "Nine reports filed, two already resolved. Each one is a permanent record you can revisit, edit while pending, or track until it's closed.",
  },
  {
    title1: "Filed Once.",
    title2: "Tracked Forever.",
    paragraph:
      "From submission to community confirmation to admin resolution — follow the full lifecycle of everything you've reported, in real time.",
  },
  {
    title1: "Still Pending?",
    title2: "You Can Still Edit.",
    paragraph:
      "Reports awaiting confirmation can still be updated or withdrawn. Once confirmations start rolling in, the details lock in for good.",
  },
  {
    title1: "Two Down,",
    title2: "Seven To Go.",
    paragraph:
      "Every resolved report is one less problem on campus. Check back here to see your reports move from filed to confirming to resolved.",
  },
];

const MyReportsHeader = ({ darkMode, activeStatus, setActiveStatus }) => {
  const shouldReduceMotion = useReducedMotion();
  const [loading, setLoading] = useState(true);
  const [currentHero, setCurrentHero] = useState(0);

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

  const resolutionRate = SUMMARY.total > 0 ? Math.round((SUMMARY.resolved / SUMMARY.total) * 100) : 0;

  const statsTiles = [
    { title: "Total Filed", value: loading ? "—" : `${SUMMARY.total}` },
    { title: "In Progress", value: loading ? "—" : `${SUMMARY.pending + SUMMARY.confirming}` },
    { title: "Resolved", value: loading ? "—" : `${SUMMARY.resolved}` },
  ];

  const focusRing = darkMode
    ? "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0C]"
    : "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-white";

  // Segmented resolution-rate meter, same tally/ledger style as the other headers.
  const totalTicks = 20;
  const filledTicks = loading ? 0 : Math.round((resolutionRate / 100) * totalTicks);

  const statusBreakdown = [
    { icon: <FiClock />, label: "Pending", value: SUMMARY.pending },
    { icon: <FiLoader />, label: "Confirming", value: SUMMARY.confirming },
    { icon: <FiCheckCircle />, label: "Verified", value: SUMMARY.verified },
    { icon: <FiArchive />, label: "Resolved", value: SUMMARY.resolved },
  ];

  return (
    <div className="space-y-5">
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

        {/* WATERMARK — this is the student's own archive of filings */}
        <div
          aria-hidden="true"
          className="lls-display pointer-events-none select-none absolute -top-6 right-2 sm:right-6 text-[90px] sm:text-[140px] lg:text-[180px] font-black leading-none tracking-tight"
          style={{
            color: darkMode ? "rgba(255,255,255,0.025)" : "rgba(10,10,12,0.025)",
            transform: "rotate(-6deg)",
          }}
        >
          MY ARCHIVE
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
              {/* BADGE — reframed as personal filings, not campus-wide activity */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className={`inline-flex items-center gap-3 border px-4 py-2 mb-5 ${
                  darkMode ? "bg-primary/10 border-primary/25 text-red-300" : "bg-red-50 border-red-200 text-primary-dark"
                }`}
              >
                <span className="relative flex w-2.5 h-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping bg-primary/60" />
                  <span className="relative inline-flex h-2.5 w-2.5 bg-primary" />
                </span>
                <span className="lls-mono text-[11px] font-semibold tracking-[0.15em] uppercase">
                  Personal Record — {SUMMARY.total} Filed
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
                  <Link
                    to="/student/report-issue"
                    className={`group relative overflow-hidden h-[52px] px-6 bg-primary text-white font-semibold flex items-center justify-center gap-3 shadow-[0_15px_40px_rgba(193,18,31,0.25)] ${focusRing}`}
                  >
                    <span className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-all duration-1000" />
                    File a New Report
                    <FiArrowUpRight />
                  </Link>
                </motion.div>

                <motion.div whileHover={shouldReduceMotion ? {} : { y: -2 }} whileTap={{ scale: 0.98 }}>
                  <a
                    href="#my-reports-list"
                    className={`h-[52px] px-6 border font-semibold transition-colors duration-300 flex items-center justify-center ${focusRing} ${
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

            {/* RIGHT PANEL — "Case File" status breakdown card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className={`relative border p-5 ${
                darkMode ? "bg-white/[0.03] border-white/10" : "bg-surface-light border-gray-200"
              }`}
            >
              {/* STAMP — appears once real data has loaded, not decorative filler */}
              <AnimatePresence>
                {!loading && (
                  <motion.div
                    initial={{ opacity: 0, scale: 1.4, rotate: -18 }}
                    animate={{ opacity: 0.8, scale: 1, rotate: -12 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="absolute top-4 right-4 flex items-center gap-1.5 border-2 border-primary text-primary px-2.5 py-1 pointer-events-none"
                  >
                    <FiFolder className="text-xs" />
                    <span className="lls-mono text-[10px] font-bold tracking-[0.15em]">ON FILE</span>
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
                  YOUR CASE FILE
                </p>
                <h3 className={`lls-display mt-2 text-2xl font-bold ${darkMode ? "text-white" : "text-gray-950"}`}>
                  Status Breakdown
                </h3>
              </div>

              {/* SCORE */}
              <div className="mt-7">
                <div className="flex items-end justify-between">
                  <div>
                    <h2 className={`lls-mono text-5xl font-semibold ${darkMode ? "text-white" : "text-gray-950"}`}>
                      {loading ? "—" : `${resolutionRate}%`}
                    </h2>
                    <p className={`mt-2 text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Resolution Rate</p>
                  </div>
                </div>

                {/* SEGMENTED METER — tally/ledger style, not a plain gradient bar */}
                <div className="mt-5 flex gap-[3px]" role="img" aria-label={`${resolutionRate}% resolution rate`}>
                  {Array.from({ length: totalTicks }).map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: shouldReduceMotion ? 0 : 0.8 + i * 0.02 }}
                      className={`h-3 flex-1 ${
                        i < filledTicks ? "bg-primary" : darkMode ? "bg-white/10" : "bg-gray-200"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* PERFORATION — dashed tear-line, ledger-stub cue */}
              <div className={`mt-6 border-t border-dashed ${darkMode ? "border-white/15" : "border-gray-300"}`} />

              {/* STATUS ROWS — replaces the generic AI field note with the actual breakdown */}
              <div className="mt-6 flex flex-col gap-2.5">
                {statusBreakdown.map((row, i) => (
                  <motion.div
                    key={row.label}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: shouldReduceMotion ? 0 : 0.9 + i * 0.08 }}
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
                    <span className={`text-[12.5px] font-bold ${darkMode ? "text-white" : "text-gray-950"}`}>
                      {row.value}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* STATUS TABS — unchanged filtering behavior, restyled to sit under the hero */}
      <div className={`flex items-center gap-1 border-b ${darkMode ? "border-white/10" : "border-gray-200"} overflow-x-auto scrollbar-none`}>
        {STATUS_TABS.map((tab) => {
          const isActive = activeStatus === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveStatus(tab.key)}
              className={`relative shrink-0 flex items-center gap-2 px-4 py-3 text-[12.5px] font-bold transition-colors duration-200 ${
                isActive ? (darkMode ? "text-white" : "text-gray-950") : darkMode ? "text-gray-500 hover:text-gray-300" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {tab.label}
              <span
                className={`text-[10.5px] font-black px-1.5 py-0.5 ${
                  isActive ? "bg-primary text-white" : darkMode ? "bg-white/[0.06] text-gray-500" : "bg-gray-100 text-gray-400"
                }`}
              >
                {tab.count}
              </span>
              {isActive && (
                <motion.div layoutId="myReportsTab" className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary" transition={{ duration: 0.2 }} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MyReportsHeader;