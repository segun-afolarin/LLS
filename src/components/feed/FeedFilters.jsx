import { motion } from "framer-motion";
import {
  FiSearch, FiChevronDown, FiHome, FiMonitor, FiShield, FiDroplet, FiZap,
  FiBook, FiHeart, FiMessageSquare, FiAlertTriangle,
} from "react-icons/fi";

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
        <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3">
          <div
            className={`flex-1 flex items-center gap-3 h-14 sm:h-11 px-4 sm:px-3.5 border transition-colors duration-150 ${
              darkMode ? "bg-white/[0.03] border-white/10 focus-within:border-primary/40" : "bg-white border-gray-200 focus-within:border-primary/40"
            }`}
          >
            <FiSearch className={`shrink-0 sm:hidden ${darkMode ? "text-gray-500" : "text-gray-400"}`} size={18} />
            <FiSearch className={`shrink-0 hidden sm:block ${darkMode ? "text-gray-500" : "text-gray-400"}`} size={14} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search title or location..."
              /* text-base (16px) on mobile prevents iOS Safari's
                 auto-zoom-on-focus; sm:text-sm restores the tighter
                 desktop size once that bug no longer applies. */
              className={`flex-1 min-w-0 bg-transparent text-base sm:text-sm font-medium sm:font-normal outline-none ${darkMode ? "text-white placeholder:text-gray-600" : "text-gray-950 placeholder:text-gray-400"}`}
            />
          </div>

          {/* Custom-chevron select wrapper — a bare <select> at full width
              still renders the OS's own arrow glyph, which sits inside our
              padding inconsistently across iOS/Android/desktop browsers.
              appearance-none + our own FiChevronDown keeps it uniform. */}
          <div className="relative w-full sm:w-auto shrink-0">
            <select
              value={activeSort}
              onChange={(e) => setActiveSort(e.target.value)}
              className={`w-full sm:w-auto h-14 sm:h-11 pl-4 sm:pl-3.5 pr-9 border text-base sm:text-[13px] font-semibold outline-none appearance-none ${
                darkMode ? "bg-white/[0.03] border-white/10 text-gray-200" : "bg-white border-gray-200 text-gray-700"
              }`}
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.key} value={opt.key}>
                  {opt.label}
                </option>
              ))}
            </select>
            <FiChevronDown
              size={14}
              className={`pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 ${darkMode ? "text-gray-500" : "text-gray-400"}`}
            />
          </div>
        </div>

        {/* CATEGORY CHIPS */}
        <div className="relative -mx-4 sm:mx-0 px-4 sm:px-0">
          <div
            className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none snap-x snap-proximity"
            style={{
              // Fades the row's edges so it's visually obvious there's more
              // to scroll on mobile, without needing arrow buttons.
              WebkitMaskImage: "linear-gradient(to right, transparent 0, black 16px, black calc(100% - 16px), transparent 100%)",
              maskImage: "linear-gradient(to right, transparent 0, black 16px, black calc(100% - 16px), transparent 100%)",
            }}
          >
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.key;
              return (
                <motion.button
                  key={cat.key}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setActiveCategory(cat.key)}
                  className={`relative flex items-center gap-1.5 shrink-0 snap-start px-3.5 py-1.5 text-[12px] font-semibold whitespace-nowrap border transition-colors duration-200 ${
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
    </div>
  );
};

export default FeedFilters;