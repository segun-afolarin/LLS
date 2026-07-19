import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { FiFileText, FiCheckCircle, FiUsers, FiAward } from "react-icons/fi";

/*
  FRONTEND-ONLY NOTE
  -------------------
  No backend yet. MOCK_ACTIVITY stands in for a per-student aggregate
  endpoint. monthlyActivity powers the mini bar chart below — swap for
  real monthly counts once available.
*/
const MOCK_ACTIVITY = {
  reportsFiled: 9,
  confirmationsGiven: 34,
  resolutionRate: 78,
  contributorRank: "Top 12%",
  monthlyActivity: [3, 5, 2, 8, 6, 9, 4, 7, 10, 6, 8, 11],
};

const StatTile = ({ icon, value, label, darkMode }) => (
  <div className={`border p-4 ${darkMode ? "bg-white/[0.02] border-white/10" : "bg-white border-gray-200"}`}>
    <div className={`w-8 h-8 flex items-center justify-center mb-3 ${darkMode ? "bg-white/[0.05] text-gray-300" : "bg-surface-light text-primary"}`}>
      {icon}
    </div>
    <p className={`text-xl font-black tabular-nums ${darkMode ? "text-white" : "text-gray-950"}`}>{value}</p>
    <p className={`mt-1 text-[11px] font-medium ${darkMode ? "text-gray-500" : "text-gray-400"}`}>{label}</p>
  </div>
);

const ProfileStats = ({ darkMode }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const data = MOCK_ACTIVITY;
  const max = Math.max(...data.monthlyActivity);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className={`border ${darkMode ? "bg-[#0A0A0C] border-white/10" : "bg-white border-gray-200"} shadow-subtle`}
    >
      <div className={`px-5 py-4 border-b ${darkMode ? "border-white/10" : "border-gray-200"}`}>
        <h2 className={`text-[14px] font-black tracking-tight ${darkMode ? "text-white" : "text-gray-950"}`}>Your Contribution</h2>
        <p className={`mt-1 text-[11.5px] ${darkMode ? "text-gray-500" : "text-gray-400"}`}>How you've helped LLS this term</p>
      </div>

      <div className="p-5 grid grid-cols-2 gap-3">
        <StatTile icon={<FiFileText size={14} />} value={data.reportsFiled} label="Reports Filed" darkMode={darkMode} />
        <StatTile icon={<FiUsers size={14} />} value={data.confirmationsGiven} label="Confirmations Given" darkMode={darkMode} />
        <StatTile icon={<FiCheckCircle size={14} />} value={`${data.resolutionRate}%`} label="Resolution Rate" darkMode={darkMode} />
        <StatTile icon={<FiAward size={14} />} value={data.contributorRank} label="Campus Rank" darkMode={darkMode} />
      </div>

      {/* MINI ACTIVITY CHART */}
      <div className="px-5 pb-5">
        <p className={`text-[11px] font-bold uppercase tracking-wide mb-3 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>Monthly Activity</p>
        <div className="flex items-end gap-1.5 h-16">
          {data.monthlyActivity.map((v, i) => (
            <motion.div
              key={i}
              initial={{ height: 0 }}
              animate={isInView ? { height: `${(v / max) * 100}%` } : {}}
              transition={{ delay: 0.1 + i * 0.04, duration: 0.5, ease: "easeOut" }}
              className={`flex-1 ${i === data.monthlyActivity.length - 1 ? "bg-primary" : darkMode ? "bg-white/10" : "bg-gray-200"}`}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileStats;