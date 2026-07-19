import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FiCheck,
  FiArrowUp,
  FiClock,
  FiArrowUpRight,
  FiImage,
  FiUsers,
  FiMapPin,
  FiCheckCircle,
  FiChevronDown,
  FiX,
  FiLoader,
  FiSend,
  FiAlertTriangle,
} from "react-icons/fi";

/*
  FRONTEND-ONLY NOTE
  -------------------
  No backend yet. MOCK_QUEUE stands in for GET /api/admin/report-queue,
  scoped to this admin's campus and pre-filtered to reports that have
  crossed the community-confirmation threshold. This is a dashboard
  PREVIEW capped at 3 cards — if there's more in the queue than that,
  admins go to the full Report Queue page to see and act on the rest
  (filtering, bulk actions, department assignment all live there, not
  here). `image`/`evidence` use picsum.photos as placeholders — swap
  for the real uploaded photos once that pipeline exists. `confirmedBy`
  mixes entries with and without `avatar` on purpose — the fallback
  renders initials (e.g. "AO"), same pattern as the student-facing
  feed/report cards.
*/
const PREVIEW_LIMIT = 3;

const ESCALATE_TO = [
  "Campus Security",
  "Facilities Management",
  "Dean of Students",
  "ICT Department",
  "Health Services",
];

