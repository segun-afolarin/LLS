import { useMemo, useState } from "react";
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
  FiMapPin,
  FiClock,
  FiEdit2,
  FiXCircle,
  FiImage,
  FiUsers,
  FiThumbsUp,
  FiCamera,
  FiCompass,
  FiCheckCircle,
  FiX,
  FiSave,
  FiTrash2,
  FiLoader,
} from "react-icons/fi";

/*
  FRONTEND-ONLY NOTE
  -------------------
  No backend yet.
  - MOCK_MY_REPORTS stands in for GET /api/reports/mine.
  - MOCK_CONFIRMED_REPORTS stands in for GET /api/reports/confirmed
    (reports submitted by other students that the current user
    confirmed with a photo).
  - Editing and deleting are both fully local/fake: handleSaveEdit
    updates the in-memory `reports` array, and handleConfirmDelete
    filters the deleted report out of it. Neither persists anywhere,
    so refreshing the page resets both back to MOCK_MY_REPORTS — swap
    for real PATCH /api/reports/:id and DELETE /api/reports/:id calls
    once the backend exists, and this component won't need
    restructuring, just the two handlers rewired.
  - Editing is inline (no modal/popup): the card's own text turns into
    form fields under an "Edit" toggle. Editing is intentionally
    text-only (title, description, location, category) — the photo
    evidence can't be changed here.
  - Edit is gated on confirmation count, delete is not: a report with
    ZERO confirmations can be edited (nobody has acted on it yet, so
    it's still safe to change) AND deleted. Once it has at least one
    confirmation, editing the text would be misleading to the people
    who already confirmed the original claim, so only Delete remains
    — swap this rule out easily by editing `canEdit` / `canDelete`
    inside MyReportCard below.
*/

const CATEGORIES = ["Hostel", "Portal/ICT", "Security", "Water", "Electricity", "Library", "Medical", "Harassment", "General"];

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

const STAGES = ["pending", "confirming", "verified", "resolved"];
const STAGE_LABELS = { pending: "Submitted", confirming: "Confirming", verified: "Verified", resolved: "Resolved" };

const initialsOf = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("") || "?";

