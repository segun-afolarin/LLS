import { motion, AnimatePresence } from "framer-motion";
import { FiTool, FiShield, FiFileText, FiBookOpen, FiMessageSquare, FiEdit2, FiTrash2 } from "react-icons/fi";
import { BsPinAngleFill, BsPin } from "react-icons/bs";

/*
  FRONTEND-ONLY NOTE
  -------------------
  No backend yet. MOCK_ADMIN_ANNOUNCEMENTS stands in for GET
  /api/admin/announcements, scoped to this campus. Edit/Delete/Pin
  update local state at the page level — swap for real PATCH/DELETE
  calls once the backend exists.
*/

const CATEGORY_CFG = {
  Maintenance: { icon: <FiTool />, tone: "gray" },
  Safety: { icon: <FiShield />, tone: "primary" },
  Policy: { icon: <FiFileText />, tone: "gray" },
  Academic: { icon: <FiBookOpen />, tone: "emerald" },
  General: { icon: <FiMessageSquare />, tone: "gray" },
};

const TONE_CFG = {
  gray: { light: "bg-gray-100 text-gray-600 border-gray-200", dark: "bg-white/10 text-gray-300 border-white/15" },
  primary: { light: "bg-red-50 text-primary-dark border-red-200", dark: "bg-primary/10 text-red-300 border-primary/25" },
  emerald: { light: "bg-emerald-50 text-emerald-700 border-emerald-200", dark: "bg-emerald-500/10 text-emerald-400 border-emerald-500/25" },
};

export const MOCK_ADMIN_ANNOUNCEMENTS = [
  {
    id: 1, pinned: true, category: "Safety",
    title: "Campus-wide security patrol schedule update", date: "Today",
    body: "Evening patrol routes have been expanded to cover all three hostel blocks between 9pm and 5am, following recent security reports filed through LLS.",
  },
  {
    id: 2, pinned: true, category: "Maintenance",
    title: "Water supply interruption — Female Hostel, Wing B", date: "Today",
    body: "Scheduled pipe repair will affect water supply in Wing B tomorrow between 8am and 2pm. Alternative water points will be available at the ground floor common room.",
  },
  {
    id: 3, pinned: false, category: "Policy",
    title: "Updated guest policy for hostel visitors", date: "3 days ago",
    body: "All hostel guests must now be registered at the gate before 8pm, with valid ID required. This applies to all three campuses.",
  },
  {
    id: 4, pinned: false, category: "General",
    title: "Library extended hours during exam period", date: "1 week ago",
    body: "The main library will remain open until midnight daily throughout the exam period, starting next Monday.",
  },
];

const AnnouncementRow = ({ announcement, index, darkMode, onEdit, onDelete, onTogglePin }) => {
  const cfg = CATEGORY_CFG[announcement.category] || CATEGORY_CFG.General;
  const tone = TONE_CFG[cfg.tone];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={`border ${darkMode ? "bg-[#0A0A0C] border-white/10" : "bg-white border-gray-200"} shadow-subtle`}
    >
      <div className="p-4 sm:p-5">
        <div className="flex items-start gap-3.5">
          <div className={`w-10 h-10 shrink-0 flex items-center justify-center text-[16px] ${darkMode ? "bg-white/[0.05] text-gray-200" : "bg-surface-light text-gray-700"}`}>
            {cfg.icon}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              {announcement.pinned && (
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 border text-[10px] font-black tracking-wide uppercase ${darkMode ? "bg-primary/10 border-primary/25 text-red-300" : "bg-red-50 border-red-200 text-primary-dark"}`}>
                  <BsPinAngleFill size={9} /> Pinned
                </span>
              )}
              <span className={`inline-flex items-center px-2 py-0.5 border text-[10px] font-black tracking-[0.08em] uppercase ${darkMode ? tone.dark : tone.light}`}>
                {announcement.category}
              </span>
              <span className={`text-[11px] ${darkMode ? "text-gray-600" : "text-gray-400"}`}>{announcement.date}</span>
            </div>

            <h3 className={`text-[14px] font-bold leading-snug ${darkMode ? "text-white" : "text-gray-950"}`}>{announcement.title}</h3>
            <p className={`mt-1.5 text-[12.5px] leading-relaxed ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{announcement.body}</p>
          </div>
        </div>

        <div className={`flex items-center gap-2 mt-4 pt-4 border-t ${darkMode ? "border-white/[0.06]" : "border-gray-100"}`}>
          <button
            onClick={() => onTogglePin(announcement.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-[11.5px] font-bold border transition-colors duration-150 ${
              darkMode ? "border-white/10 text-gray-300 hover:bg-white/[0.05]" : "border-gray-200 text-gray-600 hover:bg-surface-light"
            }`}
          >
            {announcement.pinned ? <BsPinAngleFill size={11} /> : <BsPin size={11} />}
            {announcement.pinned ? "Unpin" : "Pin"}
          </button>
          <button
            onClick={() => onEdit(announcement)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-[11.5px] font-bold border transition-colors duration-150 ${
              darkMode ? "border-white/10 text-gray-300 hover:bg-white/[0.05]" : "border-gray-200 text-gray-600 hover:bg-surface-light"
            }`}
          >
            <FiEdit2 size={11} /> Edit
          </button>
          <button
            onClick={() => onDelete(announcement.id)}
            className={`ml-auto flex items-center gap-1.5 px-3 py-1.5 text-[11.5px] font-bold border transition-colors duration-150 ${
              darkMode ? "border-primary/25 text-red-300 hover:bg-primary/10" : "border-red-200 text-primary hover:bg-red-50"
            }`}
          >
            <FiTrash2 size={11} /> Delete
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const AdminAnnouncementsList = ({ announcements, darkMode, onEdit, onDelete, onTogglePin }) => {
  const sorted = [...announcements].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));

  if (sorted.length === 0) {
    return (
      <div className={`border p-14 text-center ${darkMode ? "bg-[#0A0A0C] border-white/10" : "bg-white border-gray-200"}`}>
        <p className={`text-[14px] font-bold ${darkMode ? "text-white" : "text-gray-950"}`}>No announcements yet</p>
        <p className={`mt-1.5 text-[12.5px] ${darkMode ? "text-gray-500" : "text-gray-400"}`}>Compose one to notify students on your campus.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3.5">
      <AnimatePresence mode="popLayout">
        {sorted.map((a, i) => (
          <AnnouncementRow key={a.id} announcement={a} index={i} darkMode={darkMode} onEdit={onEdit} onDelete={onDelete} onTogglePin={onTogglePin} />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default AdminAnnouncementsList;