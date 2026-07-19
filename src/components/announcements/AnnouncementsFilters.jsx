import { motion } from "framer-motion";
import { FiTool, FiShield, FiFileText, FiBookOpen, FiMessageSquare } from "react-icons/fi";

const CATEGORIES = [
  { key: "All", icon: null },
  { key: "Maintenance", icon: <FiTool size={13} /> },
  { key: "Safety", icon: <FiShield size={13} /> },
  { key: "Policy", icon: <FiFileText size={13} /> },
  { key: "Academic", icon: <FiBookOpen size={13} /> },
  { key: "General", icon: <FiMessageSquare size={13} /> },
];

const AnnouncementsFilters = ({ darkMode, activeCategory, setActiveCategory }) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
      {CATEGORIES.map((cat) => {
        const isActive = activeCategory === cat.key;
        return (
          <motion.button
            key={cat.key}
            whileTap={{ scale: 0.96 }}
            onClick={() => setActiveCategory(cat.key)}
            className={`flex items-center gap-1.5 shrink-0 px-3.5 py-1.5 text-[12px] font-semibold whitespace-nowrap border transition-colors duration-200 ${
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
  );
};

export default AnnouncementsFilters;