import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  FiArrowUpRight,
  FiActivity,
  FiTrendingUp,
  FiTrendingDown,
  FiZap,
  FiFileText,
  FiCheckCircle,
} from "react-icons/fi";

/*
  FRONTEND-ONLY NOTE
  -------------------
  No backend/auth connected yet. MOCK_USER and MOCK_STATS stand in for
  useAuth() and a future GET /api/reports/stats call. Once the backend
  exists, swap:
    - MOCK_USER          -> const { user } = useAuth();
    - MOCK_STATS/loading -> fetch from the real stats endpoint, same shape
  Field names below (totalReports, resolved, resolvedGrowth, topCategory,
  totalGrowth) are kept identical to the eventual API response so this
  component won't need restructuring later — only the data source changes.

  FONT NOTE
  ---------
  This design uses Zilla Slab (headline) and IBM Plex Mono (data/labels).
  The <style> import below is a drop-in convenience — for production,
  move the @import into your index.html <head> (or Tailwind's font stack)
  instead of injecting it at runtime, for better load performance.
*/

const MOCK_USER = {
  name: "Afolarin Segun",
  is_new_user: false,
  campus: "Abuja",
};

const MOCK_STATS = {
  totalReports: 342,
  resolved: 261,
  resolvedGrowth: 12,
  topCategory: "Hostel maintenance",
  totalGrowth: 8,
};

const formatCompact = (n) => {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return `${n}`;
};