const MOCK_MY_REPORTS = [
  {
    id: "LLS-2296",
    title: "Broken chair, Lecture Hall 4",
    category: "General",
    location: "Lecture Hall 4, Faculty of Science",
    time: "1h ago",
    status: "pending",
    confirmations: 2,
    required: 5,
    image: "https://picsum.photos/seed/LLS-2296/900/650",
    description: "Third row from the front, chair leg is cracked and wobbles. Minor but someone will get hurt eventually.",
    confirmedBy: [
      { name: "Tunde Ade", avatar: "https://i.pravatar.cc/100?img=12" },
      { name: "Ade Okafor" },
    ],
  },
  {
    id: "LLS-2292",
    title: "Flickering light, Reading Room B",
    category: "Electricity",
    location: "Main Library, Reading Room B",
    time: "6h ago",
    status: "pending",
    confirmations: 0,
    required: 5,
    image: "https://picsum.photos/seed/LLS-2292/900/650",
    description: "The overhead light strip flickers constantly, distracting during study sessions and possibly a wiring issue.",
    confirmedBy: [],
  },
  {
    id: "LLS-2291",
    title: "Broken water heater — Block C hostel",
    category: "Hostel",
    location: "Male Hostel, Block C, 2nd floor",
    time: "12m ago",
    status: "confirming",
    confirmations: 3,
    required: 5,
    image: "https://picsum.photos/seed/LLS-2291/900/650",
    description: "Water heater in the 2nd floor bathroom has been cold for three days now. Several of us have reported it verbally already.",
    confirmedBy: [
      { name: "Aisha Bello", avatar: "https://i.pravatar.cc/100?img=47" },
      { name: "Grace Momoh", avatar: "https://i.pravatar.cc/100?img=32" },
      { name: "Ibrahim Musa" },
    ],
  },
  {
    id: "LLS-2270",
    title: "Wi-Fi dead zone, Block A common room",
    category: "Portal/ICT",
    location: "Male Hostel, Block A",
    time: "2d ago",
    status: "confirming",
    confirmations: 2,
    required: 5,
    image: "https://picsum.photos/seed/LLS-2270/900/650",
    description: "No signal reaches the common room at all, making it impossible to submit assignments from there.",
    confirmedBy: [{ name: "Tunde Ade", avatar: "https://i.pravatar.cc/100?img=12" }, { name: "Grace Momoh" }],
  },
  {
    id: "LLS-2255",
    title: "Loose handrail, Admin building stairs",
    category: "Security",
    location: "Admin Building, main staircase",
    time: "3d ago",
    status: "confirming",
    confirmations: 4,
    required: 5,
    image: "https://picsum.photos/seed/LLS-2255/900/650",
    description: "The handrail on the second flight wobbles when leaned on — a real fall risk during rush hour between classes.",
    confirmedBy: [
      { name: "Aisha Bello", avatar: "https://i.pravatar.cc/100?img=47" },
      { name: "Ibrahim Musa", avatar: "https://i.pravatar.cc/100?img=15" },
      { name: "Ade Okafor" },
      { name: "Grace Momoh", avatar: "https://i.pravatar.cc/100?img=32" },
    ],
  },
  {
    id: "LLS-2290",
    title: "Student portal login failing since Monday",
    category: "Portal/ICT",
    location: "University-wide (student portal)",
    time: "44m ago",
    status: "verified",
    confirmations: 5,
    required: 5,
    image: "https://picsum.photos/seed/LLS-2290/900/650",
    description: "Getting a 500 error on login for the past three days. Can't check results or register courses.",
    confirmedBy: [
      { name: "Aisha Bello", avatar: "https://i.pravatar.cc/100?img=47" },
      { name: "Ade Okafor" },
      { name: "Grace Momoh", avatar: "https://i.pravatar.cc/100?img=32" },
      { name: "Ibrahim Musa", avatar: "https://i.pravatar.cc/100?img=15" },
      { name: "Tunde Ade" },
    ],
  },
  {
    id: "LLS-2201",
    title: "Leaking pipe outside female hostel",
    category: "Water",
    location: "Female Hostel, exterior wall",
    time: "1w ago",
    status: "verified",
    confirmations: 5,
    required: 5,
    image: "https://picsum.photos/seed/LLS-2201/900/650",
    description: "Steady leak along the exterior wall is pooling water and starting to erode the path beside it.",
    confirmedBy: [
      { name: "Grace Momoh", avatar: "https://i.pravatar.cc/100?img=32" },
      { name: "Ade Okafor" },
      { name: "Aisha Bello", avatar: "https://i.pravatar.cc/100?img=47" },
      { name: "Ibrahim Musa" },
      { name: "Tunde Ade", avatar: "https://i.pravatar.cc/100?img=12" },
    ],
  },
  {
    id: "LLS-2160",
    title: "Broken window latch, Room 214",
    category: "Hostel",
    location: "Male Hostel, Room 214",
    time: "2w ago",
    status: "resolved",
    confirmations: 5,
    required: 5,
    image: "https://picsum.photos/seed/LLS-2160/900/650",
    description: "Latch snapped off entirely, window doesn't stay shut. Maintenance has since replaced the hardware.",
    confirmedBy: [
      { name: "Tunde Ade", avatar: "https://i.pravatar.cc/100?img=12" },
      { name: "Ade Okafor" },
      { name: "Grace Momoh", avatar: "https://i.pravatar.cc/100?img=32" },
      { name: "Aisha Bello" },
      { name: "Ibrahim Musa", avatar: "https://i.pravatar.cc/100?img=15" },
    ],
  },
  {
    id: "LLS-2140",
    title: "Projector not working, Lecture Hall 1",
    category: "General",
    location: "Lecture Hall 1",
    time: "3w ago",
    status: "resolved",
    confirmations: 5,
    required: 5,
    image: "https://picsum.photos/seed/LLS-2140/900/650",
    description: "Bulb had blown and the projector wouldn't power on for any lecture. Facilities swapped it out.",
    confirmedBy: [
      { name: "Ade Okafor" },
      { name: "Grace Momoh", avatar: "https://i.pravatar.cc/100?img=32" },
      { name: "Aisha Bello", avatar: "https://i.pravatar.cc/100?img=47" },
      { name: "Ibrahim Musa" },
      { name: "Tunde Ade", avatar: "https://i.pravatar.cc/100?img=12" },
    ],
  },
];

