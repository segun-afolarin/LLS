import { motion } from "framer-motion";
import { FiSearch, FiHome, FiMonitor, FiShield, FiDroplet, FiZap, FiBook, FiHeart, FiMessageSquare, FiAlertTriangle } from "react-icons/fi";

const CATEGORIES = [
  { key: "All", icon: null },
  { key: "Hostel", icon: <FiHome size={13} /> },
  { key: "Portal/ICT", icon: <FiMonitor size={13} /> },
  { key: "Security", icon: <FiShield size={13} /> },
  { key: "Water", icon: <FiDroplet size={13} /> },
  { key: "Electricity", icon: <FiZap size={13} /> },
  { key: "Library", icon: <FiBook size={13} /> },
  { key: "Medical", icon: <FiHeart size={13} /> },
  { key: "Harassment", icon: <FiAlertTriangle size={13} /> },
  { key: "General", icon: <FiMessageSquare size={13} /> },
];

const SORT_OPTIONS = [
  { key: "recent", label: "Most Recent" },
  { key: "urgent", label: "Most Urgent" },
  { key: "closest", label: "Closest to Verified" },
];

const FeedFilters = ({ darkMode, activeCategory, setActiveCategory, activeSort, setActiveSort, search, setSearch }) => {
  return (
    <div
      className={`sticky top-[74px] md:top-[78px] z-20 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-3 border-b backdrop-blur-xl ${
        darkMode ? "bg-[#0A0A0C]/90 border-white/10" : "bg-surface-light/90 border-gray-200"
      }`}
    >
      <div className="max-w-[1100px] mx-auto space-y-3">
        {/* SEARCH + SORT ROW */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div
            className={`flex-1 flex items-center gap-2.5 h-10 px-3.5 border transition-colors duration-150 ${
              darkMode ? "bg-white/[0.03] border-white/10 focus-within:border-primary/40" : "bg-white border-gray-200 focus-within:border-primary/40"
            }`}
          >
            <FiSearch className={darkMode ? "text-gray-500" : "text-gray-400"} size={14} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search reports by title or location..."
              className={`flex-1 bg-transparent text-sm outline-none ${darkMode ? "text-white placeholder:text-gray-600" : "text-gray-950 placeholder:text-gray-400"}`}
            />
          </div>

          <select
            value={activeSort}
            onChange={(e) => setActiveSort(e.target.value)}
            className={`h-10 px-3.5 border text-[13px] font-semibold outline-none shrink-0 ${
              darkMode ? "bg-white/[0.03] border-white/10 text-gray-200" : "bg-white border-gray-200 text-gray-700"
            }`}
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.key} value={opt.key}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* CATEGORY CHIPS */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.key;
            return (
              <motion.button
                key={cat.key}
                whileTap={{ scale: 0.96 }}
                onClick={() => setActiveCategory(cat.key)}
                className={`relative flex items-center gap-1.5 shrink-0 px-3.5 py-1.5 text-[12px] font-semibold whitespace-nowrap border transition-colors duration-200 ${
                  isActive
                    ? "bg-primary border-primary text-white"
                    : darkMode
                    ? "border-white/10 text-gray-400 hover:border-white/25 hover:text-white"
                    : "border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-900"
                }`}
              >
                {cat.icon}
                {cat.key}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FeedFilters;