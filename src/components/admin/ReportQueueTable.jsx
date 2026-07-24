import { useMemo, useState } from "react";
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
  FiCheck,
  FiX,
  FiArrowUp,
  FiClock,
  FiUsers,
  FiChevronDown,
  FiImage,
  FiMapPin,
  FiCheckCircle,
  FiLoader,
  FiSend,
} from "react-icons/fi";

/*
  FRONTEND-ONLY NOTE
  -------------------
  No backend yet. MOCK_QUEUE stands in for GET /api/admin/report-queue,
  scoped to this admin's campus. All four actions below (Verify, Reject,
  Escalate, Assign to Department) update local state only — swap for
  real PATCH calls to /api/admin/reports/:id/{verify,reject,escalate,assign}
  once the backend exists. Row shape stays the same either way.

  `image`/evidence use picsum.photos as placeholders — swap for the
  real uploaded photos once that pipeline exists. `confirmedBy` mixes
  entries with and without `avatar` on purpose — the fallback renders
  initials, same pattern as every other report card in this app.
*/

const CATEGORY_ICONS = {
  Hostel: <FiHome />,
  "Portal/ICT": <FiMonitor />,
  Security: <FiShield />,
  Water: <FiDroplet />,
  Electricity: <FiZap />,
  Library: <FiBook />,
  Medical: <FiHeart />,
  Harassment: <FiAlertTriangle />,
  General: <FiMessageSquare />,
};

const DEPARTMENTS = ["Facilities", "ICT", "Security", "Health Center", "Student Affairs"];

const CONFIRMER_POOL = [
  { name: "Aisha Bello", avatar: "https://i.pravatar.cc/100?img=47" },
  { name: "Tunde Ade", avatar: "https://i.pravatar.cc/100?img=12" },
  { name: "Grace Momoh", avatar: "https://i.pravatar.cc/100?img=32" },
  { name: "Ibrahim Musa", avatar: "https://i.pravatar.cc/100?img=15" },
  { name: "Ade Okafor" },
  { name: "Chidi Nwosu" },
  { name: "Amaka Eze", avatar: "https://i.pravatar.cc/100?img=25" },
  { name: "Fatima Bello" },
  { name: "Sarah Bello", avatar: "https://i.pravatar.cc/100?img=9" },
  { name: "Ola James" },
];

const makeConfirmers = (reportId, count) =>
  Array.from({ length: count }, (_, i) => {
    const c = CONFIRMER_POOL[i % CONFIRMER_POOL.length];
    return { ...c, evidence: `https://picsum.photos/seed/ev-${reportId}-${i}/300/220` };
  });

const RAW_QUEUE = [
  {
    id: "LLS-2290",
    title: "Student portal login failing since Monday",
    category: "Portal/ICT",
    location: "University-wide (student portal)",
    student: { name: "Chidi Nwosu" },
    confirmations: 5,
    waitingHours: 6,
    urgent: false,
    department: null,
    image: "https://picsum.photos/seed/LLS-2290/900/650",
  },
  {
    id: "LLS-2285",
    title: "No water supply — female hostel wing B",
    category: "Water",
    location: "Female Hostel, Wing B",
    student: { name: "Amaka Eze", avatar: "https://i.pravatar.cc/100?img=25" },
    confirmations: 5,
    waitingHours: 14,
    urgent: false,
    department: null,
    image: "https://picsum.photos/seed/LLS-2285/900/650",
  },
  {
    id: "LLS-2299",
    title: "Suspicious individual near female hostel gate",
    category: "Harassment",
    location: "Female Hostel, back gate",
    student: { name: "Fatima Bello" },
    confirmations: 4,
    waitingHours: 52,
    urgent: true,
    department: null,
    image: "https://picsum.photos/seed/LLS-2299/900/650",
  },
  {
    id: "LLS-2255",
    title: "Loose handrail, Admin building stairs",
    category: "Security",
    location: "Admin Building, main staircase",
    student: { name: "Tunde Alabi", avatar: "https://i.pravatar.cc/100?img=12" },
    confirmations: 5,
    waitingHours: 20,
    urgent: false,
    department: null,
    image: "https://picsum.photos/seed/LLS-2255/900/650",
  },
  {
    id: "LLS-2270",
    title: "Wi-Fi dead zone, Block A common room",
    category: "Portal/ICT",
    location: "Male Hostel, Block A",
    student: { name: "Grace Danladi", avatar: "https://i.pravatar.cc/100?img=32" },
    confirmations: 5,
    waitingHours: 4,
    urgent: false,
    department: null,
    image: "https://picsum.photos/seed/LLS-2270/900/650",
  },
  {
    id: "LLS-2261",
    title: "Flooded pathway near Lecture Hall 2",
    category: "General",
    location: "Lecture Hall 2, main walkway",
    student: { name: "Ibrahim Musa", avatar: "https://i.pravatar.cc/100?img=15" },
    confirmations: 5,
    waitingHours: 31,
    urgent: false,
    department: null,
    image: "https://picsum.photos/seed/LLS-2261/900/650",
  },
];

