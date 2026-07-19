import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  FiSend,
  FiUsers,
  FiCheckCircle,
  FiCheckSquare,
  FiArrowUpRight,
} from "react-icons/fi";
import { Link } from "react-router-dom";

/*
  FRONTEND-ONLY NOTE
  -------------------
  No backend yet. MOCK_EVENTS stands in for GET /api/activity/recent.
  This is a STATUS LOG, not a report list — each entry is a state
  transition (submitted, confirmed, verified, resolved), not an issue
  itself. It intentionally does NOT repeat what RecentReports already
  shows; it answers "what just changed," not "what exists."

  `isNew` flags an event as having landed within the last few minutes —
  stand-in for comparing event timestamp to now(). Drives the live dot
  on the most recent row only.
*/

const EVENT_CFG = {
  submitted: { icon: <FiSend />, label: "Submitted", tone: "gray" },
  confirming: { icon: <FiUsers />, label: "Gained a confirmation", tone: "amber" },
  verified: { icon: <FiCheckSquare />, label: "Verified by admin", tone: "emerald" },
  resolved: { icon: <FiCheckCircle />, label: "Marked resolved", tone: "primary" },
};

const TONE_CFG = {
  gray: { dotLight: "bg-gray-400", dotDark: "bg-gray-500", textLight: "text-gray-500", textDark: "text-gray-400" },
  amber: { dotLight: "bg-amber-500", dotDark: "bg-amber-500", textLight: "text-amber-600", textDark: "text-amber-400" },
  emerald: { dotLight: "bg-emerald-500", dotDark: "bg-emerald-500", textLight: "text-emerald-700", textDark: "text-emerald-400" },
  primary: { dotLight: "bg-primary", dotDark: "bg-primary", textLight: "text-primary-dark", textDark: "text-red-300" },
};

const MOCK_EVENTS = [
  { id: 1, type: "resolved", report: "LLS-2281", title: "Library AC unit, 3rd floor", time: "2m ago", isNew: true },
  { id: 2, type: "confirming", report: "LLS-2291", title: "Broken water heater — Block C", time: "18m ago" },
  { id: 3, type: "verified", report: "LLS-2290", title: "Student portal login failing", time: "44m ago" },
  { id: 4, type: "confirming", report: "LLS-2285", title: "No water supply — hostel wing B", time: "3h ago" },
  { id: 5, type: "submitted", report: "LLS-2296", title: "Broken chair, Lecture Hall 4", time: "5h ago" },
  { id: 6, type: "submitted", report: "LLS-2288", title: "Faulty perimeter light, Gate 2", time: "6h ago" },
];

const TimelineRow = ({ event, darkMode, index, isInView, isLast }) => {
  const cfg = EVENT_CFG[event.type];
  const tone = TONE_CFG[cfg.tone];

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.35, delay: 0.15 + index * 0.07, ease: [0.16, 1, 0.3, 1] }}
      className="relative flex gap-3.5 pb-5 last:pb-0"
    >
      {/* connecting line */}
      {!isLast && (
        <div
          className={`absolute left-[15px] top-[26px] bottom-0 w-px ${darkMode ? "bg-white/[0.08]" : "bg-gray-200"}`}
        />
      )}

      {/* dot / icon */}
      <div
        className={`relative z-10 w-[31px] h-[31px] shrink-0 flex items-center justify-center text-sm ${
          darkMode ? `bg-white/[0.05] ${tone.textDark}` : `bg-surface-light ${tone.textLight}`
        }`}
      >
        {cfg.icon}
        {event.isNew && (
          <span className="absolute -top-1 -right-1 flex items-center justify-center">
            <span className="absolute w-2 h-2 rounded-full bg-primary animate-ping opacity-75" />
            <span className="w-2 h-2 rounded-full bg-primary" />
          </span>
        )}
      </div>

      {/* content */}
      <div className="min-w-0 flex-1 pt-0.5">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-xs font-bold uppercase tracking-wide ${darkMode ? tone.textDark : tone.textLight}`}>
            {cfg.label}
          </span>
          <span className={`text-xs font-medium ${darkMode ? "text-gray-600" : "text-gray-400"}`}>
            {event.time}
          </span>
        </div>
        <p className={`mt-1 text-sm font-semibold leading-snug truncate ${darkMode ? "text-white" : "text-gray-900"}`}>
          {event.title}
        </p>
        <p className={`mt-0.5 text-xs font-medium ${darkMode ? "text-gray-600" : "text-gray-400"}`}>
          {event.report}
        </p>
      </div>
    </motion.div>
  );
};

const ActivityTimeline = ({ darkMode }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const resolvedToday = MOCK_EVENTS.filter((e) => e.type === "resolved").length;

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className={`border flex flex-col ${darkMode ? "bg-[#0A0A0C] border-white/10" : "bg-white border-gray-200"} shadow-subtle`}
    >
      <div className={`flex items-center justify-between px-5 sm:px-6 py-5 border-b ${darkMode ? "border-white/10" : "border-gray-200"}`}>
        <div>
          <div className="flex items-center gap-2">
            <h2 className={`text-base font-black tracking-tight ${darkMode ? "text-white" : "text-gray-950"}`}>
              Activity Timeline
            </h2>
            <span className="relative flex items-center">
              <span className="absolute w-1.5 h-1.5 bg-primary rounded-full animate-ping opacity-75" />
              <span className="w-1.5 h-1.5 bg-primary rounded-full" />
            </span>
          </div>
          <p className={`mt-1 text-sm ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
            What just changed, across every stage
          </p>
        </div>

        {resolvedToday > 0 && (
          <span className={`shrink-0 text-xs font-bold ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            {resolvedToday} resolved today
          </span>
        )}
      </div>

      <div className="px-5 sm:px-6 py-5 flex-1">
        {MOCK_EVENTS.map((event, index) => (
          <TimelineRow
            key={event.id}
            event={event}
            darkMode={darkMode}
            index={index}
            isInView={isInView}
            isLast={index === MOCK_EVENTS.length - 1}
          />
        ))}
      </div>

      <div className={`px-5 sm:px-6 py-4 border-t ${darkMode ? "border-white/10" : "border-gray-100"}`}>
        <Link
          to="/campus-feed"
          className={`text-xs font-bold uppercase tracking-wide flex items-center gap-1.5 transition-colors duration-150 ${
            darkMode ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-primary"
          }`}
        >
          View full campus feed <FiArrowUpRight size={12} />
        </Link>
      </div>
    </motion.section>
  );
};

export default ActivityTimeline;