const MOCK_CONFIRMED_REPORTS = [
  {
    id: "LLS-2299",
    title: "Suspicious individual near female hostel gate",
    category: "Harassment",
    location: "Female Hostel, back gate",
    time: "3h ago",
    status: "confirming",
    confirmations: 3,
    required: 5,
    image: "https://picsum.photos/seed/LLS-2299/900/650",
    description: "A non-student has been loitering near the back gate for two evenings in a row. Security should be notified urgently.",
    submittedBy: { name: "Grace Momoh", avatar: "https://i.pravatar.cc/100?img=32" },
    confirmedOn: "3h ago",
    myEvidence: "https://picsum.photos/seed/evidence-2299/500/350",
  },
  {
    id: "LLS-2285",
    title: "No water supply — female hostel wing B",
    category: "Water",
    location: "Female Hostel, Wing B",
    time: "5h ago",
    status: "confirming",
    confirmations: 4,
    required: 5,
    image: "https://picsum.photos/seed/LLS-2285/900/650",
    description: "No running water in Wing B since yesterday morning. Entire wing is affected, not just one room.",
    submittedBy: { name: "Grace Momoh", avatar: "https://i.pravatar.cc/100?img=32" },
    confirmedOn: "4h ago",
    myEvidence: "https://picsum.photos/seed/evidence-2285/500/350",
  },
  {
    id: "LLS-2288",
    title: "Faulty perimeter light near Gate 2",
    category: "Security",
    location: "Gate 2, main entrance",
    time: "2h ago",
    status: "verified",
    confirmations: 5,
    required: 5,
    image: "https://picsum.photos/seed/LLS-2288/900/650",
    description: "The light near the security post at Gate 2 has been out for a week. Genuinely dark walking through there at night.",
    submittedBy: { name: "Ibrahim Musa", avatar: "https://i.pravatar.cc/100?img=15" },
    confirmedOn: "1d ago",
    myEvidence: "https://picsum.photos/seed/evidence-2288/500/350",
  },
];

const Avatar = ({ name, avatar, className = "" }) => {
  const [broken, setBroken] = useState(false);
  const showImage = !!avatar && !broken;

  return (
    <div className={`flex items-center justify-center overflow-hidden shrink-0 ${className}`}>
      {showImage ? (
        <img src={avatar} alt={name} className="w-full h-full object-cover" onError={() => setBroken(true)} />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white text-[10px] font-black">
          {initialsOf(name)}
        </div>
      )}
    </div>
  );
};

const ConfirmerAvatars = ({ confirmers, darkMode }) => {
  if (!confirmers?.length) return null;
  const visible = confirmers.slice(0, 5);
  const extra = confirmers.length - visible.length;

  return (
    <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
      <div className="flex -space-x-2">
        {visible.map((c, i) => (
          <Avatar key={i} name={c.name} avatar={c.avatar} className="relative w-8 h-8 rounded-full border-2 border-primary" />
        ))}
        {extra > 0 && (
          <div
            className={`w-8 h-8 rounded-full border-2 border-primary flex items-center justify-center text-[9px] font-black shrink-0 ${
              darkMode ? "bg-white/10 text-white" : "bg-gray-100 text-gray-700"
            }`}
          >
            +{extra}
          </div>
        )}
      </div>
      <span className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
        {confirmers.length === 1 ? "student confirmed this" : "students confirmed this"}
      </span>
    </div>
  );
};

const SubmittedBy = ({ submitter, darkMode }) => {
  if (!submitter) return null;
  return (
    <div className="mt-3 flex items-center gap-2">
      <Avatar name={submitter.name} avatar={submitter.avatar} className="w-7 h-7 rounded-full border-2 border-primary" />
      <span className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
        Reported by <span className={`font-bold ${darkMode ? "text-white" : "text-black"}`}>{submitter.name}</span>
      </span>
    </div>
  );
};