const DashboardHero = ({ darkMode }) => {
  const user = MOCK_USER;
  const shouldReduceMotion = useReducedMotion();

  const rawName = user?.name?.trim();
  const firstName = rawName ? rawName.split(" ")[0] : "Student";
  const displayName = firstName.charAt(0).toUpperCase() + firstName.slice(1);

  const isNewUser = !!user?.is_new_user;

  const campusName = user?.campus?.trim() || "your campus";
  const campusCode =
    (user?.campus || "LLS").replace(/[^a-zA-Z]/g, "").slice(0, 3).toUpperCase() || "LLS";

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    // Simulated fetch delay so loading states render correctly once wired
    // to a real endpoint — remove the timeout, keep the shape.
    const t = setTimeout(() => {
      setStats(MOCK_STATS);
      setLoading(false);
    }, 400);
    return () => clearTimeout(t);
  }, []);

  const totalReports = stats?.totalReports ?? 0;
  const resolved = stats?.resolved ?? 0;
  const resolvedGrowth = stats?.resolvedGrowth ?? 0;
  const topCategory = stats?.topCategory;
  const totalGrowth = stats?.totalGrowth ?? 0;

  const responseRate = totalReports > 0 ? Math.round((resolved / totalReports) * 100) : 0;

  const displayCompact = (n) => (loading ? "—" : formatCompact(n));
  const displayPercent = (n) => (loading ? "—%" : `${n}%`);

  const statsTiles = [
    { title: "Filed", value: displayCompact(totalReports) },
    { title: "Resolved", value: displayCompact(resolved) },
    { title: "Response", value: displayPercent(responseRate) },
  ];

  const fileNumber = `LLS-${campusCode}-${String(totalReports).padStart(6, "0")}`;

  const aiInsightText =
    topCategory && totalGrowth !== 0
      ? `${topCategory} reports ${totalGrowth >= 0 ? "rose" : "fell"} ${Math.abs(totalGrowth)}% on ${campusName} campus this week.`
      : topCategory
      ? `${topCategory} is the most reported issue on ${campusName} campus this week.`
      : `LLS is watching for emerging issues across ${campusName} campus.`;

 const heroContent = [
  {
    title1: isNewUser ? "Welcome, Afolarin Segun" : "Welcome Back,",
    title2: isNewUser ? "Let's Improve Campus Together" : displayName,
    paragraph: isNewUser
      ? "Welcome to LLS, Afolarin Segun. Every report you submit helps create a safer, cleaner, and more efficient campus. Together, we can solve problems faster and improve the university experience for every student."
      : `Welcome back, ${displayName}. Keep making a positive impact in ${campusName} by tracking your reports, sharing new concerns, and helping build a better campus community.`,
  },
  {
    title1: "Lincoln Needs",
    title2: "Your Voice",
    paragraph:
      "The university can only fix what it knows about. Every report you share tells Lincoln exactly what needs attention next, so speak up and help shape what happens on campus.",
  },
  {
    title1: "Every Issue",
    title2: "Becomes a Record",
    paragraph:
      "Whether it's a damaged classroom, hostel issue, portal error, or security concern, every report is securely recorded and tracked until the right department takes action.",
  },
  {
    title1: "Stronger",
    title2: "Together",
    paragraph:
      "When students confirm reports, they become stronger and more credible. Your collective voice helps the university identify urgent problems and respond more effectively.",
  },
  {
    title1: "Your Voice",
    title2: "Creates Change",
    paragraph:
      "Every improvement begins with someone choosing to speak up. Your report today could create a safer, better learning environment for thousands of students tomorrow.",
  },
  {
    title1: "From Report",
    title2: "to Resolution",
    paragraph:
      "Stay informed every step of the way. Track your reports in real time, receive updates, and know exactly when your issue has been resolved.",
  },
];
  const [currentHero, setCurrentHero] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHero((prev) => (prev === heroContent.length - 1 ? 0 : prev + 1));
    }, 9000);
    return () => clearInterval(interval);
  }, []);

  const focusRing = darkMode
    ? "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0C]"
    : "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-white";

  // Segmented response-rate meter: 20 ticks, ledger/tally style instead of a plain gradient bar.
  const totalTicks = 20;
  const filledTicks = loading ? 0 : Math.round((responseRate / 100) * totalTicks);

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

      {/* WATERMARK — "on the record" ghost type, the quiet signature of the page */}
      <div
        aria-hidden="true"
        className="lls-display pointer-events-none select-none absolute -top-6 right-2 sm:right-6 text-[90px] sm:text-[140px] lg:text-[180px] font-black leading-none tracking-tight"
        style={{
          color: darkMode ? "rgba(255,255,255,0.025)" : "rgba(10,10,12,0.025)",
          transform: "rotate(-6deg)",
        }}
      >
        ON RECORD
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
            {/* BADGE — reframed as an active file status, not a generic "live" pill */}
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
                Active File — {campusName} Campus
              </span>
            </motion.div>

            {/* TITLE */}
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
                      transition={{ delay: currentHero === 0 ? 0.5 : 0.1 }}
                      className="block"
                    >
                      {heroContent[currentHero].title1}
                    </motion.span>

                    <motion.span
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: currentHero === 0 ? 1.2 : 0.3 }}
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
                    transition={{ delay: currentHero === 0 ? 1.8 : 0.5 }}
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
              transition={{ delay: 0.5 }}
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
              transition={{ delay: 0.6 }}
              className="mt-7 flex flex-col sm:flex-row gap-4"
            >
              <motion.div whileHover={shouldReduceMotion ? {} : { y: -2 }} whileTap={{ scale: 0.98 }}>
                <Link
                  to="/report-issue"
                  className={`group relative overflow-hidden h-[52px] px-6 bg-primary text-white font-semibold flex items-center justify-center gap-3 shadow-[0_15px_40px_rgba(193,18,31,0.25)] ${focusRing}`}
                >
                  <span className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-all duration-1000" />
                  File a Report
                  <FiArrowUpRight />
                </Link>
              </motion.div>

              <motion.div whileHover={shouldReduceMotion ? {} : { y: -2 }} whileTap={{ scale: 0.98 }}>
                <Link
                  to="/my-reports"
                  className={`h-[52px] px-6 border font-semibold transition-colors duration-300 flex items-center justify-center ${focusRing} ${
                    darkMode
                      ? "border-white/10 bg-white/[0.03] text-white hover:bg-white/[0.05]"
                      : "border-gray-200 bg-surface-light text-gray-950 hover:bg-white"
                  }`}
                >
                  View My Reports
                </Link>
              </motion.div>
            </motion.div>
          </div>

          {/* RIGHT PANEL — "Case File" analytics card */}
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
                  <FiCheckCircle className="text-xs" />
                  <span className="lls-mono text-[10px] font-bold tracking-[0.15em]">VERIFIED</span>
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
                {loading ? "FILE NO. —" : `FILE NO. ${fileNumber}`}
              </p>
              <h3 className={`lls-display mt-2 text-2xl font-bold ${darkMode ? "text-white" : "text-gray-950"}`}>
                Campus Impact
              </h3>
            </div>

            {/* SCORE */}
            <div className="mt-7">
              <div className="flex items-end justify-between">
                <div>
                  <h2 className={`lls-mono text-5xl font-semibold ${darkMode ? "text-white" : "text-gray-950"}`}>
                    {loading ? "—" : `${responseRate}%`}
                  </h2>
                  <p className={`mt-2 text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                    Response Efficiency
                  </p>
                </div>
                <div
                  className={`lls-mono flex items-center gap-1.5 text-sm font-semibold ${
                    resolvedGrowth >= 0 ? "text-emerald-600" : "text-primary"
                  }`}
                >
                  {resolvedGrowth >= 0 ? <FiTrendingUp /> : <FiTrendingDown />}
                  {loading ? "—" : `${resolvedGrowth >= 0 ? "+" : ""}${resolvedGrowth}%`}
                </div>
              </div>

              {/* SEGMENTED METER — tally/ledger style, not a plain gradient bar */}
              <div className="mt-5 flex gap-[3px]" role="img" aria-label={`${responseRate}% response efficiency`}>
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
            <div
              className={`mt-6 border-t border-dashed ${darkMode ? "border-white/15" : "border-gray-300"}`}
            />

            {/* AI CARD — reframed as a field note, not a generic gradient callout */}
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
                  Field Note
                </h4>
                <p className={`mt-1.5 text-sm leading-relaxed ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                  {loading ? "Analyzing recent activity…" : aiInsightText}
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default DashboardHero;