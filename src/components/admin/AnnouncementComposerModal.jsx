import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiSend } from "react-icons/fi";

const CATEGORIES = ["Maintenance", "Safety", "Policy", "Academic", "General"];

const AnnouncementComposerModal = ({ open, darkMode, editingAnnouncement, onClose, onSave }) => {
  const isEditing = !!editingAnnouncement;

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [body, setBody] = useState("");
  const [pinned, setPinned] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setTitle(editingAnnouncement?.title ?? "");
      setCategory(editingAnnouncement?.category ?? CATEGORIES[0]);
      setBody(editingAnnouncement?.body ?? "");
      setPinned(editingAnnouncement?.pinned ?? false);
      setError("");
    }
  }, [open, editingAnnouncement]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) {
      setError("Both a title and message body are required.");
      return;
    }

    onSave({
      id: editingAnnouncement?.id ?? Date.now(),
      title: title.trim(),
      category,
      body: body.trim(),
      pinned,
      date: editingAnnouncement?.date ?? "Today",
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
              initial={{ opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", stiffness: 340, damping: 26 }}
              className={`relative w-full max-w-lg pointer-events-auto border overflow-hidden ${
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

              <form onSubmit={handleSubmit} className="p-6 sm:p-7 max-h-[85vh] overflow-y-auto">
                <h2 className={`text-lg font-black tracking-tight ${darkMode ? "text-white" : "text-gray-950"}`}>
                  {isEditing ? "Edit Announcement" : "Compose Announcement"}
                </h2>
                <p className={`mt-1.5 text-[12.5px] ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                  This will appear in the Announcements feed for every student on your campus.
                </p>

                <div className="mt-6 space-y-4">
                  <div>
                    <label className={`block text-[11.5px] font-bold uppercase tracking-wide mb-2 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                      Title
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => {
                        setTitle(e.target.value);
                        setError("");
                      }}
                      placeholder="e.g. Water supply interruption this weekend"
                      className={`w-full h-11 px-4 border text-sm outline-none transition-colors duration-150 ${
                        darkMode
                          ? "bg-white/[0.03] border-white/10 text-white placeholder:text-gray-600 focus:border-primary/50"
                          : "bg-white border-gray-200 text-gray-950 placeholder:text-gray-400 focus:border-primary/50"
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`block text-[11.5px] font-bold uppercase tracking-wide mb-2 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                      Category
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {CATEGORIES.map((cat) => {
                        const isSelected = category === cat;
                        return (
                          <button
                            type="button"
                            key={cat}
                            onClick={() => setCategory(cat)}
                            className={`px-3.5 py-1.5 text-[12px] font-semibold border transition-colors duration-150 ${
                              isSelected
                                ? "bg-primary border-primary text-white"
                                : darkMode
                                ? "border-white/10 text-gray-400 hover:border-white/25"
                                : "border-gray-200 text-gray-500 hover:border-gray-300"
                            }`}
                          >
                            {cat}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className={`block text-[11.5px] font-bold uppercase tracking-wide mb-2 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                      Message
                    </label>
                    <textarea
                      rows={5}
                      value={body}
                      onChange={(e) => {
                        setBody(e.target.value);
                        setError("");
                      }}
                      placeholder="Write the full announcement students will see..."
                      className={`w-full px-4 py-3 border text-sm outline-none resize-none transition-colors duration-150 ${
                        darkMode
                          ? "bg-white/[0.03] border-white/10 text-white placeholder:text-gray-600 focus:border-primary/50"
                          : "bg-white border-gray-200 text-gray-950 placeholder:text-gray-400 focus:border-primary/50"
                      }`}
                    />
                  </div>

                  <label className="flex items-center gap-2.5 cursor-pointer select-none">
                    <input type="checkbox" checked={pinned} onChange={(e) => setPinned(e.target.checked)} className="w-4 h-4 accent-primary" />
                    <span className={`text-[12.5px] font-semibold ${darkMode ? "text-gray-300" : "text-gray-700"}`}>Pin to top of feed</span>
                  </label>

                  {error && <p className="text-[12px] font-semibold text-primary">{error}</p>}
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
                    <FiSend size={13} /> {isEditing ? "Save Changes" : "Publish"}
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

export default AnnouncementComposerModal;