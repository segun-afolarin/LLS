import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
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
  FiArrowUpRight,
  FiCheck,
} from "react-icons/fi";

/*
  FRONTEND-ONLY NOTE
  -------------------
  No backend yet. MOCK_REPORTS stands in for GET /api/reports/recent.
  This is a DASHBOARD PREVIEW, not the My Reports / Campus Feed page —
  capped at 3 cards, no filters, no search. Its one job is to answer
  "what's happening right now" at a glance and hand off via "View all".

  `image` uses picsum.photos as a placeholder — swap for the real
  uploaded report photo URL once the upload pipeline exists.
  `submitter.avatar` uses pravatar.cc as a placeholder for reports with
  a real photo; reports without one fall back to `submitter.initials`.

  `alreadyConfirmedByMe` marks a report the CURRENT viewer has already
  confirmed — stand-in for GET /api/reports/:id/confirmed-by-me. Drives
  the button's initial locked/checked state.

  Clicking Confirm updates local state only (optimistic UI) — wire it
  to POST /api/reports/:id/confirm once that endpoint exists.
*/

const CATEGORY_CFG = {
  Hostel: { icon: <FiHome /> },
  "Portal/ICT": { icon: <FiMonitor /> },
  Security: { icon: <FiShield /> },
  Water: { icon: <FiDroplet /> },
  Electricity: { icon: <FiZap /> },
  Library: { icon: <FiBook /> },
  Medical: { icon: <FiHeart /> },
  Harassment: { icon: <FiAlertTriangle /> },
  General: { icon: <FiMessageSquare /> },
};

const STATUS_CFG = {
  pending: { label: "Pending", dot: "bg-gray-400" },
  confirming: { label: "Confirming", dot: "bg-amber-500" },
  verified: { label: "Verified", dot: "bg-primary" },
  resolved: { label: "Resolved", dot: "bg-primary" },
};

const MOCK_REPORTS = [
  {
    id: "LLS-2291",
    title: "Broken water heater — Block C hostel",
    category: "Hostel",
    campus: "Abuja",
    time: "12m ago",
    status: "pending",
    confirmations: 5,
    required: 10,
    alreadyConfirmedByMe: false,
    image: "https://picsum.photos/seed/LLS-2291/600/450",
    submitter: { name: "Aisha Bello", avatar: "https://i.pravatar.cc/100?img=47" },
  },
  {
    id: "LLS-2288",
    title: "Faulty perimeter light near Gate 2",
    category: "Security",
    campus: "Abuja",
    time: "2h ago",
    status: "confirming",
    confirmations: 8,
    required: 10,
    alreadyConfirmedByMe: true,
    image: "https://picsum.photos/seed/LLS-2288/600/450",
    submitter: { name: "Ade Okafor", initials: "AO" },
  },
  {
    id: "LLS-2285",
    title: "No water supply — female hostel wing B",
    category: "Water",
    campus: "Gombe",
    time: "5h ago",
    status: "confirming",
    confirmations: 9,
    required: 10,
    alreadyConfirmedByMe: false,
    image: "https://picsum.photos/seed/LLS-2285/600/450",
    submitter: { name: "Grace Momoh", avatar: "https://i.pravatar.cc/100?img=32" },
  },
];

const Avatar = ({ submitter, darkMode }) => {
  if (submitter.avatar) {
    return (
      <img
        src={submitter.avatar}
        alt={submitter.name}
        className={`w-9 h-9 shrink-0 object-cover border ${darkMode ? "border-white/10" : "border-gray-200"}`}
      />
    );
  }
  return (
    <div
      className={`w-9 h-9 shrink-0 flex items-center justify-center text-xs font-bold ${
        darkMode ? "bg-white/10 text-gray-200" : "bg-gray-900 text-white"
      }`}
    >
      {submitter.initials}
    </div>
  );
};

