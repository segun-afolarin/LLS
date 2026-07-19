import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { FiHome, FiMonitor, FiShield, FiDroplet, FiZap, FiBook, FiHeart, FiMessageSquare, FiAlertTriangle } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

/*
  FRONTEND-ONLY NOTE
  -------------------
  No backend yet. MOCK_CATEGORIES stands in for GET /api/admin/categories,
  scoped to this admin's campus. Clicking a category navigates to the
  Report Queue pre-filtered to that category — a drill-down capability
  that only makes sense in the admin context (students browse, admins
  triage by category).
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

const MOCK_CATEGORIES = [
  { name: "Hostel", count: 96 },
  { name: "Portal/ICT", count: 74 },
  { name: "Water", count: 58 },
  { name: "Electricity", count: 41 },
  { name: "Security", count: 33 },
  { name: "Library", count: 19 },
  { name: "General", count: 12 },
  { name: "Medical", count: 6 },
  { name: "Harassment", count: 3 },
];

const CategoryBreakdownAdmin = ({ darkMode }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(null);

  const maxCount = Math.max(...MOCK_CATEGORIES.map((c) => c.count));

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className={`border ${darkMode ? "bg-[#0A0A0C] border-white/10" : "bg-white border-gray-200"} shadow-subtle`}
    >
      <div className={`px-5 py-4 border-b ${darkMode ? "border-white/10" : "border-gray-200"}`}>
        <h2 className={`text-[14px] font-black tracking-tight ${darkMode ? "text-white" : "text-gray-950"}`}>Reports by Category</h2>
        <p className={`mt-0.5 text-[11.5px] ${darkMode ? "text-gray-500" : "text-gray-400"}`}>Click a category to filter the Report Queue</p>
      </div>

      <div className="p-5">
        {MOCK_CATEGORIES.map((category, index) => {
          const pct = Math.round((category.count / maxCount) * 100);
          const isHovered = hovered === category.name;

          return (
            <button
              key={category.name}
              onClick={() => navigate(`/admin/report-queue?category=${encodeURIComponent(category.name)}`)}
              onMouseEnter={() => setHovered(category.name)}
              onMouseLeave={() => setHovered(null)}
              className="w-full flex items-center gap-3.5 py-2.5 text-left group"
            >
              <div
                className={`w-8 h-8 shrink-0 flex items-center justify-center text-[14px] transition-colors duration-150 ${
                  isHovered ? "bg-primary text-white" : darkMode ? "bg-white/[0.05] text-gray-300" : "bg-surface-light text-gray-600"
                }`}
              >
                {CATEGORY_ICONS[category.name] || <FiMessageSquare />}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-[12.5px] font-semibold transition-colors duration-150 ${isHovered ? "text-primary" : darkMode ? "text-gray-200" : "text-gray-700"}`}>
                    {category.name}
                  </span>
                  <span className={`text-[12px] font-bold tabular-nums ${darkMode ? "text-white" : "text-gray-950"}`}>{category.count}</span>
                </div>
                <div className={`h-[5px] overflow-hidden ${darkMode ? "bg-white/10" : "bg-gray-100"}`}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={isInView ? { width: `${pct}%` } : {}}
                    transition={{ duration: 0.7, delay: 0.1 + index * 0.05 }}
                    className={`h-full transition-colors duration-150 ${isHovered ? "bg-primary-dark" : "bg-primary"}`}
                  />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
};

export default CategoryBreakdownAdmin;