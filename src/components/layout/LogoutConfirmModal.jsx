import { motion, AnimatePresence } from "framer-motion";
import { FiLogOut, FiX } from "react-icons/fi";

/*
  FRONTEND-ONLY NOTE
  -------------------
  No backend yet. MOCK_STUDENT_NAME stands in for the authenticated
  student's first name (from useAuth() once auth exists). onConfirm
  below clears local storage and navigates to "/" — swap for a real
  session-invalidation call to the backend first, then redirect.
*/
const MOCK_STUDENT_NAME = "Sarah";

const LogoutConfirmModal = ({ open, onCancel, onConfirm, darkMode }) => {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* BACKDROP */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onCancel}
            className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
          />

          {/* MODAL */}
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 12 }}
              transition={{ type: "spring", stiffness: 340, damping: 26 }}
              className={`relative w-full max-w-sm pointer-events-auto border overflow-hidden ${
                darkMode ? "bg-[#0A0A0C] border-white/10" : "bg-white border-gray-200"
              } shadow-elevated`}
            >
              {/* top accent */}
              <div className="h-[3px] w-full bg-primary" />

              <button
                onClick={onCancel}
                className={`absolute top-4 right-4 w-8 h-8 flex items-center justify-center transition-colors duration-150 ${
                  darkMode ? "text-gray-500 hover:text-white hover:bg-white/[0.06]" : "text-gray-400 hover:text-gray-900 hover:bg-gray-100"
                }`}
                aria-label="Cancel"
              >
                <FiX size={16} />
              </button>

              <div className="p-7 sm:p-8 text-center">
                {/* ICON — a door-out motif, animated pop-in */}
                <motion.div
                  initial={{ scale: 0, rotate: -15 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 16, delay: 0.1 }}
                  className="w-16 h-16 mx-auto bg-primary text-white flex items-center justify-center text-2xl mb-6"
                >
                  <FiLogOut />
                </motion.div>

                <h2 className={`text-xl font-black tracking-tight ${darkMode ? "text-white" : "text-gray-950"}`}>
                  {MOCK_STUDENT_NAME}, are you sure you want to leave?
                </h2>
                <p className={`mt-2.5 text-[13px] leading-relaxed ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                  You'll need to sign back in to file reports, confirm issues, or check on the ones you've already submitted.
                </p>

                <div className="mt-7 flex flex-col-reverse sm:flex-row gap-3">
                  <button
                    onClick={onCancel}
                    className={`flex-1 h-11 font-bold text-[13px] border transition-colors duration-200 ${
                      darkMode
                        ? "border-white/10 text-gray-200 hover:bg-white/[0.05]"
                        : "border-gray-200 text-gray-700 hover:bg-surface-light"
                    }`}
                  >
                    Take Me Back
                  </button>
                  <button
                    onClick={onConfirm}
                    className="flex-1 h-11 bg-primary text-white font-bold text-[13px] hover:bg-primary-dark transition-colors duration-200"
                  >
                    I'm Sure, Log Out
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default LogoutConfirmModal;