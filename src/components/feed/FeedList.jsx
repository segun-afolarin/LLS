import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiClock,
  FiMapPin,
  FiCheckCircle,
  FiUsers,
  FiImage,
  FiX,
  FiUploadCloud,
  FiLoader,
  FiAlertCircle,
  FiCompass,
} from "react-icons/fi";

/*
  FRONTEND-ONLY NOTE
  -------------------
  No backend yet. MOCK_FEED stands in for GET /api/campus/feed, scoped
  server-side to the student's own campus. `image` uses picsum.photos as
  a placeholder — swap for the real uploaded report photo once that
  pipeline exists.

  CONFIRM FLOW is fully simulated: opening the modal, uploading a photo,
  the "AI is verifying" stage, and the final "Confirmation Submitted"
  state are all local state + timeouts, standing in for a real
  POST /api/reports/:id/confirm that would return either success or a
  mismatch error from an image-verification step. The "error" stage
  below is wired but never triggered by the mock — swap the resolved
  Promise in handleConfirm for a real awaited request/catch once that
  endpoint exists, and the error UI will already work.

  `required` (confirmations needed before escalation) varies by urgency
  here — critical reports need fewer confirmations to move faster,
  which mirrors how this would realistically work in production.
*/

const initialsOf = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("") || "?";

const CATEGORY_LABELS = {
  Hostel: "Hostel",
  "Portal/ICT": "Portal/ICT",
  Security: "Security",
  Water: "Water",
  Electricity: "Electricity",
  Library: "Library",
  Medical: "Medical",
  Harassment: "Harassment",
  General: "General",
};

const requiredFor = (urgency) => (urgency === "critical" ? 5 : urgency === "high" ? 7 : 10);

const timeToMinutes = (t) => {
  const num = parseInt(t, 10) || 0;
  if (t.includes("m")) return num;
  if (t.includes("h")) return num * 60;
  if (t.includes("d")) return num * 60 * 24;
  return 999999;
};

const urgencyRank = { critical: 0, high: 1, medium: 2, low: 3 };