const MOCK_QUEUE = RAW_QUEUE.map((r) => ({
  ...r,
  required: 5,
  confirmedBy: makeConfirmers(r.id, r.confirmations),
}));

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
        Filed by <span className={`font-bold ${darkMode ? "text-white" : "text-black"}`}>{submitter.name}</span>
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
  const extra = confirmers.length - visible.length;

  return (
    <div>
      <button onClick={onToggle} className={`flex items-center gap-3 transition-opacity duration-150 ${expanded ? "" : "hover:opacity-80"}`}>
        <div className="flex -space-x-2">
          {visible.map((c, i) => (
            <Avatar key={i} name={c.name} avatar={c.avatar} className="relative w-8 h-8 rounded-full border-2 border-primary" />
          ))}
          {extra > 0 && (
            <div
              className={`relative w-8 h-8 rounded-full border-2 border-primary flex items-center justify-center text-[9px] font-black shrink-0 ${
                darkMode ? "bg-white/10 text-white" : "bg-gray-100 text-gray-700"
              }`}
            >
              +{extra}
            </div>
          )}
        </div>
        <span className={`text-xs font-semibold ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{confirmers.length} students confirmed this</span>
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
              {confirmers.map((c, i) => (
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
/* ESCALATE MODAL — portal-rendered, capped height, sticky header/foot */
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
    // POST /api/admin/reports/:id/escalate once the backend exists.
    await new Promise((resolve) => setTimeout(resolve, 700));
    onConfirm(report.id, { department, reason: reason.trim() });
    setSubmitting(false);
  };

  return createPortal(
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
        className={`relative w-full max-w-md max-h-[90vh] overflow-y-auto border ${darkMode ? "bg-[#0A0A0C] border-white/10" : "bg-white border-gray-200"}`}
      >
        <div className={`sticky top-0 z-10 flex items-start justify-between gap-4 p-6 border-b ${darkMode ? "bg-[#0A0A0C] border-white/10" : "bg-white border-gray-100"}`}>
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
              Escalating hands this off to another department or office — use it when this is outside what you can resolve directly, not
              just because it's taking a while.
            </p>
          </div>

          <div>
            <label className={`block text-[12px] font-bold uppercase tracking-wide mb-2 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              Escalate To
            </label>
            <div className="grid grid-cols-1 gap-2">
              {DEPARTMENTS.map((dept) => {
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

        <div className={`sticky bottom-0 z-10 flex items-center justify-end gap-3 p-6 border-t ${darkMode ? "bg-[#0A0A0C] border-white/10" : "bg-white border-gray-100"}`}>
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
    </motion.div>,
    document.body
  );
};

/* ------------------------------------------------------------------ */
/* ASSIGN MODAL — same treatment as Escalate: portal, capped height,   */
/* sticky header/footer. Assigning is routine (routing to the right    */
/* team) rather than urgent, so no reason field is required — just     */
/* pick a department and confirm.                                      */
/* ------------------------------------------------------------------ */

const AssignModal = ({ report, darkMode, onClose, onConfirm }) => {
  const [department, setDepartment] = useState(report.department || "");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = !!department;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    // Simulated assign delay — swap for a real
    // PATCH /api/admin/reports/:id/assign once the backend exists.
    await new Promise((resolve) => setTimeout(resolve, 600));
    onConfirm(report.id, { department, note: note.trim() });
    setSubmitting(false);
  };

  return createPortal(
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
        className={`relative w-full max-w-md max-h-[90vh] overflow-y-auto border ${darkMode ? "bg-[#0A0A0C] border-white/10" : "bg-white border-gray-200"}`}
      >
        <div className={`sticky top-0 z-10 flex items-start justify-between gap-4 p-6 border-b ${darkMode ? "bg-[#0A0A0C] border-white/10" : "bg-white border-gray-100"}`}>
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 shrink-0 bg-primary text-white flex items-center justify-center">
              <FiSend size={16} />
            </div>
            <div>
              <h3 className={`text-[16px] font-bold ${darkMode ? "text-white" : "text-gray-950"}`}>Assign Report</h3>
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
          <div>
            <label className={`block text-[12px] font-bold uppercase tracking-wide mb-2 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              Assign To Department
            </label>
            <div className="grid grid-cols-1 gap-2">
              {DEPARTMENTS.map((dept) => {
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
              Note <span className="normal-case font-medium text-gray-400">(optional)</span>
            </label>
            <textarea
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Anything this department should know before picking it up."
              className={`w-full px-4 py-3 border text-sm outline-none resize-none transition-colors duration-150 ${
                darkMode
                  ? "bg-white/[0.03] border-white/10 text-white placeholder:text-gray-600 focus:border-primary/50"
                  : "bg-white border-gray-200 text-gray-950 placeholder:text-gray-400 focus:border-primary/50"
              }`}
            />
          </div>
        </div>

        <div className={`sticky bottom-0 z-10 flex items-center justify-end gap-3 p-6 border-t ${darkMode ? "bg-[#0A0A0C] border-white/10" : "bg-white border-gray-100"}`}>
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
                <FiLoader className="animate-spin" size={14} /> Assigning...
              </>
            ) : (
              <>
                <FiCheck size={14} /> Confirm Assignment
              </>
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>,
    document.body
  );
};

/* ------------------------------------------------------------------ */
/* Queue card — wide image, filed-by, confirmers, actions               */
/* ------------------------------------------------------------------ */

const QueueCard = ({ report, index, darkMode, onVerify, onReject, onEscalate, onAssign }) => {
  const [showConfirmers, setShowConfirmers] = useState(false);
  const pct = Math.min(100, Math.round((report.confirmations / report.required) * 100));

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
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
              {report.escalatedTo ? `Escalated · ${report.escalatedTo}` : "Urgent"}
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
                {report.department && (
                  <span className={`text-[10.5px] font-bold px-1.5 py-0.5 ${darkMode ? "bg-white/[0.06] text-gray-300" : "bg-surface-light text-gray-600"}`}>
                    Assigned: {report.department}
                  </span>
                )}
              </div>

              <p className={`mt-3 flex items-center gap-1.5 text-[12px] font-semibold ${darkMode ? "text-gray-500" : "text-gray-500"}`}>
                <FiClock size={11} />
                Waiting {report.waitingHours}h for admin action
              </p>

              <SubmittedBy submitter={report.student} darkMode={darkMode} />
            </div>

            <div className={`border p-4 min-w-[150px] shrink-0 ${darkMode ? "bg-white/[0.03] border-white/10" : "bg-[#FAFAFA] border-gray-200"}`}>
              <p className={`text-[10px] uppercase tracking-[0.2em] flex items-center gap-1.5 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                <FiUsers size={11} />
                Confirmations
              </p>
              <h4 className={`mt-2 text-3xl font-black ${darkMode ? "text-white" : "text-black"}`}>{report.confirmations}</h4>
              {report.confirmations >= report.required ? (
                <p className="mt-1 flex items-center gap-1 text-primary text-xs font-bold">
                  <FiCheckCircle size={12} /> Fully confirmed
                </p>
              ) : (
                <p className="mt-1 text-primary text-xs font-semibold">/ {report.required} needed</p>
              )}
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

          {/* ESCALATION NOTE */}
          {report.escalatedTo && (
            <div className={`mt-5 flex items-start gap-3 border p-3 ${darkMode ? "bg-primary/10 border-primary/25" : "bg-red-50 border-red-200"}`}>
              <FiArrowUp className="text-primary shrink-0 mt-0.5" size={14} />
              <p className={`text-[12px] leading-relaxed ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                Escalated to <span className="font-bold">{report.escalatedTo}</span>: {report.escalationReason}
              </p>
            </div>
          )}

          {/* ACTIONS */}
          <div className={`mt-5 pt-5 border-t flex flex-wrap items-center gap-2.5 ${darkMode ? "border-white/10" : "border-gray-100"}`}>
            <button
              onClick={() => onVerify(report.id)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-primary text-white text-[12px] font-bold hover:bg-primary-dark transition-colors duration-150"
            >
              <FiCheck size={12} /> Verify
            </button>

            <button
              onClick={() => onEscalate(report)}
              disabled={!!report.escalatedTo}
              className={`flex items-center gap-1.5 px-3.5 py-2 text-[12px] font-bold border transition-colors duration-150 disabled:opacity-50 disabled:cursor-default ${
                darkMode ? "border-white/10 text-gray-300 hover:bg-white/[0.05]" : "border-gray-200 text-gray-600 hover:bg-surface-light"
              }`}
            >
              <FiArrowUp size={12} /> {report.escalatedTo ? "Escalated" : "Escalate"}
            </button>

            {/* ASSIGN TO DEPARTMENT — opens a modal, same pattern as Escalate */}
            <button
              onClick={() => onAssign(report)}
              className={`flex items-center gap-1.5 px-3.5 py-2 text-[12px] font-bold border transition-colors duration-150 ${
                darkMode ? "border-white/10 text-gray-300 hover:bg-white/[0.05]" : "border-gray-200 text-gray-600 hover:bg-surface-light"
              }`}
            >
              <FiSend size={12} /> {report.department ? `Assigned · ${report.department}` : "Assign"}
            </button>

            <button
              onClick={() => onReject(report.id)}
              className={`ml-auto flex items-center gap-1.5 px-3.5 py-2 text-[12px] font-bold border transition-colors duration-150 ${
                darkMode ? "border-primary/25 text-red-300 hover:bg-primary/10" : "border-red-200 text-primary hover:bg-red-50"
              }`}
            >
              <FiX size={12} /> Reject
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const ReportQueueTable = ({ darkMode, activeCategory, activeSort, search }) => {
  const [queue, setQueue] = useState(MOCK_QUEUE);
  const [escalateTarget, setEscalateTarget] = useState(null);
  const [assignTarget, setAssignTarget] = useState(null);

  const handleVerify = (id) => setQueue((prev) => prev.filter((r) => r.id !== id));
  const handleReject = (id) => setQueue((prev) => prev.filter((r) => r.id !== id));

  const handleEscalateConfirm = (id, { department, reason }) => {
    setQueue((prev) =>
      prev.map((r) => (r.id === id ? { ...r, urgent: true, escalatedTo: department, escalationReason: reason } : r))
    );
    setEscalateTarget(null);
  };

  const handleAssignConfirm = (id, { department, note }) => {
    setQueue((prev) => prev.map((r) => (r.id === id ? { ...r, department, assignNote: note } : r)));
    setAssignTarget(null);
  };

  const visible = useMemo(() => {
    let list = [...queue];

    if (activeCategory !== "All") list = list.filter((r) => r.category === activeCategory);

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((r) => r.title.toLowerCase().includes(q) || r.id.toLowerCase().includes(q) || r.student.name.toLowerCase().includes(q));
    }

    if (activeSort === "waiting") list.sort((a, b) => b.waitingHours - a.waitingHours);
    else if (activeSort === "urgent") list.sort((a, b) => (b.urgent ? 1 : 0) - (a.urgent ? 1 : 0));
    else if (activeSort === "recent") list.sort((a, b) => a.waitingHours - b.waitingHours);

    return list;
  }, [queue, activeCategory, activeSort, search]);

  if (visible.length === 0) {
    return (
      <div className={`border p-14 text-center ${darkMode ? "bg-[#0A0A0C] border-white/10" : "bg-white border-gray-200"}`}>
        <p className={`text-[14px] font-bold ${darkMode ? "text-white" : "text-gray-950"}`}>Queue is clear</p>
        <p className={`mt-1.5 text-[12.5px] ${darkMode ? "text-gray-500" : "text-gray-400"}`}>Nothing matches these filters right now.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col gap-5">
        <AnimatePresence mode="popLayout">
          {visible.map((report, i) => (
            <QueueCard
              key={report.id}
              report={report}
              index={i}
              darkMode={darkMode}
              onVerify={handleVerify}
              onReject={handleReject}
              onEscalate={setEscalateTarget}
              onAssign={setAssignTarget}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* ESCALATE MODAL */}
      <AnimatePresence>
        {escalateTarget && (
          <EscalateModal
            report={escalateTarget}
            darkMode={darkMode}
            onClose={() => setEscalateTarget(null)}
            onConfirm={handleEscalateConfirm}
          />
        )}
      </AnimatePresence>

      {/* ASSIGN MODAL */}
      <AnimatePresence>
        {assignTarget && (
          <AssignModal
            report={assignTarget}
            darkMode={darkMode}
            onClose={() => setAssignTarget(null)}
            onConfirm={handleAssignConfirm}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReportQueueTable;