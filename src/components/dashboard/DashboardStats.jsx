import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import {
  FiFileText,
  FiCheckCircle,
  FiClock,
  FiUsers,
  FiTrendingUp,
  FiTrendingDown,
} from "react-icons/fi";

/*
  FRONTEND-ONLY NOTE
  -------------------
  No backend connected yet. MOCK_STATS stands in for a future
  GET /api/reports/stats call. Field shape matches what the real
  endpoint should return, so wiring it up later means replacing
  the constant below with real fetched data — no restructuring.

  `invert` marks stats where a falling number is the good outcome
  (e.g. pending confirmations). The trend arrow always shows the real
  direction the number moved; `invert` only affects whether that's
  colored as good (emerald) or bad (red) news.
*/
const MOCK_STATS = [
  {
    key: "total",
    label: "Total Reports",
    value: 342,
    suffix: "",
    trend: 8,
    invert: false,
    icon: <FiFileText />,
    spark: [40, 55, 48, 62, 58, 70, 66, 78],
  },
  {
    key: "resolved",
    label: "Resolved Issues",
    value: 261,
    suffix: "",
    trend: 12,
    invert: false,
    icon: <FiCheckCircle />,
    spark: [30, 38, 42, 40, 52, 60, 64, 72],
  },
  {
    key: "pending",
    label: "Pending Confirmation",
    value: 47,
    suffix: "",
    trend: -6,
    invert: true, // fewer pending is good — a falling number here is good news
    icon: <FiClock />,
    spark: [60, 58, 50, 54, 46, 42, 40, 34],
  },
  {
    key: "contributors",
    label: "Active Contributors",
    value: 1284,
    suffix: "",
    trend: 15,
    invert: false,
    icon: <FiUsers />,
    spark: [45, 50, 55, 60, 68, 74, 80, 88],
  },
];

// Counts a number up from 0 to its target once the tile scrolls into view.
const useCountUp = (target, isInView, duration = 1100, skip = false) => {
  const [value, setValue] = useState(skip ? target : 0);

  useEffect(() => {
    if (!isInView) return;
    if (skip) {
      setValue(target);
      return;
    }

    let start = null;
    let frame;

    const step = (timestamp) => {
      if (start === null) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setValue(Math.round(eased * target));
      if (progress < 1) frame = requestAnimationFrame(step);
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [isInView, target, duration, skip]);

  return value;
};

const Sparkline = ({ data, darkMode, isGood }) => {
  const max = Math.max(...data);

  return (
    <div className="flex items-end gap-[3px] h-9 shrink-0" aria-hidden="true">
      {data.map((v, i) => (
        <motion.div
          key={i}
          initial={{ height: 0 }}
          animate={{ height: `${(v / max) * 100}%` }}
          transition={{ delay: 0.4 + i * 0.05, duration: 0.5, ease: "easeOut" }}
          className={`w-[5px] ${
            isGood ? "bg-primary/70" : darkMode ? "bg-gray-600" : "bg-gray-300"
          } ${i === data.length - 1 ? "!bg-primary" : ""}`}
        />
      ))}
    </div>
  );
};

const StatCard = ({ stat, darkMode, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const shouldReduceMotion = useReducedMotion();
  const count = useCountUp(stat.value, isInView, 1100, shouldReduceMotion);

  const trendUp = stat.trend >= 0;
  const isGood = stat.invert ? !trendUp : trendUp;

  return (
    <motion.div
      ref={ref}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      whileHover={shouldReduceMotion ? {} : { y: -4 }}
      className={`
        relative overflow-hidden border-t-2 border-primary p-5 sm:p-6 transition-colors duration-300
        ${
          darkMode
            ? "bg-[#0A0A0C] border-x border-b border-x-white/10 border-b-white/10 hover:border-b-white/20"
            : "bg-white border-x border-b border-x-gray-200 border-b-gray-200 hover:border-b-gray-300"
        }
        shadow-subtle hover:shadow-card
      `}
    >
      <div className="flex items-start justify-between gap-3">
        <div
          className={`w-11 h-11 shrink-0 flex items-center justify-center text-lg ${
            darkMode ? "bg-white/[0.05] text-white" : "bg-surface-light text-primary"
          }`}
        >
          {stat.icon}
        </div>

        <div
          className={`flex items-center gap-1 text-xs font-bold font-mono px-2 py-1 border shrink-0 ${
            isGood
              ? darkMode
                ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-400"
                : "bg-emerald-50 border-emerald-200 text-emerald-700"
              : darkMode
              ? "bg-primary/10 border-primary/25 text-red-300"
              : "bg-red-50 border-red-200 text-primary-dark"
          }`}
        >
          {trendUp ? <FiTrendingUp size={12} /> : <FiTrendingDown size={12} />}
          {trendUp ? "+" : ""}
          {stat.trend}%
        </div>
      </div>

      <div className="mt-6 flex items-end justify-between gap-3">
        <div className="min-w-0">
          <h3
            className={`font-mono text-3xl sm:text-4xl font-semibold tracking-tight tabular-nums truncate ${
              darkMode ? "text-white" : "text-gray-950"
            }`}
          >
            {count.toLocaleString()}
            {stat.suffix}
          </h3>
          <p
            className={`mt-1.5 text-[11px] sm:text-[12px] font-medium uppercase tracking-[0.08em] ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            {stat.label}
          </p>
        </div>

        <Sparkline data={stat.spark} darkMode={darkMode} isGood={isGood} />
      </div>
    </motion.div>
  );
};

const DashboardStats = ({ darkMode }) => {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {MOCK_STATS.map((stat, index) => (
        <StatCard key={stat.key} stat={stat} darkMode={darkMode} index={index} />
      ))}
    </section>
  );
};

export default DashboardStats;