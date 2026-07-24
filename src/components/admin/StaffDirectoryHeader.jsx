import { motion } from "framer-motion";
import { FiUsers, FiPlus } from "react-icons/fi";

const StaffDirectoryHeader = ({ darkMode, onAddStaff }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 shrink-0 bg-primary text-white flex items-center justify-center text-lg">
          <FiUsers />
        </div>
        <div>
          <h1 className={`text-[22px] sm:text-[26px] font-black tracking-tight leading-none ${darkMode ? "text-white" : "text-gray-950"}`}>
            Staff Directory
          </h1>
          <p className={`mt-2 text-[13px] leading-relaxed ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            The staff you assign verified reports to, organized by department.
          </p>
        </div>
      </div>

      <button
        onClick={onAddStaff}
        className="shrink-0 flex items-center gap-2 h-11 px-5 bg-primary text-white text-[13px] font-bold hover:bg-primary-dark transition-colors duration-200"
      >
        <FiPlus size={15} /> Add Staff
      </button>
    </motion.div>
  );
};

export default StaffDirectoryHeader;