import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import {
  FiHome,
  FiMonitor,
  FiShield,
  FiDroplet,
  FiZap,
  FiBook,
  FiHeart,
  FiMessageSquare,
  FiAlertTriangle,
  FiMapPin,
} from "react-icons/fi";

/*
  FRONTEND-ONLY NOTE
  -------------------
  No backend yet. MOCK_CAMPUS stands in for GET /api/campus/overview,
  scoped server-side to the authenticated student's campus. The category
  breakdown numbers below are illustrative — swap for the real per-campus
  counts once that endpoint exists. Keep the shape (name, count, icon key)
  the same so this component doesn't need restructuring later.
*/

const CATEGORY_ICONS = {
  Hostel: <FiHome />,
  "Portal/ICT": <FiMonitor />,
  Security: <FiShield />,
  Water: <FiDroplet />,
  Electricity: <FiZap />,
  Library: <FiBook />,
  Medical: <FiHeart />,
  Harassment: <FiAlertTriangle />,
  General: <FiMessageSquare />,
};

const MOCK_CAMPUS = {
  name: "Abuja",
  totalReports: 342,
  activeStudents: 1284,
  categories: [
    { name: "Hostel", count: 96 },
    { name: "Portal/ICT", count: 74 },
    { name: "Water", count: 58 },
    { name: "Electricity", count: 41 },
    { name: "Security", count: 33 },
    { name: "Library", count: 19 },
    { name: "General", count: 12 },
    { name: "Medical", count: 6 },
    { name: "Harassment", count: 3 },
  ],
};

// Lightweight count-up — no extra deps, respects isInView so it only
// fires once the section is actually on screen.
const useCountUp = (target, isInView, duration = 900) => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = null;
    let frame;

    const step = (ts) => {
      if (start === null) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) frame = requestAnimationFrame(step);
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [isInView, target, duration]);

  return value;
};

const CategoryRow = ({ category, rank, maxCount, total, darkMode, isInView, delay }) => {
  const pct = Math.round((category.count / maxCount) * 100);
  const share = ((category.count / total) * 100).toFixed(1);

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.4, delay }}
      className="group flex items-center gap-3.5 py-2.5"
    >
      <span
        className={`w-5 shrink-0 text-[11px] font-bold tabular-nums ${
          darkMode ? "text-gray-600 group-hover:text-primary" : "text-gray-300 group-hover:text-primary"
        } transition-colors`}
      >
        {String(rank).padStart(2, "0")}
      </span>

      <div
        className={`w-8 h-8 shrink-0 flex items-center justify-center text-[14px] ${
          darkMode ? "bg-white/[0.05] text-gray-300" : "bg-surface-light text-gray-600"
        }`}
      >
        {CATEGORY_ICONS[category.name] || <FiMessageSquare />}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1.5">
          <span className={`text-[12.5px] font-semibold ${darkMode ? "text-gray-200" : "text-gray-700"}`}>
            {category.name}
          </span>
          <span className="flex items-baseline gap-1.5">
            <span className={`text-[12px] font-bold tabular-nums ${darkMode ? "text-white" : "text-gray-950"}`}>
              {category.count}
            </span>
            <span className={`text-[10px] font-medium tabular-nums ${darkMode ? "text-gray-600" : "text-gray-400"}`}>
              {share}%
            </span>
          </span>
        </div>
        <div className={`h-[5px] overflow-hidden ${darkMode ? "bg-white/10" : "bg-gray-100"}`}>
          <motion.div
            initial={{ width: 0 }}
            animate={isInView ? { width: `${pct}%` } : {}}
            transition={{ duration: 0.8, delay: delay + 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="h-full bg-primary"
          />
        </div>
      </div>
    </motion.div>
  );
};

const CampusOverview = ({ darkMode }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const campus = MOCK_CAMPUS;
  const maxCount = Math.max(...campus.categories.map((c) => c.count));
  const topCategory = campus.categories[0];

  const reportsCount = useCountUp(campus.totalReports, isInView);
  const studentsCount = useCountUp(campus.activeStudents, isInView, 1100);

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className={`border ${darkMode ? "bg-[#0A0A0C] border-white/10" : "bg-white border-gray-200"} shadow-subtle`}
    >
      {/* HEADER */}
      <div className={`flex items-center justify-between px-5 sm:px-6 py-5 border-b ${darkMode ? "border-white/10" : "border-gray-200"}`}>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 flex items-center justify-center ${darkMode ? "bg-white/[0.05] text-white" : "bg-surface-light text-primary"}`}>
            <FiMapPin className="text-[16px]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className={`text-[15px] font-black tracking-tight ${darkMode ? "text-white" : "text-gray-950"}`}>
                {campus.name} Campus Overview
              </h2>
              <span className="relative flex items-center">
                <span className="absolute w-1.5 h-1.5 bg-primary rounded-full animate-ping opacity-75" />
                <span className="w-1.5 h-1.5 bg-primary rounded-full" />
              </span>
            </div>
            <p className={`mt-0.5 text-[12px] ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
              {studentsCount.toLocaleString()} students reporting this term
            </p>
          </div>
        </div>

        <div className="hidden sm:block text-right shrink-0">
          <p className={`text-2xl font-black tabular-nums ${darkMode ? "text-white" : "text-gray-950"}`}>
            {reportsCount}
          </p>
          <p className={`text-[11px] font-semibold uppercase tracking-wide ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
            Total reports
          </p>
        </div>
      </div>

      {/* BODY */}
      <div className="px-5 sm:px-6 py-4">
        {campus.categories.map((category, index) => (
          <CategoryRow
            key={category.name}
            category={category}
            rank={index + 1}
            maxCount={maxCount}
            total={campus.totalReports}
            darkMode={darkMode}
            isInView={isInView}
            delay={0.15 + index * 0.06}
          />
        ))}
      </div>

      {/* FOOTER — one grounded takeaway, not another stat wall */}
      <div className={`px-5 sm:px-6 py-4 border-t flex items-center gap-3 ${darkMode ? "border-white/10 bg-white/[0.02]" : "border-gray-100 bg-surface-light"}`}>
        <span className="w-1.5 h-1.5 bg-primary shrink-0" />
        <p className={`text-[12.5px] leading-snug ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
          <span className={`font-bold ${darkMode ? "text-white" : "text-gray-950"}`}>{topCategory.name}</span> is the
          most reported category on {campus.name} campus this term, accounting for{" "}
          <span className={`font-bold ${darkMode ? "text-white" : "text-gray-950"}`}>
            {((topCategory.count / campus.totalReports) * 100).toFixed(1)}%
          </span>{" "}
          of all {campus.totalReports} reports.
        </p>
      </div>
    </motion.section>
  );
};

export default CampusOverview;