const RAW_FEED = [
  {
    id: "LLS-2291",
    title: "Broken water heater — Block C hostel",
    category: "Hostel",
    urgency: "medium",
    location: "Male Hostel, Block C, 2nd floor",
    time: "12m ago",
    confirmations: 6,
    confirmedByMe: false,
    image: "https://picsum.photos/seed/LLS-2291/700/500",
    description: "Water heater in the 2nd floor bathroom has been cold for three days now. Several of us have reported it verbally already.",
    submittedBy: { name: "Aisha Bello", avatar: "https://i.pravatar.cc/100?img=47" },
    confirmedBy: [
      { name: "Tunde Ade", avatar: "https://i.pravatar.cc/100?img=12" },
      { name: "Grace Momoh", avatar: "https://i.pravatar.cc/100?img=32" },
    ],
  },
  {
    id: "LLS-2296",
    title: "Broken chair, Lecture Hall 4",
    category: "General",
    urgency: "low",
    location: "Lecture Hall 4, Faculty of Science",
    time: "1h ago",
    confirmations: 2,
    confirmedByMe: false,
    image: "https://picsum.photos/seed/LLS-2296/700/500",
    description: "Third row from the front, chair leg is cracked and wobbles. Minor but someone will get hurt eventually.",
    submittedBy: { name: "Ade Okafor", initials: "AO" },
    confirmedBy: [],
  },
  {
    id: "LLS-2288",
    title: "Faulty perimeter light near Gate 2",
    category: "Security",
    urgency: "high",
    location: "Gate 2, main entrance",
    time: "2h ago",
    confirmations: 4,
    confirmedByMe: false,
    image: "https://picsum.photos/seed/LLS-2288/700/500",
    description: "The light near the security post at Gate 2 has been out for a week. It's genuinely dark walking through there at night.",
    submittedBy: { name: "Ibrahim Musa", avatar: "https://i.pravatar.cc/100?img=15" },
    confirmedBy: [{ name: "Grace Momoh", avatar: "https://i.pravatar.cc/100?img=32" }],
  },
  {
    id: "LLS-2299",
    title: "Suspicious individual near female hostel gate",
    category: "Harassment",
    urgency: "critical",
    location: "Female Hostel, back gate",
    time: "3h ago",
    confirmations: 3,
    confirmedByMe: false,
    image: "https://picsum.photos/seed/LLS-2299/700/500",
    description: "A non-student has been loitering near the back gate for two evenings in a row. Security should be notified urgently.",
    submittedBy: { name: "Grace Momoh", avatar: "https://i.pravatar.cc/100?img=32" },
    confirmedBy: [
      { name: "Aisha Bello", avatar: "https://i.pravatar.cc/100?img=47" },
      { name: "Tunde Ade", avatar: "https://i.pravatar.cc/100?img=12" },
    ],
  },
  {
    id: "LLS-2290",
    title: "Student portal login failing since Monday",
    category: "Portal/ICT",
    urgency: "medium",
    location: "University-wide (student portal)",
    time: "44m ago",
    confirmations: 10,
    confirmedByMe: true,
    image: "https://picsum.photos/seed/LLS-2290/700/500",
    description: "Getting a 500 error on login for the past three days. Can't check my results or register courses.",
    submittedBy: { name: "Tunde Ade", avatar: "https://i.pravatar.cc/100?img=12" },
    confirmedBy: [
      { name: "Aisha Bello", avatar: "https://i.pravatar.cc/100?img=47" },
      { name: "Ade Okafor", initials: "AO" },
      { name: "Grace Momoh", avatar: "https://i.pravatar.cc/100?img=32" },
      { name: "Ibrahim Musa", avatar: "https://i.pravatar.cc/100?img=15" },
      { name: "You", initials: "YOU" },
    ],
  },
  {
    id: "LLS-2285",
    title: "No water supply — female hostel wing B",
    category: "Water",
    urgency: "high",
    location: "Female Hostel, Wing B",
    time: "5h ago",
    confirmations: 6,
    confirmedByMe: false,
    image: "https://picsum.photos/seed/LLS-2285/700/500",
    description: "No running water in Wing B since yesterday morning. Entire wing is affected, not just one room.",
    submittedBy: { name: "Grace Momoh", avatar: "https://i.pravatar.cc/100?img=32" },
    confirmedBy: [{ name: "Aisha Bello", avatar: "https://i.pravatar.cc/100?img=47" }],
  },
  {
    id: "LLS-2281",
    title: "Library AC unit not working, 3rd floor",
    category: "Library",
    urgency: "low",
    location: "Main Library, 3rd floor reading room",
    time: "1d ago",
    confirmations: 10,
    confirmedByMe: false,
    image: "https://picsum.photos/seed/LLS-2281/700/500",
    description: "AC has been off for a week during peak exam prep. It gets uncomfortably warm by midday.",
    submittedBy: { name: "Ibrahim Musa", avatar: "https://i.pravatar.cc/100?img=15" },
    confirmedBy: [],
  },
];

const MOCK_FEED = RAW_FEED.map((r) => ({
  ...r,
  required: requiredFor(r.urgency),
}));