const MOCK_QUEUE = [
  {
    id: "LLS-2290",
    title: "Student portal login failing since Monday",
    category: "Portal/ICT",
    location: "University-wide (student portal)",
    waitingHours: 6,
    urgent: false,
    image: "https://picsum.photos/seed/LLS-2290/900/650",
    submittedBy: { name: "Tunde Ade", avatar: "https://i.pravatar.cc/100?img=12" },
    confirmations: 5,
    required: 5,
    confirmedBy: [
      { name: "Aisha Bello", avatar: "https://i.pravatar.cc/100?img=47", evidence: "https://picsum.photos/seed/ev-2290-1/300/220" },
      { name: "Ade Okafor", evidence: "https://picsum.photos/seed/ev-2290-2/300/220" },
      { name: "Grace Momoh", avatar: "https://i.pravatar.cc/100?img=32", evidence: "https://picsum.photos/seed/ev-2290-3/300/220" },
      { name: "Ibrahim Musa", avatar: "https://i.pravatar.cc/100?img=15", evidence: "https://picsum.photos/seed/ev-2290-4/300/220" },
      { name: "Tunde Ade", evidence: "https://picsum.photos/seed/ev-2290-5/300/220" },
    ],
  },
  {
    id: "LLS-2299",
    title: "Suspicious individual near female hostel gate",
    category: "Harassment",
    location: "Female Hostel, back gate",
    waitingHours: 52,
    urgent: true,
    image: "https://picsum.photos/seed/LLS-2299/900/650",
    submittedBy: { name: "Grace Momoh", avatar: "https://i.pravatar.cc/100?img=32" },
    confirmations: 5,
    required: 5,
    confirmedBy: [
      { name: "Aisha Bello", avatar: "https://i.pravatar.cc/100?img=47", evidence: "https://picsum.photos/seed/ev-2299-1/300/220" },
      { name: "Tunde Ade", avatar: "https://i.pravatar.cc/100?img=12", evidence: "https://picsum.photos/seed/ev-2299-2/300/220" },
      { name: "Ibrahim Musa", evidence: "https://picsum.photos/seed/ev-2299-3/300/220" },
      { name: "Ade Okafor", evidence: "https://picsum.photos/seed/ev-2299-4/300/220" },
      { name: "Grace Momoh", avatar: "https://i.pravatar.cc/100?img=32", evidence: "https://picsum.photos/seed/ev-2299-5/300/220" },
    ],
  },
  {
    id: "LLS-2285",
    title: "No water supply — female hostel wing B",
    category: "Water",
    location: "Female Hostel, Wing B",
    waitingHours: 14,
    urgent: false,
    image: "https://picsum.photos/seed/LLS-2285/900/650",
    submittedBy: { name: "Grace Momoh", avatar: "https://i.pravatar.cc/100?img=32" },
    confirmations: 5,
    required: 5,
    confirmedBy: [
      { name: "Aisha Bello", avatar: "https://i.pravatar.cc/100?img=47", evidence: "https://picsum.photos/seed/ev-2285-1/300/220" },
      { name: "Tunde Ade", evidence: "https://picsum.photos/seed/ev-2285-2/300/220" },
      { name: "Ibrahim Musa", avatar: "https://i.pravatar.cc/100?img=15", evidence: "https://picsum.photos/seed/ev-2285-3/300/220" },
      { name: "Ade Okafor", evidence: "https://picsum.photos/seed/ev-2285-4/300/220" },
      { name: "Grace Momoh", avatar: "https://i.pravatar.cc/100?img=32", evidence: "https://picsum.photos/seed/ev-2285-5/300/220" },
    ],
  },
  {
    id: "LLS-2255",
    title: "Loose handrail, Admin building stairs",
    category: "Security",
    location: "Admin Building, main staircase",
    waitingHours: 20,
    urgent: false,
    image: "https://picsum.photos/seed/LLS-2255/900/650",
    submittedBy: { name: "Ibrahim Musa", avatar: "https://i.pravatar.cc/100?img=15" },
    confirmations: 5,
    required: 5,
    confirmedBy: [
      { name: "Aisha Bello", avatar: "https://i.pravatar.cc/100?img=47", evidence: "https://picsum.photos/seed/ev-2255-1/300/220" },
      { name: "Grace Momoh", evidence: "https://picsum.photos/seed/ev-2255-2/300/220" },
      { name: "Ade Okafor", avatar: "https://i.pravatar.cc/100?img=32", evidence: "https://picsum.photos/seed/ev-2255-3/300/220" },
      { name: "Ibrahim Musa", evidence: "https://picsum.photos/seed/ev-2255-4/300/220" },
      { name: "Tunde Ade", avatar: "https://i.pravatar.cc/100?img=12", evidence: "https://picsum.photos/seed/ev-2255-5/300/220" },
    ],
  },
  {
    id: "LLS-2270",
    title: "Wi-Fi dead zone, Block A common room",
    category: "Portal/ICT",
    location: "Male Hostel, Block A",
    waitingHours: 4,
    urgent: false,
    image: "https://picsum.photos/seed/LLS-2270/900/650",
    submittedBy: { name: "Tunde Ade", avatar: "https://i.pravatar.cc/100?img=12" },
    confirmations: 5,
    required: 5,
    confirmedBy: [
      { name: "Grace Momoh", avatar: "https://i.pravatar.cc/100?img=32", evidence: "https://picsum.photos/seed/ev-2270-1/300/220" },
      { name: "Ade Okafor", evidence: "https://picsum.photos/seed/ev-2270-2/300/220" },
      { name: "Aisha Bello", avatar: "https://i.pravatar.cc/100?img=47", evidence: "https://picsum.photos/seed/ev-2270-3/300/220" },
      { name: "Tunde Ade", evidence: "https://picsum.photos/seed/ev-2270-4/300/220" },
      { name: "Ibrahim Musa", avatar: "https://i.pravatar.cc/100?img=15", evidence: "https://picsum.photos/seed/ev-2270-5/300/220" },
    ],
  },
];

const initialsOf = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("") || "?";

const Avatar = ({ name, avatar, className = "" }) => {
  const [broken, setBroken] = useState(false);
  const showImage = !!avatar && !broken;

  return (
    <div className={`flex items-center justify-center overflow-hidden shrink-0 ${className}`}>
      {showImage ? (
        <img src={avatar} alt={name} className="w-full h-full object-cover" onError={() => setBroken(true)} />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white text-[9px] font-black">
          {initialsOf(name)}
        </div>
      )}
    </div>
  );
};

