import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiUser, FiHash, FiLock, FiArrowRight, FiEye, FiEyeOff, FiMapPin, FiShield, FiZap } from "react-icons/fi";

/*
  FRONTEND-ONLY NOTE
  -------------------
  No backend yet. handleSubmit below simulates authentication with a
  short delay, then routes to /onboarding — the flow a first-time login
  should follow (campus setup) before ever reaching the dashboard.
  Once the backend exists:
    - POST { studentId, fullName, password } to /api/auth/login
    - If the response says onboarding is incomplete -> navigate("/onboarding")
    - Otherwise -> navigate("/student/dashboard")
  The form shape and validation below won't need to change.

  BRAND_STATS mirrors the mock numbers used on the dashboard hero
  (342 filed, 261 resolved) — swap for a real GET /api/platform/stats
  once that endpoint exists.
*/

const BRAND_STATS = [
  { label: "Reports Filed", value: "342" },
  { label: "Resolved", value: "261" },
  { label: "Campuses", value: "3" },
];

const ROTATING_WORDS = ["Reported.", "Confirmed.", "Resolved."];

const Login = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({ fullName: "", studentId: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev === ROTATING_WORDS.length - 1 ? 0 : prev + 1));
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: null }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.fullName.trim()) newErrors.fullName = "Enter your full name.";
    if (!form.studentId.trim()) newErrors.studentId = "Enter your student ID.";
    if (!form.password) newErrors.password = "Enter your password.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);

    // First-time login flow — route through onboarding before the dashboard.
    navigate("/onboarding");
  };

  const inputCls = (field) =>
    `flex-1 bg-transparent outline-none text-sm text-gray-950 placeholder:text-gray-400 ${errors[field] ? "" : ""}`;

  const fieldWrapCls = (field) =>
    `flex items-center gap-2.5 h-12 sm:h-11 px-4 border transition-all duration-200 bg-white ${
      errors[field]
        ? "border-primary"
        : "border-gray-200 focus-within:border-primary/60 focus-within:shadow-[0_0_0_3px_rgba(193,18,31,0.08)]"
    }`;

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-surface-light">
      {/* Font import — move to index.html for production */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Zilla+Slab:wght@600;700;900&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
        .lls-display { font-family: 'Zilla Slab', ui-serif, Georgia, serif; }
        .lls-mono { font-family: 'IBM Plex Mono', ui-monospace, SFMono-Regular, monospace; }
      `}</style>

      {/* LEFT — brand panel, desktop only */}
      <div className="hidden lg:flex lg:w-[46%] relative overflow-hidden bg-[#0A0A0C] items-center justify-center p-12">
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: "linear-gradient(to right, #DD1B22 1px, transparent 1px), linear-gradient(to bottom, #DD1B22 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none select-none absolute -bottom-10 -left-10 text-[220px] font-black leading-none tracking-tight text-white/[0.025]"
          style={{ transform: "rotate(-6deg)" }}
        >
          LLS
        </div>

        {/* GLOW */}
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.1, 0.18, 0.1] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-10 right-0 w-80 h-80 bg-primary/20 blur-[100px] pointer-events-none"
        />

        {/* FLOATING ICONS — subtle, drifting, on-brand */}
        <motion.div
          animate={{ y: [0, -16, 0], x: [0, 10, 0], rotate: [0, 6, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[16%] right-[14%] text-primary/20"
        >
          <FiMapPin size={38} />
        </motion.div>
        <motion.div
          animate={{ y: [0, 14, 0], x: [0, -8, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-[24%] right-[22%] text-primary/15"
        >
          <FiShield size={30} />
        </motion.div>
        <motion.div
          animate={{ y: [0, -10, 0], x: [0, 6, 0] }}
          transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="absolute top-[42%] right-[6%] text-primary/15"
        >
          <FiZap size={24} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 max-w-md"
        >
          {/* BADGE */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="inline-flex items-center gap-2.5 border border-primary/25 bg-primary/10 px-3.5 py-1.5 mb-6"
          >
            <span className="relative flex w-2 h-2">
              <span className="absolute inline-flex h-full w-full animate-ping bg-primary/60" />
              <span className="relative inline-flex h-2 w-2 bg-primary" />
            </span>
            <span className="lls-mono text-[10.5px] font-semibold tracking-[0.15em] uppercase text-red-300">
              Live Across 3 Campuses
            </span>
          </motion.div>

          <h1 className="lls-display text-[64px] font-black tracking-tight leading-none text-primary">LLS</h1>

          <div className="mt-3 min-h-[68px]">
            <p className="lls-display text-2xl font-black text-white leading-tight">
              Every campus issue,
              <br />
              <AnimatePresence mode="wait">
                <motion.span
                  key={wordIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                  className="inline-block text-primary"
                >
                  {ROTATING_WORDS[wordIndex]}
                </motion.span>
              </AnimatePresence>
            </p>
          </div>

          <p className="mt-5 text-[14px] text-gray-400 leading-relaxed">
            Report, confirm, and track infrastructure, security, and welfare issues across Lincoln University's Abuja, Nasarawa, and Gombe campuses.
          </p>

          {/* STAT STRIP */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-9 grid grid-cols-3 gap-3"
          >
            {BRAND_STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.08 }}
                className="border-t-2 border-primary border-x border-b border-x-white/10 border-b-white/10 bg-white/[0.03] px-3 py-3"
              >
                <p className="lls-mono text-lg font-semibold text-white">{stat.value}</p>
                <p className="lls-mono mt-0.5 text-[9.5px] uppercase tracking-[0.12em] text-gray-500">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>

          <div className="mt-8 flex items-center gap-6">
            {["Abuja", "Nasarawa", "Gombe"].map((campus, i) => (
              <motion.div
                key={campus}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 + i * 0.08 }}
                className="flex items-center gap-2"
              >
                <span className="w-1.5 h-1.5 bg-primary" />
                <span className="text-[12px] font-semibold text-gray-300">{campus}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* MOBILE HERO — most users are on phones, so this gets the same
          animated treatment as the desktop brand panel, just condensed */}
      <div className="lg:hidden relative overflow-hidden bg-[#0A0A0C] px-6 pt-10 pb-8">
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: "linear-gradient(to right, #DD1B22 1px, transparent 1px), linear-gradient(to bottom, #DD1B22 1px, transparent 1px)",
            backgroundSize: "36px 36px",
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none select-none absolute -bottom-6 -right-8 text-[140px] font-black leading-none tracking-tight text-white/[0.03]"
          style={{ transform: "rotate(-6deg)" }}
        >
          LLS
        </div>

        {/* GLOW */}
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.14, 0.24, 0.14] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-6 -right-6 w-52 h-52 bg-primary/25 blur-[70px] pointer-events-none"
        />

        {/* FLOATING ICONS — fewer than desktop, kept light for phone performance */}
        <motion.div
          animate={{ y: [0, -10, 0], rotate: [0, 6, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[14%] right-[10%] text-primary/25"
        >
          <FiMapPin size={26} />
        </motion.div>
        <motion.div
          animate={{ y: [0, 10, 0], rotate: [0, -6, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
          className="absolute bottom-[18%] right-[22%] text-primary/15"
        >
          <FiShield size={20} />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="relative z-10">
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
              Live Across 3 Campuses
            </span>
          </motion.div>

          <h1 className="lls-display text-4xl font-black tracking-tight leading-none text-primary">LLS</h1>

          <div className="mt-2 min-h-[34px]">
            <p className="lls-display text-lg font-black text-white leading-tight">
              Every campus issue,{" "}
              <AnimatePresence mode="wait">
                <motion.span
                  key={wordIndex}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35 }}
                  className="inline-block text-primary"
                >
                  {ROTATING_WORDS[wordIndex]}
                </motion.span>
              </AnimatePresence>
            </p>
          </div>

          {/* COMPACT STAT STRIP */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="mt-5 grid grid-cols-3 gap-2"
          >
            {BRAND_STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.06 }}
                className="border-t-2 border-primary border-x border-b border-x-white/10 border-b-white/10 bg-white/[0.04] px-2 py-2.5 text-center"
              >
                <p className="lls-mono text-sm font-semibold text-white">{stat.value}</p>
                <p className="lls-mono mt-0.5 text-[8px] uppercase tracking-[0.1em] text-gray-500">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* CAMPUS PILLS */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-4 flex items-center gap-2 flex-wrap"
          >
            {["Abuja", "Nasarawa", "Gombe"].map((campus) => (
              <div key={campus} className="flex items-center gap-1.5 border border-white/10 bg-white/[0.03] px-2.5 py-1">
                <span className="w-1 h-1 bg-primary" />
                <span className="text-[10.5px] font-semibold text-gray-300">{campus}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>


      <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-[420px]"
        >
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lls-display text-2xl font-black tracking-tight text-gray-950"
          >
            Welcome back
          </motion.h2>

          {/* LETTERHEAD RULE */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="mt-3 w-16 origin-left"
          >
            <div className="h-[3px] bg-primary" />
            <div className="h-px mt-1 bg-gray-300" />
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="mt-4 text-[13.5px] text-gray-500"
          >
            Sign in to continue reporting and tracking campus issues.
          </motion.p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <label className="block text-[11.5px] font-bold uppercase tracking-wide mb-2 text-gray-500">Full Name</label>
              <div className={fieldWrapCls("fullName")}>
                <FiUser className="text-gray-400" size={14} />
                <input
                  type="text"
                  value={form.fullName}
                  onChange={(e) => updateField("fullName", e.target.value)}
                  placeholder="e.g. Sarah Bello"
                  className={inputCls("fullName")}
                />
              </div>
              {errors.fullName && <p className="mt-1.5 text-[12px] font-semibold text-primary">{errors.fullName}</p>}
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.36 }}>
              <label className="block text-[11.5px] font-bold uppercase tracking-wide mb-2 text-gray-500">Student ID</label>
              <div className={fieldWrapCls("studentId")}>
                <FiHash className="text-gray-400" size={14} />
                <input
                  type="text"
                  value={form.studentId}
                  onChange={(e) => updateField("studentId", e.target.value)}
                  placeholder="e.g. LLS/CSC/22/4471"
                  className={inputCls("studentId")}
                />
              </div>
              {errors.studentId && <p className="mt-1.5 text-[12px] font-semibold text-primary">{errors.studentId}</p>}
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.42 }}>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[11.5px] font-bold uppercase tracking-wide text-gray-500">Password</label>
                <a href="#" className="text-[11.5px] font-bold text-primary hover:text-primary-dark transition-colors duration-150">
                  Forgot password?
                </a>
              </div>
              <div className={fieldWrapCls("password")}>
                <FiLock className="text-gray-400" size={14} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => updateField("password", e.target.value)}
                  placeholder="••••••••"
                  className={inputCls("password")}
                />
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.85 }}
                  onClick={() => setShowPassword((v) => !v)}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-150 p-1 -mr-1"
                >
                  {showPassword ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                </motion.button>
              </div>
              {errors.password && <p className="mt-1.5 text-[12px] font-semibold text-primary">{errors.password}</p>}
            </motion.div>

            <motion.button
              type="submit"
              disabled={loading}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
              className="group relative w-full h-14 sm:h-12 mt-2 bg-primary text-white font-bold text-[14px] sm:text-[13.5px] flex items-center justify-center gap-2 overflow-hidden hover:bg-primary-dark transition-colors duration-200 disabled:opacity-70 shadow-[0_15px_40px_rgba(193,18,31,0.2)]"
            >
              <span className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white animate-spin" /> Signing in
                </>
              ) : (
                <>
                  Sign In <FiArrowRight size={15} />
                </>
              )}
            </motion.button>
          </form>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-6 text-center text-[13px] text-gray-500"
          >
            New to LLS?{" "}
            <a href="#" className="font-bold text-primary hover:text-primary-dark transition-colors duration-150">
              Complete your onboarding
            </a>
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;