/* ------------------------------------------------------------------ */
/* Avatar with graceful fallback                                       */
/* ------------------------------------------------------------------ */

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
  const visible = confirmers.slice(0, 4);
  const extra = confirmers.length - visible.length;

  return (
    <div className="flex items-center gap-3">
      <div className="flex -space-x-2">
        {visible.map((c, i) => (
          <Avatar
            key={i}
            name={c.name}
            avatar={c.avatar}
            className="relative w-8 h-8 rounded-full border-2 border-primary"
          />
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
      <span className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>confirmed this</span>
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

/* ------------------------------------------------------------------ */
/* CONFIRMATION MODAL — upload / verifying / submitted / error         */
/* ------------------------------------------------------------------ */

const ConfirmationModal = ({ report, darkMode, onClose, onConfirm }) => {
  const [stage, setStage] = useState("upload");
  const [preview, setPreview] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result);
    reader.readAsDataURL(file);

    setStage("verifying");
    setErrorMsg("");

    onConfirm(file)
      .then(() => setStage("submitted"))
      .catch((err) => {
        setErrorMsg(err?.message || "Something went wrong verifying that photo. Please try again.");
        setStage("error");
      });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget && (stage === "submitted" || stage === "error")) onClose();
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ type: "spring", stiffness: 280, damping: 26 }}
        className={`relative w-full max-w-md border overflow-hidden ${darkMode ? "bg-[#0A0A0C] border-white/10" : "bg-white border-gray-200"}`}
      >
        {(stage === "submitted" || stage === "error") && (
          <button
            onClick={onClose}
            className={`absolute top-4 right-4 w-9 h-9 flex items-center justify-center z-10 ${
              darkMode ? "bg-white/[0.06] text-white hover:bg-white/[0.12]" : "bg-gray-100 text-black hover:bg-gray-200"
            }`}
          >
            <FiX />
          </button>
        )}

        <div className="p-6 sm:p-8">
          <p className={`text-xs uppercase tracking-[0.15em] ${darkMode ? "text-gray-500" : "text-gray-400"}`}>{report.id}</p>
          <h3 className={`mt-1 text-lg font-bold leading-snug ${darkMode ? "text-white" : "text-black"}`}>{report.title}</h3>

          {stage === "upload" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6">
              <p className={`text-sm leading-relaxed ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                To confirm this report, upload a photo showing the issue still exists at this location. This helps our AI verify accuracy before it counts toward escalation.
              </p>

              <label
                className={`mt-5 flex flex-col items-center justify-center gap-3 border-2 border-dashed h-48 cursor-pointer transition-colors ${
                  darkMode ? "border-white/15 hover:border-primary/40 bg-white/[0.02]" : "border-gray-300 hover:border-primary/50 bg-[#FAFAFA]"
                }`}
              >
                <FiUploadCloud className="text-3xl text-primary" />
                <span className={`text-sm font-semibold ${darkMode ? "text-gray-300" : "text-gray-600"}`}>Tap to upload a photo</span>
                <span className="text-xs text-gray-500">JPG or PNG</span>
                <input type="file" hidden accept="image/*" onChange={handleFileSelect} />
              </label>

              <button
                onClick={onClose}
                className={`mt-4 w-full h-11 text-sm font-semibold border transition-colors ${
                  darkMode ? "border-white/10 text-gray-300 hover:bg-white/[0.04]" : "border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                Cancel
              </button>
            </motion.div>
          )}

          {stage === "verifying" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 flex flex-col items-center text-center py-4">
              {preview && (
                <div className="w-full h-40 mb-5 overflow-hidden border border-white/10">
                  <img src={preview} alt="Uploaded evidence" className="w-full h-full object-cover" />
                </div>
              )}

              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
                className="w-14 h-14 flex items-center justify-center bg-primary/10 text-primary text-2xl"
              >
                <FiLoader />
              </motion.div>

              <h4 className={`mt-5 font-bold ${darkMode ? "text-white" : "text-black"}`}>AI is verifying your photo...</h4>
              <p className={`mt-2 text-sm max-w-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                Checking image quality and matching it against this report's category and location.
              </p>

              <div className={`mt-5 w-full h-1.5 overflow-hidden ${darkMode ? "bg-white/10" : "bg-gray-200"}`}>
                <motion.div
                  className="h-full bg-gradient-to-r from-primary to-primary-dark"
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                  style={{ width: "50%" }}
                />
              </div>
            </motion.div>
          )}

          {stage === "submitted" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 280, damping: 22 }}
              className="mt-6 flex flex-col items-center text-center py-4"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 300, damping: 18 }}
                className="w-16 h-16 flex items-center justify-center bg-primary text-white text-3xl"
              >
                <FiCheckCircle />
              </motion.div>

              <h4 className={`mt-5 text-xl font-black ${darkMode ? "text-white" : "text-black"}`}>Confirmation Submitted</h4>
              <p className={`mt-2 text-sm max-w-xs leading-relaxed ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                Thank you. Your photo confirmation has been added to this report. Once enough students confirm, it moves toward campus admin review.
              </p>

              <button onClick={onClose} className="mt-6 w-full h-12 bg-primary text-white font-bold hover:bg-primary-dark transition-colors">
                Close
              </button>
            </motion.div>
          )}

          {stage === "error" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 280, damping: 22 }}
              className="mt-6 flex flex-col items-center text-center py-4"
            >
              <div className="w-16 h-16 flex items-center justify-center bg-amber-500/15 text-amber-500 text-3xl">
                <FiAlertCircle />
              </div>

              <h4 className={`mt-5 text-lg font-black ${darkMode ? "text-white" : "text-black"}`}>Couldn't verify that photo</h4>
              <p className={`mt-2 text-sm max-w-xs leading-relaxed ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{errorMsg}</p>

              <button
                onClick={() => {
                  setStage("upload");
                  setPreview("");
                }}
                className="mt-6 w-full h-12 bg-primary text-white font-bold hover:bg-primary-dark transition-colors"
              >
                Try Another Photo
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ------------------------------------------------------------------ */
/* Loading / empty helpers                                             */
/* ------------------------------------------------------------------ */

const ListSkeleton = ({ darkMode }) => (
  <div className="space-y-5">
    {[0, 1, 2].map((i) => (
      <div
        key={i}
        className={`grid grid-cols-1 lg:grid-cols-[300px_1fr] border overflow-hidden animate-pulse ${
          darkMode ? "bg-[#0A0A0C] border-white/10" : "bg-white border-gray-200"
        }`}
      >
        <div className={`h-[200px] lg:h-full ${darkMode ? "bg-white/[0.04]" : "bg-gray-100"}`} />
        <div className="p-5 sm:p-6 space-y-4">
          <div className={`h-4 w-1/3 ${darkMode ? "bg-white/[0.06]" : "bg-gray-100"}`} />
          <div className={`h-4 w-2/3 ${darkMode ? "bg-white/[0.06]" : "bg-gray-100"}`} />
          <div className={`h-16 w-full ${darkMode ? "bg-white/[0.04]" : "bg-gray-50"}`} />
          <div className={`h-3 w-full ${darkMode ? "bg-white/[0.06]" : "bg-gray-100"}`} />
        </div>
      </div>
    ))}
  </div>
);

const EmptyFiltered = ({ darkMode }) => (
  <div className={`border p-14 text-center ${darkMode ? "bg-[#0A0A0C] border-white/10" : "bg-white border-gray-200"}`}>
    <div className={`w-12 h-12 mx-auto flex items-center justify-center mb-4 ${darkMode ? "bg-white/[0.04] text-gray-600" : "bg-gray-100 text-gray-400"}`}>
      <FiCompass size={20} />
    </div>
    <p className={`text-sm font-bold ${darkMode ? "text-white" : "text-gray-950"}`}>No reports match your filters</p>
    <p className={`mt-1.5 text-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}>Try a different category or clear your search.</p>
  </div>
);

