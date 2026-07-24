import { useEffect, useRef, useState } from "react";
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
  FiUpload,
  FiX,
  FiImage,
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
  `confirmedByAvatars` is a stand-in for GET /api/reports/:id/confirmers
  — the small avatar stack of people who already confirmed.

  `alreadyConfirmedByMe` marks a report the CURRENT viewer has already
  confirmed — stand-in for GET /api/reports/:id/confirmed-by-me. Drives
  the button's initial locked/checked state.

  Confirming is now a 3-step modal flow (optimistic UI, no backend yet):
    1. upload evidence
    2. fake "AI is verifying" delay
    3. submitted, with a Cancel/close button that finalizes the confirm
  Wire step 1's file to a real upload endpoint and step 2's delay to a
  real verification call once those exist.
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
    confirmations: 2,
    required: 5,
    alreadyConfirmedByMe: false,
    image: "https://picsum.photos/seed/LLS-2291/600/450",
    submitter: { name: "Aisha Bello", avatar: "https://i.pravatar.cc/100?img=47" },
    confirmedByAvatars: [
      { avatar: "https://i.pravatar.cc/100?img=12" },
      { initials: "TN" },
    ],
  },
  {
    id: "LLS-2288",
    title: "Faulty perimeter light near Gate 2",
    category: "Security",
    campus: "Abuja",
    time: "2h ago",
    status: "confirming",
    confirmations: 4,
    required: 5,
    alreadyConfirmedByMe: true,
    image: "https://picsum.photos/seed/LLS-2288/600/450",
    submitter: { name: "Ade Okafor", initials: "AO" },
    confirmedByAvatars: [
      { initials: "KO" },
      { avatar: "https://i.pravatar.cc/100?img=9" },
      { initials: "MU" },
      { avatar: "https://i.pravatar.cc/100?img=52" },
    ],
  },
  {
    id: "LLS-2285",
    title: "No water supply — female hostel wing B",
    category: "Water",
    campus: "Gombe",
    time: "5h ago",
    status: "confirming",
    confirmations: 4,
    required: 5,
    alreadyConfirmedByMe: false,
    image: "https://picsum.photos/seed/LLS-2285/600/450",
    submitter: { name: "Grace Momoh", avatar: "https://i.pravatar.cc/100?img=32" },
    confirmedByAvatars: [
      { avatar: "https://i.pravatar.cc/100?img=3" },
      { initials: "FJ" },
      { avatar: "https://i.pravatar.cc/100?img=44" },
      { initials: "OB" },
    ],
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
      className={`w-9 h-9 shrink-0 flex items-center justify-center text-xs font-bold bg-red-600 text-white`}
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

// Small overlapping stack of people who've already confirmed — capped at 4
// visible avatars with a "+N" tile for the rest, so a report with a lot of
// confirmations doesn't blow out the card's width.
const ConfirmedByStack = ({ avatars = [], total, darkMode }) => {
  const MAX_SHOWN = 4;
  const shown = avatars.slice(0, MAX_SHOWN);
  const overflow = Math.max(0, total - shown.length);

  if (shown.length === 0) return null;

  return (
    <div className="flex items-center gap-2">
      <div className="flex -space-x-2">
        {shown.map((person, i) => (
          <div key={i} style={{ zIndex: shown.length - i }}>
            {person.avatar ? (
              <img
                src={person.avatar}
                alt=""
                className={`w-7 h-7 object-cover border-2 ${darkMode ? "border-[#0A0A0C]" : "border-white"}`}
              />
            ) : (
              <div
                className={`w-7 h-7 flex items-center justify-center text-[11px] font-bold tracking-tight leading-none bg-red-600 text-white border-2 ${
                  darkMode ? "border-[#0A0A0C]" : "border-white"
                }`}
              >
                {person.initials}
              </div>
            )}
          </div>
        ))}
        {overflow > 0 && (
          <div
            className={`w-7 h-7 flex items-center justify-center text-[11px] font-bold leading-none bg-red-600 text-white border-2 ${
              darkMode ? "border-[#0A0A0C]" : "border-white"
            }`}
          >
            +{overflow}
          </div>
        )}
      </div>
      <span className={`text-xs font-semibold ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
        {total} confirmed
      </span>
    </div>
  );
};

// AI verification spinner — square ring (keeps the app's zero-border-radius
// language) rotating against a static track, in the same red as the confirm
// action so the whole modal flow reads as one continuous motion.
const VerifyingSpinner = () => (
  <div className="relative w-14 h-14">
    <div className="absolute inset-0 border-4 border-red-600/15" />
    <motion.div
      className="absolute inset-0 border-4 border-transparent border-t-red-600"
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 0.85, ease: "linear" }}
    />
  </div>
);

// Celebration burst — a dozen small squares fire outward from the button the
// instant a confirmation finalizes, then the whole card collapses out of the
// list right after. Pure CSS/motion, no confetti dependency.
const CONFETTI_COLORS = ["bg-red-600", "bg-primary", "bg-white", "bg-red-400"];
const CELEBRATION_PARTICLES = Array.from({ length: 12 }, (_, i) => {
  const angle = (i / 12) * Math.PI * 2;
  return {
    id: i,
    x: Math.cos(angle) * (60 + Math.random() * 30),
    y: Math.sin(angle) * (60 + Math.random() * 30),
    rotate: Math.random() * 360,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
  };
});

const CelebrationBurst = () => (
  <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center overflow-hidden">
    {CELEBRATION_PARTICLES.map((p) => (
      <motion.span
        key={p.id}
        className={`absolute w-2 h-2 ${p.color}`}
        initial={{ x: 0, y: 0, opacity: 1, scale: 1, rotate: 0 }}
        animate={{ x: p.x, y: p.y, opacity: 0, scale: 0.4, rotate: p.rotate }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      />
    ))}
  </div>
);

// Confirm flow modal: upload evidence -> AI verifying -> submitted.
// Rendered fixed/inset-0, so its position in the tree doesn't matter.
const ConfirmEvidenceModal = ({ report, darkMode, onClose, onFinalize }) => {
  const [step, setStep] = useState("upload"); // upload | verifying | submitted
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
      if (preview) URL.revokeObjectURL(preview);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePickFile = () => fileInputRef.current?.click();

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (preview) URL.revokeObjectURL(preview);
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleRemoveFile = () => {
    if (preview) URL.revokeObjectURL(preview);
    setFile(null);
    setPreview(null);
  };

  const handleSubmitEvidence = () => {
    if (!file) return;
    setStep("verifying");
    // Stand-in for a real AI verification call — swap for the actual
    // POST /api/reports/:id/verify-evidence request once it exists.
    setTimeout(() => setStep("submitted"), 2200);
  };

  const handleFinalCancel = () => {
    onFinalize();
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={step === "upload" ? onClose : undefined}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.98 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className={`relative w-full max-w-[420px] border ${
          darkMode ? "bg-[#0A0A0C] border-white/10" : "bg-white border-gray-200"
        }`}
      >
        {/* HEADER */}
        <div className={`flex items-center justify-between px-5 py-4 border-b ${darkMode ? "border-white/10" : "border-gray-200"}`}>
          <div className="min-w-0 pr-4">
            <h3 className={`text-sm font-black tracking-tight ${darkMode ? "text-white" : "text-gray-950"}`}>
              Confirm this report
            </h3>
            <p className={`mt-0.5 text-xs truncate ${darkMode ? "text-gray-500" : "text-gray-400"}`}>{report.title}</p>
          </div>
          {step === "upload" && (
            <button
              onClick={onClose}
              className={`shrink-0 w-8 h-8 flex items-center justify-center transition-colors ${
                darkMode ? "text-gray-500 hover:text-white hover:bg-white/10" : "text-gray-400 hover:text-gray-900 hover:bg-gray-100"
              }`}
              aria-label="Close"
            >
              <FiX size={16} />
            </button>
          )}
        </div>

        {/* BODY */}
        <div className="p-5">
          <AnimatePresence mode="wait">
            {step === "upload" && (
              <motion.div
                key="upload"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col gap-4"
              >
                <p className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                  Upload a photo showing this issue is real — it helps AI verify the report faster.
                </p>

                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />

                {!preview ? (
                  <button
                    onClick={handlePickFile}
                    className={`flex flex-col items-center justify-center gap-2 h-36 border border-dashed transition-colors ${
                      darkMode ? "border-white/15 text-gray-500 hover:border-white/30 hover:text-gray-300" : "border-gray-300 text-gray-400 hover:border-gray-400 hover:text-gray-600"
                    }`}
                  >
                    <FiUpload size={20} />
                    <span className="text-xs font-semibold">Tap to upload evidence</span>
                  </button>
                ) : (
                  <div className={`relative h-36 border ${darkMode ? "border-white/10" : "border-gray-200"}`}>
                    <img src={preview} alt="Evidence preview" className="w-full h-full object-cover" />
                    <button
                      onClick={handleRemoveFile}
                      className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center bg-black/60 text-white hover:bg-black/80 transition-colors"
                      aria-label="Remove evidence"
                    >
                      <FiX size={14} />
                    </button>
                    <div className="absolute bottom-2 left-2 flex items-center gap-1.5 px-2 py-1 bg-black/60 text-white text-[11px] font-semibold">
                      <FiImage size={12} /> {file?.name}
                    </div>
                  </div>
                )}

                <button
                  onClick={handleSubmitEvidence}
                  disabled={!file}
                  className={`w-full py-2.5 text-sm font-bold border transition-colors duration-200 ${
                    file ? "bg-red-600 text-white border-red-600 hover:bg-red-700" : darkMode ? "bg-white/5 text-gray-600 border-white/10 cursor-not-allowed" : "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                  }`}
                >
                  Submit evidence
                </button>
              </motion.div>
            )}

            {step === "verifying" && (
              <motion.div
                key="verifying"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col items-center justify-center gap-4 py-8 text-center"
              >
                <VerifyingSpinner />
                <div>
                  <p className={`text-sm font-bold ${darkMode ? "text-white" : "text-gray-950"}`}>AI is verifying your evidence</p>
                  <p className={`mt-1 text-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}>This usually takes a few seconds</p>
                </div>
              </motion.div>
            )}

            {step === "submitted" && (
              <motion.div
                key="submitted"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col items-center gap-4 py-6 text-center"
              >
                <motion.div
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 18 }}
                  className="w-12 h-12 flex items-center justify-center bg-red-600 text-white"
                >
                  <FiCheck size={22} />
                </motion.div>
                <div>
                  <p className={`text-sm font-bold ${darkMode ? "text-white" : "text-gray-950"}`}>Evidence submitted</p>
                  <p className={`mt-1 text-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                    Your confirmation has been recorded for this report
                  </p>
                </div>
                <button
                  onClick={handleFinalCancel}
                  className={`w-full py-2.5 text-sm font-bold border transition-colors duration-200 ${
                    darkMode ? "bg-white/5 text-gray-300 border-white/10 hover:bg-white/10" : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  Cancel
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};

const ReportCard = ({ report, darkMode, index, isInView, onConfirmed }) => {
  const [confirmations, setConfirmations] = useState(report.confirmations);
  const [confirmed, setConfirmed] = useState(report.alreadyConfirmedByMe);
  const [modalOpen, setModalOpen] = useState(false);
  const [celebrating, setCelebrating] = useState(false);
  const cfg = CATEGORY_CFG[report.category] || CATEGORY_CFG.General;
  const status = STATUS_CFG[report.status];
  const remaining = Math.max(0, report.required - confirmations);
  const complete = remaining === 0;

  const handleConfirmClick = () => {
    if (confirmed || complete) return;
    setModalOpen(true);
  };

  const handleFinalizeConfirm = () => {
    setConfirmed(true);
    setConfirmations((c) => Math.min(report.required, c + 1));
    setModalOpen(false);
    setCelebrating(true);
    // Give the burst a beat to play, then the card collapses out of the
    // list. Frontend-only for now — there's no backend yet, so this is
    // local state: a page refresh re-mounts the hardcoded MOCK_REPORTS
    // and the report will be back. Swap onConfirmed for a real
    // POST /api/reports/:id/confirm + refetch once that endpoint exists,
    // and it'll stay gone across refreshes too.
    setTimeout(() => onConfirmed(report.id), 750);
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
      exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.25 } }}
      layout
      transition={{ duration: 0.45, delay: 0.15 + index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className={`relative group flex flex-col border overflow-hidden ${
        darkMode ? "bg-white/[0.02] border-white/10" : "bg-white border-gray-200"
      }`}
    >
      <AnimatePresence>{celebrating && <CelebrationBurst />}</AnimatePresence>

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

        <ConfirmedByStack avatars={report.confirmedByAvatars} total={confirmations} darkMode={darkMode} />

        <button
          onClick={handleConfirmClick}
          disabled={confirmed || complete}
          className={`relative overflow-hidden w-full flex items-center justify-center gap-2 py-2.5 text-sm font-bold border transition-colors duration-200 ${
            confirmed || complete
              ? "bg-white text-red-600 border-red-600"
              : "bg-red-600 text-white border-red-600 hover:bg-red-700"
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

      <AnimatePresence>
        {modalOpen && (
          <ConfirmEvidenceModal
            report={report}
            darkMode={darkMode}
            onClose={() => setModalOpen(false)}
            onFinalize={handleFinalizeConfirm}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const RecentReports = ({ darkMode }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [reports, setReports] = useState(MOCK_REPORTS);

  const handleReportConfirmed = (id) => {
    setReports((prev) => prev.filter((r) => r.id !== id));
  };

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
        <AnimatePresence mode="popLayout">
          {reports.map((report, index) => (
            <ReportCard
              key={report.id}
              report={report}
              darkMode={darkMode}
              index={index}
              isInView={isInView}
              onConfirmed={handleReportConfirmed}
            />
          ))}
        </AnimatePresence>
      </div>
    </motion.section>
  );
};

export default RecentReports;