import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiSave } from "react-icons/fi";
import { ICON_OPTIONS } from "./CategoryList";

/*
  FRONTEND-ONLY NOTE
  -------------------
  No backend yet. onSave below is called with the finished category
  object — the parent page (CategoryManager) is responsible for adding
  it to or updating it in the shared categories list. Swap for a real
  POST/PATCH /api/admin/categories call at that call site once the
  backend exists; this modal's shape won't need to change.
*/

const CategoryFormModal = ({ open, darkMode, editingCategory, onClose, onSave }) => {
  const isEditing = !!editingCategory;

  const [name, setName] = useState("");
  const [iconKey, setIconKey] = useState(ICON_OPTIONS[0].key);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setName(editingCategory?.name ?? "");
      setIconKey(editingCategory?.name ?? ICON_OPTIONS[0].key);
      setError("");
    }
  }, [open, editingCategory]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Give this category a name.");
      return;
    }

    onSave({
      id: editingCategory?.id ?? Date.now(),
      name: name.trim(),
      reportCount: editingCategory?.reportCount ?? 0,
      active: editingCategory?.active ?? true,
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
          />

          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 10 }}
              transition={{ type: "spring", stiffness: 340, damping: 26 }}
              className={`relative w-full max-w-md pointer-events-auto border overflow-hidden ${
                darkMode ? "bg-[#0A0A0C] border-white/10" : "bg-white border-gray-200"
              } shadow-elevated`}
            >
              <div className="h-[3px] w-full bg-primary" />

              <button
                onClick={onClose}
                className={`absolute top-4 right-4 w-8 h-8 flex items-center justify-center transition-colors duration-150 ${
                  darkMode ? "text-gray-500 hover:text-white hover:bg-white/[0.06]" : "text-gray-400 hover:text-gray-900 hover:bg-gray-100"
                }`}
                aria-label="Close"
              >
                <FiX size={16} />
              </button>

              <form onSubmit={handleSubmit} className="p-6 sm:p-7">
                <h2 className={`text-lg font-black tracking-tight ${darkMode ? "text-white" : "text-gray-950"}`}>
                  {isEditing ? "Edit Category" : "Add Category"}
                </h2>
                <p className={`mt-1.5 text-[12.5px] ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                  {isEditing ? "Update this category's name or icon." : "Create a new category students can report under."}
                </p>

                <div className="mt-6">
                  <label className={`block text-[11.5px] font-bold uppercase tracking-wide mb-2 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                    Category Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setError("");
                    }}
                    placeholder="e.g. Transport"
                    className={`w-full h-11 px-4 border text-sm outline-none transition-colors duration-150 ${
                      darkMode
                        ? "bg-white/[0.03] border-white/10 text-white placeholder:text-gray-600 focus:border-primary/50"
                        : "bg-white border-gray-200 text-gray-950 placeholder:text-gray-400 focus:border-primary/50"
                    }`}
                  />
                  {error && <p className="mt-1.5 text-[12px] font-semibold text-primary">{error}</p>}
                </div>

                <div className="mt-5">
                  <label className={`block text-[11.5px] font-bold uppercase tracking-wide mb-2.5 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                    Icon
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {ICON_OPTIONS.map((opt) => {
                      const isSelected = iconKey === opt.key;
                      return (
                        <button
                          type="button"
                          key={opt.key}
                          onClick={() => setIconKey(opt.key)}
                          className={`h-11 flex items-center justify-center text-[16px] border transition-colors duration-150 ${
                            isSelected
                              ? "bg-primary border-primary text-white"
                              : darkMode
                              ? "border-white/10 text-gray-400 hover:border-white/25"
                              : "border-gray-200 text-gray-500 hover:border-gray-300"
                          }`}
                          aria-label={opt.key}
                        >
                          {opt.icon}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-7 flex gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className={`flex-1 h-11 font-bold text-[13px] border transition-colors duration-200 ${
                      darkMode ? "border-white/10 text-gray-200 hover:bg-white/[0.05]" : "border-gray-200 text-gray-700 hover:bg-surface-light"
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 h-11 flex items-center justify-center gap-2 bg-primary text-white font-bold text-[13px] hover:bg-primary-dark transition-colors duration-200"
                  >
                    <FiSave size={13} /> {isEditing ? "Save Changes" : "Add Category"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CategoryFormModal;