/* ------------------------------------------------------------------ */
/* MAIN COMPONENT                                                       */
/* ------------------------------------------------------------------ */

const FeedList = ({ darkMode, activeCategory, activeSort, search }) => {
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState([]);
  const [activeModalId, setActiveModalId] = useState(null);

  useEffect(() => {
    const t = setTimeout(() => {
      setReports(MOCK_FEED);
      setLoading(false);
    }, 650);
    return () => clearTimeout(t);
  }, []);

  const openConfirmModal = (id) => {
    const target = reports.find((r) => r.id === id);
    if (target?.confirmedByMe) return;
    setActiveModalId(id);
  };

  const closeModal = () => setActiveModalId(null);

  const handleConfirm = useCallback(
    (id) =>
      new Promise((resolve) => {
        // Simulated AI verification delay — swap for a real awaited
        // POST /api/reports/:id/confirm once that endpoint exists, and
        // reject(new Error(...)) on a mismatch to exercise the error stage.
        setTimeout(() => {
          setReports((prev) =>
            prev.map((r) => {
              if (r.id !== id || r.confirmedByMe) return r;
              return {
                ...r,
                confirmations: r.confirmations + 1,
                confirmedByMe: true,
                confirmedBy: [...r.confirmedBy, { name: "You", initials: "YOU" }],
              };
            })
          );
          resolve();
        }, 1600);
      }),
    []
  );

  const visible = useMemo(() => {
    let list = [...reports];

    if (activeCategory !== "All") {
      list = list.filter((r) => r.category === activeCategory);
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((r) => r.title.toLowerCase().includes(q) || r.location.toLowerCase().includes(q));
    }

    if (activeSort === "recent") {
      list.sort((a, b) => timeToMinutes(a.time) - timeToMinutes(b.time));
    } else if (activeSort === "urgent") {
      list.sort((a, b) => urgencyRank[a.urgency] - urgencyRank[b.urgency]);
    } else if (activeSort === "closest") {
      list.sort((a, b) => b.confirmations / b.required - a.confirmations / a.required);
    }

    return list;
  }, [reports, activeCategory, activeSort, search]);

  const activeReport = reports.find((r) => r.id === activeModalId);

  if (loading) return <ListSkeleton darkMode={darkMode} />;
  if (visible.length === 0) return <EmptyFiltered darkMode={darkMode} />;

  return (
    <>
      <div id="feed-list" className="space-y-5 scroll-mt-24">
        <AnimatePresence>
          {visible.map((report, index) => {
            const confirmed = report.confirmedByMe;
            const pct = Math.min(100, Math.round((report.confirmations / report.required) * 100));

            return (
              <motion.div
                key={report.id}
                layout
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -3 }}
                className={`group border overflow-hidden transition-all duration-300 ${
                  darkMode ? "bg-[#0A0A0C] border-white/10" : "bg-white border-gray-200"
                }`}
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
                    <div className="absolute bottom-0 left-0 p-4 sm:p-5 w-full">
                      <div className="inline-flex items-center gap-2 px-2.5 py-1.5 bg-primary text-white text-[10px] font-black uppercase tracking-[0.15em] mb-3">
                        <FiImage size={11} />
                        {CATEGORY_LABELS[report.category] || report.category}
                      </div>
                      <h3 className="text-white text-lg sm:text-xl font-black leading-tight">{report.title}</h3>
                    </div>
                  </div>

                  {/* CONTENT */}
                  <div className="p-5 sm:p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
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

                        <SubmittedBy submitter={report.submittedBy} darkMode={darkMode} />

                        <p className={`mt-4 max-w-2xl text-sm leading-relaxed ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                          {report.description}
                        </p>
                      </div>

                      <div className={`border p-4 min-w-[160px] shrink-0 ${darkMode ? "bg-white/[0.03] border-white/10" : "bg-[#FAFAFA] border-gray-200"}`}>
                        <p className={`text-[10px] uppercase tracking-[0.2em] ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                          Confirmations
                        </p>
                        <motion.h4
                          key={report.confirmations}
                          initial={{ scale: 1.2, opacity: 0.6 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ type: "spring", stiffness: 250 }}
                          className={`mt-2 text-3xl font-black ${darkMode ? "text-white" : "text-black"}`}
                        >
                          {report.confirmations}
                        </motion.h4>
                        <p className="mt-1 text-primary text-xs font-semibold">/ {report.required} needed</p>
                      </div>
                    </div>

                    {report.confirmedBy?.length > 0 && (
                      <div className="mt-6">
                        <ConfirmerAvatars confirmers={report.confirmedBy} darkMode={darkMode} />
                      </div>
                    )}

                    {/* PROGRESS */}
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
                          className="h-full bg-primary relative overflow-hidden"
                        >
                          <motion.div
                            animate={{ x: ["-100%", "250%"] }}
                            transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
                            className="absolute top-0 left-0 w-16 h-full bg-white/30 skew-x-12"
                          />
                        </motion.div>
                      </div>
                    </div>

                    {/* FOOTER */}
                    <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className={`flex items-center gap-2 text-xs ${darkMode ? "text-gray-500" : "text-gray-500"}`}>
                        <FiClock size={13} />
                        Submitted {report.time}
                      </div>

                      <motion.button
                        whileHover={confirmed ? {} : { scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => openConfirmModal(report.id)}
                        disabled={confirmed}
                        className={`h-12 px-6 border transition-all duration-300 font-bold uppercase tracking-[0.12em] text-xs flex items-center justify-center gap-2.5 w-full sm:w-auto ${
                          confirmed
                            ? "bg-white text-primary border-primary cursor-default"
                            : "bg-primary hover:bg-primary-dark text-white border-primary"
                        }`}
                      >
                        {confirmed ? "Confirmed" : "Confirm Report"}
                        <FiCheckCircle size={14} />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {activeModalId !== null && activeReport && (
          <ConfirmationModal
            report={activeReport}
            darkMode={darkMode}
            onClose={closeModal}
            onConfirm={() => handleConfirm(activeModalId)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default FeedList;