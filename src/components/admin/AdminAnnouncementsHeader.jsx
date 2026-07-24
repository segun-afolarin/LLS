import { motion } from "framer-motion";
import { FiBell, FiEdit3 } from "react-icons/fi";

const AdminAnnouncementsHeader = ({ darkMode, onCompose }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 shrink-0 bg-primary text-white flex items-center justify-center text-lg">
          <FiBell />
        </div>
        <div>
          <h1 className={`text-[22px] sm:text-[26px] font-black tracking-tight leading-none ${darkMode ? "text-white" : "text-gray-950"}`}>
            Announcements
          </h1>
          <p className={`mt-2 text-[13px] leading-relaxed ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            Publish official updates to every student on your campus.
          </p>
        </div>
      </div>

      <button
        onClick={onCompose}
        className="shrink-0 flex items-center gap-2 h-11 px-5 bg-primary text-white text-[13px] font-bold hover:bg-primary-dark transition-colors duration-200"
      >
        <FiEdit3 size={14} /> Compose
      </button>
    </motion.div>
  );
};

export default AdminAnnouncementsHeader;