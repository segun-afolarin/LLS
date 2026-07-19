import { motion } from "framer-motion";
import { FiFileText, FiUsers, FiZap, FiShield, FiAward, FiLock } from "react-icons/fi";

/*
  FRONTEND-ONLY NOTE
  -------------------
  No backend yet. MOCK_BADGES stands in for a real achievements endpoint,
  derived server-side from the student's report/confirmation history.
  Unlock thresholds are illustrative — tune once real usage data exists.
*/
const MOCK_BADGES = [
  { key: "first-report", label: "First Report", desc: "Filed your first campus report", icon: <FiFileText />, unlocked: true },
  { key: "community-voice", label: "Community Voice", desc: "Confirmed 25+ reports", icon: <FiUsers />, unlocked: true },
  { key: "fast-responder", label: "Fast Responder", desc: "Confirmed a report within 10 minutes", icon: <FiZap />, unlocked: true },
  { key: "safety-first", label: "Safety First", desc: "Filed a verified security report", icon: <FiShield />, unlocked: false },
  { key: "top-contributor", label: "Top Contributor", desc: "Reached top 10% on your campus", icon: <FiAward />, unlocked: false },
];

const Badge = ({ badge, index, darkMode }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: index * 0.08, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -3 }}
      className="group relative flex flex-col items-center text-center"
    >
      <div
        className={`w-14 h-14 flex items-center justify-center text-xl mb-2.5 transition-all duration-300 ${
          badge.unlocked
            ? "bg-primary text-white shadow-[0_8px_20px_rgba(221,27,34,0.25)]"
            : darkMode
            ? "bg-white/[0.05] text-gray-600"
            : "bg-gray-100 text-gray-300"
        }`}
      >
        {badge.unlocked ? badge.icon : <FiLock size={16} />}
      </div>
      <p className={`text-[11px] font-bold leading-tight ${badge.unlocked ? (darkMode ? "text-white" : "text-gray-950") : darkMode ? "text-gray-600" : "text-gray-400"}`}>
        {badge.label}
      </p>

      {/* tooltip on hover — intentionally dark regardless of theme, for contrast */}
      <div className="absolute -bottom-2 translate-y-full opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none z-20 w-40">
        <div className="bg-[#111827] text-white text-[11px] font-medium leading-snug px-3 py-2 shadow-elevated">
          {badge.desc}
        </div>
      </div>
    </motion.div>
  );
};

const ProfileBadges = ({ darkMode }) => {
  const unlockedCount = MOCK_BADGES.filter((b) => b.unlocked).length;

  return (
    <div className={`border ${darkMode ? "bg-[#0A0A0C] border-white/10" : "bg-white border-gray-200"} shadow-subtle`}>
      <div className={`flex items-center justify-between px-5 py-4 border-b ${darkMode ? "border-white/10" : "border-gray-200"}`}>
        <div>
          <h2 className={`text-[14px] font-black tracking-tight ${darkMode ? "text-white" : "text-gray-950"}`}>Achievements</h2>
          <p className={`mt-1 text-[11.5px] ${darkMode ? "text-gray-500" : "text-gray-400"}`}>Recognition for helping your campus</p>
        </div>
        <span className={`text-[11px] font-bold px-2 py-1 shrink-0 ${darkMode ? "bg-white/[0.06] text-gray-400" : "bg-surface-light text-gray-500"}`}>
          {unlockedCount}/{MOCK_BADGES.length}
        </span>
      </div>

      <div className="p-5 grid grid-cols-3 sm:grid-cols-5 gap-4">
        {MOCK_BADGES.map((badge, i) => (
          <Badge key={badge.key} badge={badge} index={i} darkMode={darkMode} />
        ))}
      </div>
    </div>
  );
};

export default ProfileBadges;