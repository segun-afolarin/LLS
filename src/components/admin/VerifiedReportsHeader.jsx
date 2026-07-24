import { motion } from "framer-motion";
import { FiCheckSquare } from "react-icons/fi";

/*
  FRONTEND-ONLY NOTE
  -------------------
  No backend yet. SUMMARY stands in for a real aggregate derived from
  GET /api/admin/verified-reports. Once wired up, compute these counts
  from the same fetched list VerifiedReportsTable uses instead of
  hardcoding them.
*/
const SUMMARY = { total: 18, inProgress: 7, resolved: 11 };

const STATUS_TABS = [
  { key: "all", label: "All", count: SUMMARY.total },
  { key: "in-progress", label: "In Progress", count: SUMMARY.inProgress },
  { key: "resolved", label: "Resolved", count: SUMMARY.resolved },
];

const VerifiedReportsHeader = ({ darkMode, activeStatus, setActiveStatus }) => {
  return (
    <div className="space-y-5">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-start gap-4"
      >
        <div className="w-12 h-12 shrink-0 bg-primary text-white flex items-center justify-center text-lg">
          <FiCheckSquare />
        </div>
        <div>
          <h1 className={`text-[22px] sm:text-[26px] font-black tracking-tight leading-none ${darkMode ? "text-white" : "text-gray-950"}`}>
            Verified Reports
          </h1>
          <p className={`mt-2 text-[13px] leading-relaxed ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            Reports you've verified, tracked from department assignment through to resolution.
          </p>
        </div>
      </motion.div>

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
                className={`text-[10.5px] font-black px-1.5 py-0.5 font-mono ${
                  isActive ? "bg-primary text-white" : darkMode ? "bg-white/[0.06] text-gray-500" : "bg-gray-100 text-gray-400"
                }`}
              >
                {tab.count}
              </span>
              {isActive && (
                <motion.div layoutId="verifiedReportsTab" className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary" transition={{ duration: 0.2 }} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default VerifiedReportsHeader;