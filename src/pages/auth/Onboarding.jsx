import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiMapPin, FiCheck, FiArrowRight, FiUsers } from "react-icons/fi";

/*
  FRONTEND-ONLY NOTE
  -------------------
  No backend yet. handleContinue below simply navigates to the student
  dashboard. Once the backend exists, POST the selected campus to
  /api/profile/campus (or include it in registration) before routing
  onward — this is the one piece of setup a new student must complete
  before anything else makes sense, since every other page is scoped
  to "the student's own campus." CAMPUS_STATS mirrors the mock numbers
  used elsewhere in the app (342 filed, 261 resolved) — swap for a
  real GET /api/platform/stats once that endpoint exists.
*/

const CAMPUSES = [
  { key: "Abuja", desc: "Main campus, Federal Capital Territory", students: "4,200+" },
  { key: "Nasarawa", desc: "Nasarawa State campus", students: "2,600+" },
  { key: "Gombe", desc: "Gombe State campus", students: "1,900+" },
];

const Onboarding = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);
  const [continuing, setContinuing] = useState(false);

  const handleContinue = async () => {
    if (!selected) return;
    setContinuing(true);
    await new Promise((r) => setTimeout(r, 700));
    navigate("/student/dashboard");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-surface-light p-5 sm:p-6">
      {/* Font import — move to index.html for production */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Zilla+Slab:wght@600;700;900&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
        .lls-display { font-family: 'Zilla Slab', ui-serif, Georgia, serif; }
        .lls-mono { font-family: 'IBM Plex Mono', ui-monospace, SFMono-Regular, monospace; }
      `}</style>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* HEADER CARD — dark, on-brand, same grid+glow language as Login */}
        <div className="relative overflow-hidden bg-[#0A0A0C] px-6 pt-8 pb-7 mb-5">
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage: "linear-gradient(to right, #DD1B22 1px, transparent 1px), linear-gradient(to bottom, #DD1B22 1px, transparent 1px)",
              backgroundSize: "36px 36px",
            }}
          />
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.14, 0.24, 0.14] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-6 -right-6 w-48 h-48 bg-primary/25 blur-[70px] pointer-events-none"
          />
          <motion.div
            animate={{ y: [0, -10, 0], rotate: [0, 6, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[18%] right-[10%] text-primary/20 pointer-events-none"
          >
            <FiMapPin size={30} />
          </motion.div>

          <div className="relative z-10 text-center">
            {/* BADGE */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 border border-primary/25 bg-primary/10 px-3 py-1.5 mb-4"
            >
              <span className="relative flex w-1.5 h-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping bg-primary/60" />
                <span className="relative inline-flex h-1.5 w-1.5 bg-primary" />
              </span>
              <span className="lls-mono text-[10px] font-semibold tracking-[0.14em] uppercase text-red-300">
                Final Step Before Dashboard
              </span>
            </motion.div>

            <h1 className="lls-display text-3xl font-black tracking-tight text-primary leading-none">LLS</h1>

            <p className="lls-display mt-3 text-xl font-black text-white leading-tight">Which campus are you on?</p>

            {/* LETTERHEAD RULE */}
            <div className="mt-3 mx-auto w-14">
              <div className="h-[3px] bg-primary" />
              <div className="h-px mt-1 bg-white/20" />
            </div>

            <p className="mt-4 text-[13px] text-gray-400 leading-relaxed max-w-xs mx-auto">
              This determines which reports, announcements, and feed you'll see. You can't change this later without
              contacting your registrar.
            </p>
          </div>
        </div>

        {/* CAMPUS OPTIONS */}
        <div className="space-y-3">
          {CAMPUSES.map((campus, i) => {
            const isSelected = selected === campus.key;
            return (
              <motion.button
                key={campus.key}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 + i * 0.08 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelected(campus.key)}
                className={`relative w-full flex items-center gap-4 p-4 border text-left transition-colors duration-200 ${
                  isSelected ? "bg-primary border-primary text-white" : "bg-white border-gray-200 text-gray-950 hover:border-gray-300"
                }`}
              >
                <div className={`relative w-11 h-11 shrink-0 flex items-center justify-center ${isSelected ? "bg-white/15" : "bg-surface-light text-primary"}`}>
                  {isSelected && (
                    <motion.span
                      initial={{ scale: 0.6, opacity: 0.6 }}
                      animate={{ scale: 1.6, opacity: 0 }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      className="absolute inset-0 bg-white/40"
                    />
                  )}
                  <FiMapPin size={17} />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-[14.5px] font-bold">{campus.key} Campus</p>
                  <p className={`text-[12px] mt-0.5 ${isSelected ? "text-white/80" : "text-gray-400"}`}>{campus.desc}</p>
                  <p className={`lls-mono mt-1.5 flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-[0.08em] ${isSelected ? "text-white/70" : "text-gray-400"}`}>
                    <FiUsers size={11} />
                    {campus.students} students
                  </p>
                </div>

                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0, rotate: -90 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0, rotate: 90 }}
                      transition={{ type: "spring", stiffness: 400, damping: 20 }}
                      className="shrink-0"
                    >
                      <FiCheck size={19} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}
        </div>

        <motion.button
          onClick={handleContinue}
          disabled={!selected || continuing}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          whileHover={selected ? { y: -1 } : {}}
          whileTap={selected ? { scale: 0.98 } : {}}
          className="group relative overflow-hidden w-full h-14 sm:h-12 mt-7 bg-primary text-white font-bold text-[14px] sm:text-[13.5px] flex items-center justify-center gap-2 hover:bg-primary-dark transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_15px_40px_rgba(193,18,31,0.2)]"
        >
          {selected && !continuing && (
            <span className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
          )}
          {continuing ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white animate-spin" /> Setting up
            </>
          ) : (
            <>
              Continue to Dashboard <FiArrowRight size={15} />
            </>
          )}
        </motion.button>

        <p className="mt-5 text-center text-[11.5px] text-gray-400">
          Joining <span className="font-bold text-gray-600">{selected || "a"}</span> campus with thousands of other students already on LLS.
        </p>
      </motion.div>
    </div>
  );
};

export default Onboarding;