const ConfirmationMeter = ({ confirmations, required, darkMode, isInView, delay }) => {
  const pct = Math.min(100, Math.round((confirmations / required) * 100));

  return (
    <div className="flex items-center gap-2.5 w-full">
      <div className={`relative flex-1 h-[6px] overflow-hidden ${darkMode ? "bg-white/10" : "bg-gray-200"}`}>
        <motion.div
          initial={{ width: 0 }}
          animate={isInView ? { width: `${pct}%` } : {}}
          transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
          className="h-full bg-primary"
        />
      </div>
      <span className={`text-xs font-bold tabular-nums shrink-0 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
        {confirmations}/{required}
      </span>
    </div>
  );
};

const ReportCard = ({ report, darkMode, index, isInView }) => {
  const [confirmations, setConfirmations] = useState(report.confirmations);
  const [confirmed, setConfirmed] = useState(report.alreadyConfirmedByMe);
  const cfg = CATEGORY_CFG[report.category] || CATEGORY_CFG.General;
  const status = STATUS_CFG[report.status];
  const remaining = Math.max(0, report.required - confirmations);
  const complete = remaining === 0;

  const handleConfirm = () => {
    if (confirmed || complete) return;
    setConfirmed(true);
    setConfirmations((c) => Math.min(report.required, c + 1));
  };

  const helperText = complete
    ? "Fully confirmed by campus"
    : confirmed
    ? `You confirmed · waiting on ${remaining} more`
    : `Waiting on ${remaining} more confirmation${remaining === 1 ? "" : "s"}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45, delay: 0.15 + index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className={`group flex flex-col border overflow-hidden ${
        darkMode ? "bg-white/[0.02] border-white/10" : "bg-white border-gray-200"
      }`}
    >
      {/* IMAGE */}
      <Link to="/my-reports" className="relative block aspect-[4/3] overflow-hidden">
        <img
          src={report.image}
          alt={report.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0" />

        <div className="absolute top-3 left-3 w-9 h-9 flex items-center justify-center text-white bg-black/40 backdrop-blur-sm">
          {cfg.icon}
        </div>

        <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 bg-black/40 backdrop-blur-sm">
          <span className={`w-1.5 h-1.5 ${status.dot}`} />
          <span className="text-xs font-bold uppercase tracking-wide text-white">{status.label}</span>
        </div>

        <p className="absolute bottom-3 left-3 right-3 text-sm font-bold text-white leading-snug">
          {report.title}
        </p>
      </Link>

      {/* BODY */}
      <div className="flex-1 flex flex-col gap-3.5 p-4">
        <div className="flex items-center justify-between">
          <span className={`text-xs font-semibold ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
            {report.id} · {report.campus} Campus
          </span>
          <span className={`text-xs ${darkMode ? "text-gray-600" : "text-gray-400"}`}>{report.time}</span>
        </div>

        <div className="flex items-center gap-2.5">
          <Avatar submitter={report.submitter} darkMode={darkMode} />
          <div className="min-w-0">
            <p className={`text-sm font-semibold truncate ${darkMode ? "text-white" : "text-gray-950"}`}>
              {report.submitter.name}
            </p>
            <p className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}>Submitted this report</p>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <ConfirmationMeter
            confirmations={confirmations}
            required={report.required}
            darkMode={darkMode}
            isInView={isInView}
            delay={0.35 + index * 0.1}
          />
          <p className={`text-xs font-semibold ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{helperText}</p>
        </div>

        <button
          onClick={handleConfirm}
          disabled={confirmed || complete}
          className={`relative overflow-hidden w-full flex items-center justify-center gap-2 py-2.5 text-sm font-bold border transition-colors duration-200 ${
            confirmed || complete
              ? "bg-white text-primary border-primary"
              : "bg-primary text-white border-primary hover:bg-primary/90"
          }`}
        >
          {!(confirmed || complete) && (
            <span className="absolute inset-0 bg-white/15 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
          )}
          <AnimatePresence mode="wait" initial={false}>
            {confirmed || complete ? (
              <motion.span
                key="done"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 flex items-center gap-1.5"
              >
                <FiCheck /> {complete ? "Confirmed" : "You confirmed"}
              </motion.span>
            ) : (
              <motion.span key="cta" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="relative z-10">
                Confirm this report
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.div>
  );
};

const RecentReports = ({ darkMode }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className={`border ${darkMode ? "bg-[#0A0A0C] border-white/10" : "bg-white border-gray-200"} shadow-subtle`}
    >
      <div className={`flex items-center justify-between px-5 sm:px-6 py-5 border-b ${darkMode ? "border-white/10" : "border-gray-200"}`}>
        <div>
          <h2 className={`text-base font-black tracking-tight ${darkMode ? "text-white" : "text-gray-950"}`}>
            Recent Reports
          </h2>
          <p className={`mt-1 text-sm ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
            Latest activity on your campus, awaiting or moving through confirmation
          </p>
        </div>

        <Link
          to="/my-reports"
          className={`shrink-0 text-xs font-bold uppercase tracking-wide flex items-center gap-1.5 transition-colors duration-150 ${
            darkMode ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-primary"
          }`}
        >
          View all <FiArrowUpRight size={12} />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 p-5 sm:p-6">
        {MOCK_REPORTS.map((report, index) => (
          <ReportCard key={report.id} report={report} darkMode={darkMode} index={index} isInView={isInView} />
        ))}
      </div>
    </motion.section>
  );
};

export default RecentReports;