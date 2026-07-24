import { motion } from "framer-motion";
import { FiSearch } from "react-icons/fi";

const DEPARTMENTS = ["All", "Facilities", "ICT", "Security", "Health Center", "Student Affairs"];

const StaffDirectoryFilters = ({ darkMode, activeDepartment, setActiveDepartment, search, setSearch }) => {
  return (
    <div className="space-y-3">
      <div
        className={`flex items-center gap-2.5 h-10 px-3.5 border transition-colors duration-150 ${
          darkMode ? "bg-white/[0.03] border-white/10 focus-within:border-primary/40" : "bg-white border-gray-200 focus-within:border-primary/40"
        }`}
      >
        <FiSearch className={darkMode ? "text-gray-500" : "text-gray-400"} size={14} />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search staff by name or role..."
          className={`flex-1 bg-transparent text-sm outline-none ${darkMode ? "text-white placeholder:text-gray-600" : "text-gray-950 placeholder:text-gray-400"}`}
        />
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {DEPARTMENTS.map((dept) => {
          const isActive = activeDepartment === dept;
          return (
            <motion.button
              key={dept}
              whileTap={{ scale: 0.96 }}
              onClick={() => setActiveDepartment(dept)}
              className={`shrink-0 px-3.5 py-1.5 text-[12px] font-semibold whitespace-nowrap border transition-colors duration-200 ${
                isActive
                  ? "bg-primary border-primary text-white"
                  : darkMode
                  ? "border-white/10 text-gray-400 hover:border-white/25 hover:text-white"
                  : "border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-900"
              }`}
            >
              {dept}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default StaffDirectoryFilters;