const StatusStepper = ({ status, darkMode }) => {
  const currentIndex = STAGES.indexOf(status);

  return (
    <div className="flex items-center gap-1.5">
      {STAGES.map((stage, i) => {
        const isDone = i <= currentIndex;
        return (
          <div key={stage} className="flex items-center gap-1.5">
            <div
              className={`w-2 h-2 shrink-0 ${
                isDone ? (stage === "resolved" && isDone ? "bg-primary" : "bg-emerald-500") : darkMode ? "bg-white/10" : "bg-gray-200"
              }`}
            />
            {i < STAGES.length - 1 && <div className={`w-4 h-px ${i < currentIndex ? "bg-emerald-500" : darkMode ? "bg-white/10" : "bg-gray-200"}`} />}
          </div>
        );
      })}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* INLINE EDIT FORM — replaces the card's text block in place,         */
/* no modal/popup. Only ever mounted for reports with 0 confirmations. */
/* ------------------------------------------------------------------ */

const InlineEditForm = ({ report, darkMode, onCancel, onSave, saving }) => {
  const [form, setForm] = useState({
    title: report.title,
    description: report.description,
    location: report.location,
    category: report.category,
  });

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));
  const isValid = form.title.trim() && form.description.trim() && form.location.trim();

  const fieldClass = (extra = "") =>
    `w-full px-3.5 py-2.5 border text-sm outline-none transition-colors duration-150 ${
      darkMode
        ? "bg-white/[0.03] border-white/10 text-white placeholder:text-gray-600 focus:border-primary/60"
        : "bg-white border-gray-200 text-gray-950 placeholder:text-gray-400 focus:border-primary/60"
    } ${extra}`;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="overflow-hidden"
    >
      <div className={`border p-4 sm:p-5 ${darkMode ? "bg-white/[0.03] border-white/10" : "bg-[#FAFAFA] border-gray-200"}`}>
        <div className="flex items-center gap-2 mb-4">
          <FiEdit2 size={13} className="text-primary" />
          <p className={`text-[11px] font-black uppercase tracking-[0.14em] ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
            Editing report — text only
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="sm:col-span-1">
            <label className={`block text-[11px] font-bold uppercase tracking-wide mb-1.5 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
              Category
            </label>
            <select value={form.category} onChange={(e) => update("category", e.target.value)} className={fieldClass()}>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-1">
            <label className={`block text-[11px] font-bold uppercase tracking-wide mb-1.5 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
              Location
            </label>
            <div
              className={`flex items-center gap-2 px-3.5 py-2.5 border transition-colors duration-150 ${
                darkMode ? "bg-white/[0.03] border-white/10 focus-within:border-primary/60" : "bg-white border-gray-200 focus-within:border-primary/60"
              }`}
            >
              <FiMapPin className={darkMode ? "text-gray-500" : "text-gray-400"} size={14} />
              <input
                type="text"
                value={form.location}
                onChange={(e) => update("location", e.target.value)}
                className={`flex-1 min-w-0 bg-transparent text-sm outline-none ${darkMode ? "text-white" : "text-gray-950"}`}
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label className={`block text-[11px] font-bold uppercase tracking-wide mb-1.5 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
              Report Title
            </label>
            <input type="text" value={form.title} onChange={(e) => update("title", e.target.value)} className={fieldClass()} />
          </div>

          <div className="sm:col-span-2">
            <label className={`block text-[11px] font-bold uppercase tracking-wide mb-1.5 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
              Description
            </label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              className={fieldClass("resize-none")}
            />
          </div>
        </div>

        <p className={`mt-3.5 text-[11.5px] leading-relaxed ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
          Photo evidence can't be changed here. Delete this report and file a new one if you need a different photo.
        </p>

        <div className="mt-4 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2.5">
          <button
            onClick={onCancel}
            disabled={saving}
            className={`flex items-center justify-center gap-1.5 h-10 px-4 border font-semibold text-xs uppercase tracking-wide transition-colors duration-200 disabled:opacity-50 ${
              darkMode ? "border-white/10 text-gray-300 hover:bg-white/[0.05]" : "border-gray-200 text-gray-600 hover:bg-white"
            }`}
          >
            <FiX size={13} /> Cancel
          </button>
          <button
            onClick={() => isValid && onSave(form)}
            disabled={saving || !isValid}
            className="flex items-center justify-center gap-1.5 h-10 px-5 bg-primary text-white font-semibold text-xs uppercase tracking-wide hover:bg-primary-dark transition-colors duration-200 disabled:opacity-60"
          >
            {saving ? (
              <>
                <FiLoader className="animate-spin" size={13} /> Saving...
              </>
            ) : (
              <>
                <FiSave size={13} /> Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

/* ------------------------------------------------------------------ */
/* DELETE CONFIRM MODAL — still a lightweight confirm dialog, since    */
/* deletion is destructive and irreversible.                           */
/* ------------------------------------------------------------------ */

const DeleteConfirmModal = ({ report, darkMode, onCancel, onConfirm, deleting }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
    onClick={(e) => e.target === e.currentTarget && !deleting && onCancel()}
  >
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 16, scale: 0.96 }}
      transition={{ duration: 0.2 }}
      className={`w-full max-w-sm border p-6 sm:p-7 ${darkMode ? "bg-[#0A0A0C] border-white/10" : "bg-white border-gray-200"}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="w-11 h-11 shrink-0 bg-primary/10 border border-primary/25 flex items-center justify-center">
          <FiTrash2 className="text-primary" size={18} />
        </div>
        <button
          onClick={onCancel}
          disabled={deleting}
          className={`p-1.5 disabled:opacity-40 ${darkMode ? "text-gray-500 hover:text-white" : "text-gray-400 hover:text-black"}`}
        >
          <FiX size={18} />
        </button>
      </div>

      <h3 className={`mt-4 text-lg font-black ${darkMode ? "text-white" : "text-gray-950"}`}>Delete report?</h3>
      <p className={`mt-2 text-sm leading-relaxed ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
        Are you sure you want to delete <span className={`font-bold ${darkMode ? "text-white" : "text-black"}`}>"{report?.title}"</span>? This
        cannot be undone.
      </p>

      <div className="mt-6 flex flex-col-reverse sm:flex-row gap-3">
        <button
          onClick={onCancel}
          disabled={deleting}
          className={`flex-1 py-3 text-xs font-black uppercase tracking-[0.15em] border transition-colors disabled:opacity-50 ${
            darkMode ? "border-white/10 text-gray-300 hover:bg-white/[0.05]" : "border-gray-200 text-gray-700 hover:bg-gray-50"
          }`}
        >
          No, keep it
        </button>
        <button
          onClick={onConfirm}
          disabled={deleting}
          className="flex-1 py-3 text-xs font-black uppercase tracking-[0.15em] text-white bg-primary hover:bg-primary-dark transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {deleting ? (
            <>
              <FiLoader className="animate-spin" size={13} /> Deleting...
            </>
          ) : (
            "Yes, delete"
          )}
        </button>
      </div>
    </motion.div>
  </motion.div>
);

/* ------------------------------------------------------------------ */
/* "My Reports" card — wide hero image, confirmers, inline edit/delete */
/*                                                                      */
/* Rule: reports with 0 confirmations → editable only (inline form).   */
/*       reports with 1+ confirmations → deletable only.               */
/* ------------------------------------------------------------------ */

const MyReportCard = ({ report, index, darkMode, onSaveEdit, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const canEdit = report.confirmations === 0;
  const canDelete = true;
  const pct = Math.min(100, Math.round((report.confirmations / report.required) * 100));

  const handleSave = async (updates) => {
    setSaving(true);
    // Simulated save delay — swap for a real PATCH /api/reports/:id once the backend exists.
    await new Promise((resolve) => setTimeout(resolve, 700));
    onSaveEdit(report.id, updates);
    setSaving(false);
    setIsEditing(false);
  };

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
      <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr]">
        {/* IMAGE */}
        <div className="relative h-[220px] lg:h-full overflow-hidden">
          <img
            src={report.image}
            alt={report.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
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
            <div className="min-w-0 flex-1">
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

              {!isEditing && (
                <p className={`mt-4 max-w-2xl text-sm leading-relaxed ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                  {report.description}
                </p>
              )}
            </div>

            <div className={`border p-4 min-w-[160px] w-full sm:w-auto shrink-0 ${darkMode ? "bg-white/[0.03] border-white/10" : "bg-[#FAFAFA] border-gray-200"}`}>
              <p className={`text-[10px] uppercase tracking-[0.2em] flex items-center gap-1.5 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                <FiUsers size={11} />
                Confirmations
              </p>
              <h4 className={`mt-2 text-3xl font-black ${darkMode ? "text-white" : "text-black"}`}>{report.confirmations}</h4>
              <p className="mt-1 text-primary text-xs font-semibold">/ {report.required} needed</p>
            </div>
          </div>

          {/* INLINE EDIT FORM — replaces the description/detail area */}
          <AnimatePresence initial={false}>
            {isEditing && (
              <div className="mt-4">
                <InlineEditForm
                  report={report}
                  darkMode={darkMode}
                  saving={saving}
                  onCancel={() => setIsEditing(false)}
                  onSave={handleSave}
                />
              </div>
            )}
          </AnimatePresence>

          {/* PROGRESS */}
          {!isEditing && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2.5">
                <div className={`flex items-center gap-2 text-xs font-semibold ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                  <FiUsers size={13} />
                  Verification progress
                </div>
                <span className="text-primary font-bold text-xs">
                  {report.confirmations}/{report.required}
                </span>
              </div>

              <div className={`relative h-2.5 overflow-hidden ${darkMode ? "bg-white/10" : "bg-gray-200"}`}>
                <motion.div
                  initial={false}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className="h-full bg-primary"
                />
              </div>
            </div>
          )}

          {/* WHO CONFIRMED IT */}
          {!isEditing && report.confirmedBy?.length > 0 && (
            <div className="mt-5">
              <ConfirmerAvatars confirmers={report.confirmedBy} darkMode={darkMode} />
            </div>
          )}

          {/* FOOTER */}
          {!isEditing && (
            <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <StatusStepper status={report.status} darkMode={darkMode} />
                <span className={`text-[11px] font-bold uppercase tracking-wide ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                  {STAGE_LABELS[report.status]}
                </span>
              </div>

              <div className={`flex items-center gap-2 text-xs ${darkMode ? "text-gray-500" : "text-gray-500"}`}>
                <FiClock size={13} />
                Submitted {report.time}
              </div>
            </div>
          )}

          {!isEditing && (canEdit || canDelete) && (
            <div className={`mt-5 pt-5 border-t flex items-center justify-end gap-2.5 ${darkMode ? "border-white/10" : "border-gray-100"}`}>
              {canEdit && (
                <button
                  onClick={() => setIsEditing(true)}
                  className={`flex items-center gap-1.5 px-4 py-2 text-[11.5px] font-bold border transition-colors duration-150 ${
                    darkMode ? "border-white/10 text-gray-300 hover:bg-white/[0.05]" : "border-gray-200 text-gray-600 hover:bg-surface-light"
                  }`}
                >
                  <FiEdit2 size={11} /> Edit
                </button>
              )}
              {canDelete && (
                <button
                  onClick={() => onDelete(report)}
                  className={`flex items-center gap-1.5 px-4 py-2 text-[11.5px] font-bold border transition-colors duration-150 ${
                    darkMode ? "border-primary/25 text-red-300 hover:bg-primary/10" : "border-red-200 text-primary hover:bg-red-50"
                  }`}
                >
                  <FiXCircle size={11} /> Delete
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

/* ------------------------------------------------------------------ */
/* "Reports I Confirmed" card — wide hero image + evidence you shared  */
/* ------------------------------------------------------------------ */

const ConfirmedReportCard = ({ report, index, darkMode }) => {
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
      <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr]">
        {/* IMAGE */}
        <div className="relative h-[220px] lg:h-full overflow-hidden">
          <img
            src={report.image}
            alt={report.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-[0.15em]">
            <FiThumbsUp size={11} />
            You Confirmed
          </div>
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

          <SubmittedBy submitter={report.submittedBy} darkMode={darkMode} />

          <p className={`mt-4 max-w-2xl text-sm leading-relaxed ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            {report.description}
          </p>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-6">
            <div className="flex items-center gap-3">
              <StatusStepper status={report.status} darkMode={darkMode} />
              <span className={`text-[11px] font-bold uppercase tracking-wide ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                {STAGE_LABELS[report.status]}
              </span>
            </div>

            <div className={`flex items-center gap-2 text-xs ${darkMode ? "text-gray-500" : "text-gray-500"}`}>
              <FiClock size={13} />
              Confirmed {report.confirmedOn}
            </div>
          </div>

          {report.myEvidence && (
            <div className={`mt-5 pt-5 border-t flex flex-col sm:flex-row sm:items-center gap-4 ${darkMode ? "border-white/10" : "border-gray-100"}`}>
              <div className="w-full sm:w-32 h-40 sm:h-24 shrink-0 overflow-hidden border border-primary/40">
                <img src={report.myEvidence} alt={`Evidence you uploaded for ${report.title}`} className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <FiCamera size={12} className="text-primary" />
                  <span className={`text-[11px] font-bold uppercase tracking-wide ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                    Your Evidence
                  </span>
                </div>
                <p className={`mt-1.5 text-[12px] leading-relaxed max-w-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                  The photo you submitted to confirm this report.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

/* ------------------------------------------------------------------ */
/* Shared empty state                                                  */
/* ------------------------------------------------------------------ */

const EmptySection = ({ darkMode, title, subtitle, icon: Icon = FiCompass }) => (
  <div className={`border p-10 sm:p-14 text-center ${darkMode ? "bg-[#0A0A0C] border-white/10" : "bg-white border-gray-200"}`}>
    <div className={`w-12 h-12 mx-auto flex items-center justify-center mb-4 ${darkMode ? "bg-white/[0.04] text-gray-600" : "bg-gray-100 text-gray-400"}`}>
      <Icon size={20} />
    </div>
    <p className={`text-[14px] font-bold ${darkMode ? "text-white" : "text-gray-950"}`}>{title}</p>
    <p className={`mt-1.5 text-[12.5px] ${darkMode ? "text-gray-500" : "text-gray-400"}`}>{subtitle}</p>
  </div>
);

const SectionHeader = ({ darkMode, label, count }) => (
  <div className="flex items-center gap-3 mb-4">
    <h2 className={`text-[12px] font-black uppercase tracking-[0.18em] ${darkMode ? "text-white" : "text-black"}`}>{label}</h2>
    <div className={`h-px flex-1 ${darkMode ? "bg-white/10" : "bg-gray-200"}`} />
    <span className={`text-[11px] font-bold px-2.5 py-1 border ${darkMode ? "border-white/10 text-gray-400" : "border-gray-200 text-gray-500"}`}>
      {count}
    </span>
  </div>
);

/* ------------------------------------------------------------------ */
/* MAIN COMPONENT                                                       */
/* ------------------------------------------------------------------ */

const MyReportsList = ({ darkMode, activeStatus = "all" }) => {
  const [reports, setReports] = useState(MOCK_MY_REPORTS);
  const [confirmedReports] = useState(MOCK_CONFIRMED_REPORTS);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const handleSaveEdit = (id, updates) => {
    setReports((prev) => prev.map((r) => (r.id === id ? { ...r, ...updates } : r)));
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    // Simulated delete delay — swap for a real DELETE /api/reports/:id once
    // the backend exists. Nothing here is persisted, so a page refresh
    // resets `reports` back to MOCK_MY_REPORTS and the report reappears.
    await new Promise((resolve) => setTimeout(resolve, 600));
    setReports((prev) => prev.filter((r) => r.id !== deleteTarget.id));
    setDeleting(false);
    setDeleteTarget(null);
  };

  const visibleMine = useMemo(() => {
    if (activeStatus === "all") return reports;
    return reports.filter((r) => r.status === activeStatus);
  }, [reports, activeStatus]);

  return (
    <div id="my-reports-list" className="scroll-mt-24 space-y-10">
      {/* MY REPORTS */}
      <div>
        <SectionHeader darkMode={darkMode} label="My Reports" count={visibleMine.length} />
        {visibleMine.length === 0 ? (
          <EmptySection
            darkMode={darkMode}
            title="No reports in this category"
            subtitle="Reports you file will show up here."
          />
        ) : (
          <div className="flex flex-col gap-5">
            <AnimatePresence mode="popLayout">
              {visibleMine.map((report, index) => (
                <MyReportCard
                  key={report.id}
                  report={report}
                  index={index}
                  darkMode={darkMode}
                  onSaveEdit={handleSaveEdit}
                  onDelete={setDeleteTarget}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* REPORTS I CONFIRMED — always renders, with its own empty state */}
      <div>
        <SectionHeader darkMode={darkMode} label="Reports I Confirmed" count={confirmedReports.length} />
        {confirmedReports.length === 0 ? (
          <EmptySection
            darkMode={darkMode}
            icon={FiThumbsUp}
            title="No confirmed reports yet"
            subtitle="Reports you confirm for other students will appear here with your uploaded evidence."
          />
        ) : (
          <div className="flex flex-col gap-5">
            <AnimatePresence mode="popLayout">
              {confirmedReports.map((report, index) => (
                <ConfirmedReportCard key={report.id} report={report} index={index} darkMode={darkMode} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* DELETE CONFIRM MODAL */}
      <AnimatePresence>
        {deleteTarget && (
          <DeleteConfirmModal
            report={deleteTarget}
            darkMode={darkMode}
            onCancel={() => !deleting && setDeleteTarget(null)}
            onConfirm={handleConfirmDelete}
            deleting={deleting}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyReportsList;