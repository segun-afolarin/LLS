import { useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
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
  FiEdit2,
  FiTrash2,
  FiX,
  FiLoader,
} from "react-icons/fi";
import Toggle from "../common/Toggle";

/*
  FRONTEND-ONLY NOTE
  -------------------
  No backend yet. MOCK_CATEGORIES stands in for GET /api/admin/categories,
  scoped to this campus. Toggling "active" and deleting update local
  state only — swap for real PATCH/DELETE calls once the backend exists.
  reportCount is read-only here since it's derived from actual reports,
  not something an admin edits directly.
*/

export const ICON_OPTIONS = [
  { key: "Hostel", icon: <FiHome /> },
  { key: "Portal/ICT", icon: <FiMonitor /> },
  { key: "Security", icon: <FiShield /> },
  { key: "Water", icon: <FiDroplet /> },
  { key: "Electricity", icon: <FiZap /> },
  { key: "Library", icon: <FiBook /> },
  { key: "Medical", icon: <FiHeart /> },
  { key: "Harassment", icon: <FiAlertTriangle /> },
  { key: "General", icon: <FiMessageSquare /> },
];

const ICON_MAP = Object.fromEntries(ICON_OPTIONS.map((o) => [o.key, o.icon]));

export const MOCK_CATEGORIES = [
  { id: 1, name: "Hostel", reportCount: 96, active: true },
  { id: 2, name: "Portal/ICT", reportCount: 74, active: true },
  { id: 3, name: "Water", reportCount: 58, active: true },
  { id: 4, name: "Electricity", reportCount: 41, active: true },
  { id: 5, name: "Security", reportCount: 33, active: true },
  { id: 6, name: "Library", reportCount: 19, active: true },
  { id: 7, name: "General", reportCount: 12, active: true },
  { id: 8, name: "Medical", reportCount: 6, active: true },
  { id: 9, name: "Harassment", reportCount: 3, active: true },
];

/* ------------------------------------------------------------------ */
/* DELETE CONFIRM MODAL — portal-rendered, warns about report count    */
/* so admins understand what deleting actually affects, not just a     */
/* generic "are you sure?"                                             */
/* ------------------------------------------------------------------ */

const DeleteCategoryModal = ({ category, darkMode, onCancel, onConfirm, deleting }) => {
  const hasReports = category.reportCount > 0;

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && !deleting && onCancel()}
    >
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.96 }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
        className={`w-full max-w-sm border overflow-hidden ${darkMode ? "bg-[#0A0A0C] border-white/10" : "bg-white border-gray-200"}`}
      >
        <div className="h-[3px] w-full bg-primary" />

        <div className="p-6 sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <motion.div
              initial={{ scale: 0, rotate: -15 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 16, delay: 0.1 }}
              className="w-12 h-12 shrink-0 bg-primary/10 border border-primary/25 flex items-center justify-center"
            >
              <FiTrash2 className="text-primary" size={19} />
            </motion.div>
            <button
              onClick={onCancel}
              disabled={deleting}
              className={`p-1.5 disabled:opacity-40 ${darkMode ? "text-gray-500 hover:text-white" : "text-gray-400 hover:text-black"}`}
            >
              <FiX size={18} />
            </button>
          </div>

          <h3 className={`mt-5 text-lg font-black ${darkMode ? "text-white" : "text-gray-950"}`}>
            Delete "{category.name}"?
          </h3>

          <p className={`mt-2 text-sm leading-relaxed ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            This category will no longer appear as an option when students file a report. This can't be undone.
          </p>

          {hasReports && (
            <div className={`mt-4 flex items-start gap-2.5 border p-3 ${darkMode ? "bg-primary/10 border-primary/25" : "bg-red-50 border-red-200"}`}>
              <FiAlertTriangle className="text-primary shrink-0 mt-0.5" size={14} />
              <p className={`text-[12px] leading-relaxed ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                <span className="font-bold">
                  {category.reportCount} existing {category.reportCount === 1 ? "report" : "reports"}
                </span>{" "}
                are already filed under this category and will keep their history only new reports lose this option.
              </p>
            </div>
          )}

          <div className="mt-6 flex flex-col-reverse sm:flex-row gap-3">
            <button
              onClick={onCancel}
              disabled={deleting}
              className={`flex-1 py-3 text-xs font-black uppercase tracking-[0.15em] border transition-colors disabled:opacity-50 ${
                darkMode ? "border-white/10 text-gray-300 hover:bg-white/[0.05]" : "border-gray-200 text-gray-700 hover:bg-gray-50"
              }`}
            >
              No, keep it
            </button>
            <button
              onClick={onConfirm}
              disabled={deleting}
              className="flex-1 py-3 text-xs font-black uppercase tracking-[0.15em] text-white bg-primary hover:bg-primary-dark transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {deleting ? (
                <>
                  <FiLoader className="animate-spin" size={13} /> Deleting...
                </>
              ) : (
                "Yes, delete"
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>,
    document.body
  );
};

const CategoryRow = ({ category, index, darkMode, onToggleActive, onEdit, onRequestDelete }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      className={`flex items-center gap-4 p-4 sm:p-5 border ${darkMode ? "bg-[#0A0A0C] border-white/10" : "bg-white border-gray-200"} ${
        !category.active ? "opacity-60" : ""
      }`}
    >
      <div className={`w-10 h-10 shrink-0 flex items-center justify-center text-[16px] ${darkMode ? "bg-white/[0.05] text-gray-200" : "bg-surface-light text-gray-700"}`}>
        {ICON_MAP[category.name] || <FiMessageSquare />}
      </div>

      <div className="flex-1 min-w-0">
        <p className={`text-[14px] font-bold ${darkMode ? "text-white" : "text-gray-950"}`}>{category.name}</p>
        <p className={`mt-0.5 text-[11.5px] font-medium ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
          {category.reportCount} {category.reportCount === 1 ? "report" : "reports"} filed
        </p>
      </div>

      <div className="hidden sm:flex items-center gap-2 shrink-0">
        <span className={`text-[11px] font-semibold ${darkMode ? "text-gray-500" : "text-gray-400"}`}>{category.active ? "Active" : "Hidden"}</span>
        <Toggle checked={category.active} onChange={() => onToggleActive(category.id)} darkMode={darkMode} />
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={() => onEdit(category)}
          className={`w-9 h-9 flex items-center justify-center transition-colors duration-150 ${
            darkMode ? "text-gray-400 hover:text-white hover:bg-white/[0.06]" : "text-gray-500 hover:text-gray-900 hover:bg-surface-light"
          }`}
          aria-label="Edit category"
        >
          <FiEdit2 size={14} />
        </button>
        <button
          onClick={() => onRequestDelete(category)}
          className={`w-9 h-9 flex items-center justify-center transition-colors duration-150 ${
            darkMode ? "text-gray-400 hover:text-red-300 hover:bg-primary/10" : "text-gray-500 hover:text-primary hover:bg-red-50"
          }`}
          aria-label="Delete category"
        >
          <FiTrash2 size={14} />
        </button>
      </div>
    </motion.div>
  );
};

const CategoryList = ({ categories, darkMode, onToggleActive, onEdit, onDelete }) => {
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    // Simulated delete delay — swap for a real DELETE /api/admin/categories/:id
    // once the backend exists.
    await new Promise((resolve) => setTimeout(resolve, 600));
    onDelete(deleteTarget.id);
    setDeleting(false);
    setDeleteTarget(null);
  };

  return (
    <div id="category-list" className="scroll-mt-24 flex flex-col gap-3">
      <AnimatePresence mode="popLayout">
        {categories.map((category, i) => (
          <CategoryRow
            key={category.id}
            category={category}
            index={i}
            darkMode={darkMode}
            onToggleActive={onToggleActive}
            onEdit={onEdit}
            onRequestDelete={setDeleteTarget}
          />
        ))}
      </AnimatePresence>

      {categories.length === 0 && (
        <div className={`border p-14 text-center ${darkMode ? "bg-[#0A0A0C] border-white/10" : "bg-white border-gray-200"}`}>
          <p className={`text-[14px] font-bold ${darkMode ? "text-white" : "text-gray-950"}`}>No categories yet</p>
          <p className={`mt-1.5 text-[12.5px] ${darkMode ? "text-gray-500" : "text-gray-400"}`}>Add one to get started.</p>
        </div>
      )}

      {/* DELETE CONFIRM MODAL */}
      <AnimatePresence>
        {deleteTarget && (
          <DeleteCategoryModal
            category={deleteTarget}
            darkMode={darkMode}
            onCancel={() => !deleting && setDeleteTarget(null)}
            onConfirm={handleConfirmDelete}
            deleting={deleting}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default CategoryList;