const SubmittedBy = ({ submitter, darkMode }) => {
  if (!submitter) return null;
  return (
    <div className="mt-2.5 flex items-center gap-2">
      <Avatar name={submitter.name} avatar={submitter.avatar} className="w-6 h-6 rounded-full border-2 border-primary" />
      <span className={`text-[12px] ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
        Reported by <span className={`font-bold ${darkMode ? "text-white" : "text-black"}`}>{submitter.name}</span>
      </span>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Confirmer stack — click to drop down each confirmer's evidence      */
/* ------------------------------------------------------------------ */

const ConfirmerStack = ({ confirmers, darkMode, expanded, onToggle }) => {
  if (!confirmers?.length) return null;
  const visible = confirmers.slice(0, 5);

  return (
    <div>
      <button
        onClick={onToggle}
        className={`flex items-center gap-3 transition-opacity duration-150 ${expanded ? "" : "hover:opacity-80"}`}
      >
        <div className="flex -space-x-2">
          {visible.map((c, i) => (
            <Avatar key={i} name={c.name} avatar={c.avatar} className="relative w-8 h-8 rounded-full border-2 border-primary" />
          ))}
        </div>
        <span className={`text-xs font-semibold ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
          {confirmers.length} students confirmed this
        </span>
        <FiChevronDown
          size={13}
          className={`transition-transform duration-200 ${expanded ? "rotate-180" : ""} ${darkMode ? "text-gray-500" : "text-gray-400"}`}
        />
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
              {visible.map((c, i) => (
                <div key={i} className={`border overflow-hidden ${darkMode ? "border-white/10 bg-white/[0.02]" : "border-gray-200 bg-white"}`}>
                  <div className="h-16 w-full overflow-hidden">
                    <img src={c.evidence} alt={`Evidence from ${c.name}`} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex items-center gap-1.5 px-2 py-1.5">
                    <Avatar name={c.name} avatar={c.avatar} className="w-5 h-5 rounded-full border border-primary" />
                    <span className={`text-[10.5px] font-semibold truncate ${darkMode ? "text-gray-300" : "text-gray-700"}`}>{c.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* ESCALATE MODAL — pick who it goes to + why, before it's marked      */
/* urgent. Nothing is sent anywhere yet; onConfirm just updates the    */
/* local queue state with the department + reason so the card can      */
/* show who it was actually escalated to, not just a generic "Urgent". */
/* ------------------------------------------------------------------ */

const EscalateModal = ({ report, darkMode, onClose, onConfirm }) => {
  const [department, setDepartment] = useState("");
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = department && reason.trim().length >= 10;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    // Simulated escalation delay — swap for a real
    // POST /api/admin/report-queue/:id/escalate once the backend exists.
    await new Promise((resolve) => setTimeout(resolve, 700));
    onConfirm(report.id, { department, reason: reason.trim() });
    setSubmitting(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && !submitting && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.97 }}
        transition={{ type: "spring", stiffness: 280, damping: 26 }}
        className={`relative w-full max-w-md border ${darkMode ? "bg-[#0A0A0C] border-white/10" : "bg-white border-gray-200"}`}
      >
        <div className={`flex items-start justify-between gap-4 p-6 border-b ${darkMode ? "border-white/10" : "border-gray-100"}`}>
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 shrink-0 bg-primary text-white flex items-center justify-center">
              <FiArrowUp size={16} />
            </div>
            <div>
              <h3 className={`text-[16px] font-bold ${darkMode ? "text-white" : "text-gray-950"}`}>Escalate Report</h3>
              <p className={`mt-0.5 text-[12px] ${darkMode ? "text-gray-500" : "text-gray-400"}`}>{report.id} · {report.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={submitting}
            className={`p-1.5 disabled:opacity-40 ${darkMode ? "text-gray-500 hover:text-white" : "text-gray-400 hover:text-black"}`}
          >
            <FiX size={18} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className={`flex items-start gap-3 border p-3 ${darkMode ? "bg-primary/10 border-primary/25" : "bg-red-50 border-red-200"}`}>
            <FiAlertTriangle className="text-primary shrink-0 mt-0.5" size={16} />
            <p className={`text-[12px] leading-relaxed ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
              Escalating hands this off to another department or office — use it when this is outside what you can
              resolve directly, not just because it's taking a while.
            </p>
          </div>

          <div>
            <label className={`block text-[12px] font-bold uppercase tracking-wide mb-2 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              Escalate To
            </label>
            <div className="grid grid-cols-1 gap-2">
              {ESCALATE_TO.map((dept) => {
                const isSelected = department === dept;
                return (
                  <button
                    key={dept}
                    onClick={() => setDepartment(dept)}
                    className={`flex items-center justify-between px-4 py-2.5 border text-left text-[13px] font-semibold transition-colors duration-150 ${
                      isSelected
                        ? "bg-primary border-primary text-white"
                        : darkMode
                        ? "border-white/10 text-gray-300 hover:border-white/25"
                        : "border-gray-200 text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    {dept}
                    {isSelected && <FiCheck size={14} />}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className={`block text-[12px] font-bold uppercase tracking-wide mb-2 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              Reason for Escalation
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Why does this need to go to another department? (min. 10 characters)"
              className={`w-full px-4 py-3 border text-sm outline-none resize-none transition-colors duration-150 ${
                darkMode
                  ? "bg-white/[0.03] border-white/10 text-white placeholder:text-gray-600 focus:border-primary/50"
                  : "bg-white border-gray-200 text-gray-950 placeholder:text-gray-400 focus:border-primary/50"
              }`}
            />
          </div>
        </div>

        <div className={`flex items-center justify-end gap-3 p-6 border-t ${darkMode ? "border-white/10" : "border-gray-100"}`}>
          <button
            onClick={onClose}
            disabled={submitting}
            className={`h-11 px-5 border font-semibold text-sm transition-colors duration-200 disabled:opacity-50 ${
              darkMode ? "border-white/10 text-gray-300 hover:bg-white/[0.05]" : "border-gray-200 text-gray-600 hover:bg-surface-light"
            }`}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!canSubmit || submitting}
            className="flex items-center gap-2 h-11 px-6 bg-primary text-white font-semibold text-sm hover:bg-primary-dark transition-colors duration-200 disabled:opacity-60"
          >
            {submitting ? (
              <>
                <FiLoader className="animate-spin" size={14} /> Escalating...
              </>
            ) : (
              <>
                <FiSend size={14} /> Confirm Escalation
              </>
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ------------------------------------------------------------------ */
/* Queue card — same layout language as MyReportCard                   */
/* ------------------------------------------------------------------ */

const QueueCard = ({ report, index, darkMode, onVerify, onEscalate }) => {
  const [showConfirmers, setShowConfirmers] = useState(false);
  const pct = Math.min(100, Math.round((report.confirmations / report.required) * 100));

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -3 }}
      className={`group border overflow-hidden transition-all duration-300 ${darkMode ? "bg-[#0A0A0C] border-white/10" : "bg-white border-gray-200"}`}
    >
      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr]">
        {/* IMAGE */}
        <div className="relative h-[200px] lg:h-full overflow-hidden">
          <img
            src={report.image}
            alt={report.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          {report.urgent && (
            <span className="absolute top-3 left-3 px-2 py-1 bg-primary text-white text-[9.5px] font-black uppercase tracking-[0.12em]">
              Urgent
            </span>
          )}
          <div className="absolute bottom-0 left-0 p-4 sm:p-5 w-full">
            <div className="inline-flex items-center gap-2 px-2.5 py-1.5 bg-primary text-white text-[10px] font-black uppercase tracking-[0.15em] mb-3">
              <FiImage size={11} />
              {report.category}
            </div>
            <h3 className="text-white text-lg sm:text-xl font-black leading-tight">{report.title}</h3>
          </div>
        </div>

        {/* CONTENT */}
        <div className="p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <div
                  className={`inline-flex items-center gap-2 px-2.5 py-1.5 text-xs font-bold uppercase tracking-[0.12em] border ${
                    darkMode ? "bg-primary/10 border-primary/25 text-red-300" : "bg-red-50 border-red-200 text-primary-dark"
                  }`}
                >
                  <FiCheckCircle size={12} />
                  {report.id}
                </div>
                <div className={`flex items-center gap-2 text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                  <FiMapPin size={13} />
                  {report.location}
                </div>
              </div>

              <p className={`mt-3 flex items-center gap-1.5 text-[12px] font-semibold ${darkMode ? "text-gray-500" : "text-gray-500"}`}>
                <FiClock size={11} />
                Waiting {report.waitingHours}h for admin action
              </p>

              <SubmittedBy submitter={report.submittedBy} darkMode={darkMode} />
            </div>

            <div className={`border p-4 min-w-[150px] shrink-0 ${darkMode ? "bg-white/[0.03] border-white/10" : "bg-[#FAFAFA] border-gray-200"}`}>
              <p className={`text-[10px] uppercase tracking-[0.2em] flex items-center gap-1.5 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                <FiUsers size={11} />
                Confirmations
              </p>
              <h4 className={`mt-2 text-3xl font-black ${darkMode ? "text-white" : "text-black"}`}>{report.confirmations}</h4>
              <p className="mt-1 text-primary text-xs font-semibold">/ {report.required} needed</p>
            </div>
          </div>

          {/* PROGRESS */}
          <div className="mt-5">
            <div className={`relative h-2 overflow-hidden ${darkMode ? "bg-white/10" : "bg-gray-200"}`}>
              <motion.div
                initial={false}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="h-full bg-primary"
              />
            </div>
          </div>

          {/* CONFIRMERS + EVIDENCE */}
          {report.confirmedBy?.length > 0 && (
            <div className="mt-5">
              <ConfirmerStack
                confirmers={report.confirmedBy}
                darkMode={darkMode}
                expanded={showConfirmers}
                onToggle={() => setShowConfirmers((v) => !v)}
              />
            </div>
          )}

          {/* ACTIONS */}
          <div className={`mt-5 pt-5 border-t flex items-center justify-end gap-2.5 ${darkMode ? "border-white/10" : "border-gray-100"}`}>
            <button
              onClick={() => onEscalate(report.id)}
              className={`flex items-center gap-1.5 px-4 py-2 text-[11.5px] font-bold border transition-colors duration-150 ${
                darkMode ? "border-white/10 text-gray-300 hover:bg-white/[0.05]" : "border-gray-200 text-gray-600 hover:bg-surface-light"
              }`}
            >
              <FiArrowUp size={11} /> Escalate
            </button>
            <button
              onClick={() => onVerify(report.id)}
              className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-[11.5px] font-bold hover:bg-primary-dark transition-colors duration-150"
            >
              <FiCheck size={11} /> Verify
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const ReportQueuePreview = ({ darkMode }) => {
  const [queue, setQueue] = useState(MOCK_QUEUE);

  const handleVerify = (id) => setQueue((prev) => prev.filter((r) => r.id !== id));
  const handleEscalate = (id) => setQueue((prev) => prev.map((r) => (r.id === id ? { ...r, urgent: true } : r)));

  const visible = queue.slice(0, PREVIEW_LIMIT);
  const remaining = queue.length - visible.length;

  return (
    <div id="admin-reports" className="scroll-mt-24">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className={`text-[14px] font-black tracking-tight ${darkMode ? "text-white" : "text-gray-950"}`}>Report Queue</h2>
          <p className={`mt-0.5 text-[11.5px] ${darkMode ? "text-gray-500" : "text-gray-400"}`}>Confirmed reports awaiting your verification</p>
        </div>
        <Link
          to="/admin/report-queue"
          className={`shrink-0 text-[11.5px] font-bold uppercase tracking-wide flex items-center gap-1.5 transition-colors duration-150 ${
            darkMode ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-primary"
          }`}
        >
          View full queue <FiArrowUpRight size={11} />
        </Link>
      </div>

      {visible.length === 0 ? (
        <div className={`border py-14 text-center ${darkMode ? "bg-[#0A0A0C] border-white/10" : "bg-white border-gray-200"}`}>
          <p className={`text-[13px] font-bold ${darkMode ? "text-white" : "text-gray-950"}`}>Queue is clear</p>
          <p className={`mt-1 text-[12px] ${darkMode ? "text-gray-500" : "text-gray-400"}`}>Nothing awaiting verification right now.</p>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-5">
            <AnimatePresence mode="popLayout">
              {visible.map((report, i) => (
                <QueueCard key={report.id} report={report} index={i} darkMode={darkMode} onVerify={handleVerify} onEscalate={handleEscalate} />
              ))}
            </AnimatePresence>
          </div>

          {/* Anything beyond the 3-card preview lives on the full queue page */}
          {remaining > 0 && (
            <Link
              to="/admin/report-queue"
              className={`mt-5 flex items-center justify-center gap-2 border py-4 text-[12.5px] font-bold transition-colors duration-150 ${
                darkMode ? "border-white/10 text-gray-300 hover:bg-white/[0.05]" : "border-gray-200 text-gray-600 hover:bg-surface-light"
              }`}
            >
              +{remaining} more waiting — verify them on the full queue page <FiArrowUpRight size={13} />
            </Link>
          )}
        </>
      )}
    </div>
  );
};

export default ReportQueuePreview;