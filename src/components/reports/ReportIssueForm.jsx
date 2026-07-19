import { useState, useRef, useEffect } from "react";
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
  FiArrowRight,
  FiArrowLeft,
  FiUpload,
  FiX,
  FiMapPin,
  FiCheckCircle,
  FiCopy,
  FiCalendar,
} from "react-icons/fi";

/*
  FRONTEND-ONLY NOTE
  -------------------
  No backend connected yet. handleSubmit below simulates a network call
  with a timeout and generates a fake tracking ID locally. Once the
  backend exists, replace the body of handleSubmit with a real POST to
  /api/reports (multipart/form-data for the photo), and use the ID it
  returns instead of generateTrackingId().
*/

const CATEGORIES = [
  { key: "Hostel", icon: <FiHome /> },
  { key: "Portal/ICT", icon: <FiMonitor /> },
  { key: "Security", icon: <FiShield /> },
  { key: "Water", icon: <FiDroplet /> },
  { key: "Electricity", icon: <FiZap /> },
  { key: "Library", icon: <FiBook /> },
  { key: "Medical", icon: <FiHeart /> },
  { key: "Harassment", icon: <FiAlertTriangle /> },
  { key: "General", icon: <FiMessageSquare /> },
];

const URGENCY_LEVELS = [
  { key: "low", label: "Low", desc: "Not urgent, can wait" },
  { key: "medium", label: "Medium", desc: "Should be looked at soon" },
  { key: "high", label: "High", desc: "Needs prompt attention" },
  { key: "critical", label: "Critical", desc: "Safety or health risk" },
];

// This school runs 12 semesters total — the student picks which one
// they're currently in when filing a report.
const SEMESTERS = Array.from({ length: 12 }, (_, i) => i + 1);

const STEPS = ["Category", "Details", "Evidence", "Review"];

const generateTrackingId = () => {
  const n = Math.floor(1000 + Math.random() * 9000);
  return `LLS-${n}`;
};

const StepIndicator = ({ currentStep, darkMode }) => {
  return (
    <div className="flex items-center mb-8">
      {STEPS.map((label, index) => {
        const isActive = index === currentStep;
        const isComplete = index < currentStep;

        return (
          <div key={label} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-2 shrink-0">
              <motion.div
                animate={{
                  scale: isActive ? 1.05 : 1,
                }}
                className={`w-9 h-9 flex items-center justify-center text-[13px] font-bold border-2 transition-colors duration-300 ${
                  isComplete
                    ? "bg-primary border-primary text-white"
                    : isActive
                    ? darkMode
                      ? "border-primary text-primary bg-transparent"
                      : "border-primary text-primary bg-white"
                    : darkMode
                    ? "border-white/15 text-gray-600"
                    : "border-gray-200 text-gray-300"
                }`}
              >
                {isComplete ? <FiCheck size={15} /> : index + 1}
              </motion.div>
              <span
                className={`text-[10.5px] font-bold uppercase tracking-wide whitespace-nowrap ${
                  isActive || isComplete
                    ? darkMode
                      ? "text-white"
                      : "text-gray-950"
                    : darkMode
                    ? "text-gray-600"
                    : "text-gray-300"
                }`}
              >
                {label}
              </span>
            </div>

            {index < STEPS.length - 1 && (
              <div className={`flex-1 h-[2px] mx-2 mb-5 ${isComplete ? "bg-primary" : darkMode ? "bg-white/10" : "bg-gray-200"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
};

const FieldLabel = ({ children, darkMode }) => (
  <label className={`block text-[12px] font-bold uppercase tracking-wide mb-2 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
    {children}
  </label>
);

const EMPTY_FORM = {
  category: "",
  title: "",
  description: "",
  location: "",
  urgency: "",
  semester: "",
  images: [], // { file, previewUrl }
};

const ReportIssueForm = ({ darkMode }) => {
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [trackingId, setTrackingId] = useState(null);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState(EMPTY_FORM);

  // Clean up object URLs on unmount / when images change
  useEffect(() => {
    return () => {
      form.images.forEach((img) => URL.revokeObjectURL(img.previewUrl));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fileInputRef = useRef(null);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: null }));
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || []).slice(0, 4 - form.images.length);
    const newImages = files.map((file) => ({ file, previewUrl: URL.createObjectURL(file) }));
    setForm((prev) => ({ ...prev, images: [...prev.images, ...newImages] }));
    e.target.value = "";
  };

  const removeImage = (index) => {
    setForm((prev) => {
      const target = prev.images[index];
      if (target) URL.revokeObjectURL(target.previewUrl);
      return { ...prev, images: prev.images.filter((_, i) => i !== index) };
    });
  };

  const validateStep = (targetStep) => {
    const newErrors = {};

    if (targetStep === 0 && !form.category) {
      newErrors.category = "Select a category to continue.";
    }

    if (targetStep === 1) {
      if (!form.title.trim()) newErrors.title = "Give your report a short title.";
      if (!form.description.trim() || form.description.trim().length < 20)
        newErrors.description = "Add at least a couple of sentences describing the issue.";
      if (!form.location.trim()) newErrors.location = "Tell us where this is happening.";
      if (!form.urgency) newErrors.urgency = "Select how urgent this is.";
      if (!form.semester) newErrors.semester = "Select which semester you're currently in.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const goNext = () => {
    if (!validateStep(step)) return;
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const goBack = () => setStep((s) => Math.max(s - 1, 0));

  const handleSubmit = async () => {
    setSubmitting(true);
    // Simulated network delay — replace with a real POST once backend exists.
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setTrackingId(generateTrackingId());
    setSubmitting(false);
    setSubmitted(true);
  };

  const progressPct = ((step + 1) / STEPS.length) * 100;

  if (submitted) {
    return (
      <motion.div
        id="report-form"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className={`scroll-mt-24 border p-8 sm:p-12 text-center ${darkMode ? "bg-[#0A0A0C] border-white/10" : "bg-white border-gray-200"} shadow-subtle`}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.1 }}
          className="w-16 h-16 mx-auto bg-primary text-white flex items-center justify-center text-2xl mb-6"
        >
          <FiCheckCircle />
        </motion.div>

        <h2 className={`text-2xl font-black tracking-tight ${darkMode ? "text-white" : "text-gray-950"}`}>
          Report Submitted
        </h2>
        <p className={`mt-2 text-[13.5px] max-w-md mx-auto leading-relaxed ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
          Your report is now visible on the Campus Feed and awaiting confirmations from other students.
        </p>

        <div
          className={`mt-7 inline-flex items-center gap-3 border px-5 py-3 ${
            darkMode ? "border-white/10 bg-white/[0.03]" : "border-gray-200 bg-surface-light"
          }`}
        >
          <span className={`text-[11px] font-bold uppercase tracking-wide ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
            Tracking ID
          </span>
          <span className={`text-lg font-black tracking-tight ${darkMode ? "text-white" : "text-gray-950"}`}>
            {trackingId}
          </span>
          <button
            onClick={() => navigator.clipboard?.writeText(trackingId)}
            className={`p-1.5 transition-colors duration-150 ${darkMode ? "text-gray-500 hover:text-white" : "text-gray-400 hover:text-primary"}`}
            aria-label="Copy tracking ID"
          >
            <FiCopy size={14} />
          </button>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => {
              setSubmitted(false);
              setStep(0);
              setForm(EMPTY_FORM);
            }}
            className="h-[46px] px-6 border border-gray-200 font-semibold text-sm transition-colors duration-200 hover:bg-surface-light"
          >
            Submit Another Report
          </button>
          <button className="h-[46px] px-6 bg-primary text-white font-semibold text-sm hover:bg-primary-dark transition-colors duration-200">
            Track This Report
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div id="report-form" className={`scroll-mt-24 border ${darkMode ? "bg-[#0A0A0C] border-white/10" : "bg-white border-gray-200"} shadow-subtle`}>
      {/* progress bar strip */}
      <div className={`h-[3px] w-full ${darkMode ? "bg-white/10" : "bg-gray-100"}`}>
        <motion.div
          animate={{ width: `${progressPct}%` }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="h-full bg-primary"
        />
      </div>

      <div className="p-5 sm:p-8">
        <StepIndicator currentStep={step} darkMode={darkMode} />

        <AnimatePresence mode="wait">
          {/* STEP 0 — CATEGORY */}
          {step === 0 && (
            <motion.div
              key="step0"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.25 }}
            >
              <h3 className={`text-[16px] font-bold mb-1 ${darkMode ? "text-white" : "text-gray-950"}`}>
                What kind of issue is this?
              </h3>
              <p className={`text-[12.5px] mb-6 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                Choose the category that best fits your report.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {CATEGORIES.map((cat) => {
                  const isSelected = form.category === cat.key;
                  return (
                    <motion.button
                      key={cat.key}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => updateField("category", cat.key)}
                      className={`flex flex-col items-center justify-center gap-2 p-4 border transition-colors duration-200 ${
                        isSelected
                          ? "bg-primary border-primary text-white"
                          : darkMode
                          ? "border-white/10 text-gray-300 hover:border-white/25 hover:bg-white/[0.03]"
                          : "border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-surface-light"
                      }`}
                    >
                      <span className="text-lg">{cat.icon}</span>
                      <span className="text-[12px] font-semibold text-center leading-tight">{cat.key}</span>
                    </motion.button>
                  );
                })}
              </div>
              {errors.category && <p className="mt-3 text-[12px] font-semibold text-primary">{errors.category}</p>}
            </motion.div>
          )}

          {/* STEP 1 — DETAILS */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.25 }}
              className="space-y-5"
            >
              <div>
                <FieldLabel darkMode={darkMode}>Report Title</FieldLabel>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => updateField("title", e.target.value)}
                  placeholder="e.g. Broken water heater in Block C hostel"
                  className={`w-full h-11 px-4 border text-sm outline-none transition-colors duration-150 ${
                    darkMode
                      ? "bg-white/[0.03] border-white/10 text-white placeholder:text-gray-600 focus:border-primary/50"
                      : "bg-white border-gray-200 text-gray-950 placeholder:text-gray-400 focus:border-primary/50"
                  }`}
                />
                {errors.title && <p className="mt-1.5 text-[12px] font-semibold text-primary">{errors.title}</p>}
              </div>

              <div>
                <FieldLabel darkMode={darkMode}>Description</FieldLabel>
                <textarea
                  rows={4}
                  value={form.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  placeholder="Describe what's happening, since when, and anything else that would help verify or resolve it."
                  className={`w-full px-4 py-3 border text-sm outline-none resize-none transition-colors duration-150 ${
                    darkMode
                      ? "bg-white/[0.03] border-white/10 text-white placeholder:text-gray-600 focus:border-primary/50"
                      : "bg-white border-gray-200 text-gray-950 placeholder:text-gray-400 focus:border-primary/50"
                  }`}
                />
                <div className="flex items-center justify-between mt-1.5">
                  {errors.description ? (
                    <p className="text-[12px] font-semibold text-primary">{errors.description}</p>
                  ) : (
                    <span />
                  )}
                  <span className={`text-[11px] ${darkMode ? "text-gray-600" : "text-gray-400"}`}>
                    {form.description.length} characters
                  </span>
                </div>
              </div>

              <div>
                <FieldLabel darkMode={darkMode}>Location</FieldLabel>
                <div
                  className={`flex items-center gap-2.5 h-11 px-4 border transition-colors duration-150 ${
                    darkMode ? "bg-white/[0.03] border-white/10 focus-within:border-primary/50" : "bg-white border-gray-200 focus-within:border-primary/50"
                  }`}
                >
                  <FiMapPin className={darkMode ? "text-gray-500" : "text-gray-400"} size={15} />
                  <input
                    type="text"
                    value={form.location}
                    onChange={(e) => updateField("location", e.target.value)}
                    placeholder="e.g. Male Hostel, Block C, 2nd floor"
                    className={`flex-1 bg-transparent text-sm outline-none ${darkMode ? "text-white placeholder:text-gray-600" : "text-gray-950 placeholder:text-gray-400"}`}
                  />
                </div>
                {errors.location && <p className="mt-1.5 text-[12px] font-semibold text-primary">{errors.location}</p>}
              </div>

              <div>
                <FieldLabel darkMode={darkMode}>Semester</FieldLabel>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2.5">
                  {SEMESTERS.map((sem) => {
                    const isSelected = form.semester === sem;
                    return (
                      <button
                        key={sem}
                        onClick={() => updateField("semester", sem)}
                        className={`flex flex-col items-center justify-center gap-1 h-16 border transition-colors duration-200 ${
                          isSelected
                            ? "bg-primary border-primary text-white"
                            : darkMode
                            ? "border-white/10 text-gray-300 hover:border-white/25"
                            : "border-gray-200 text-gray-600 hover:border-gray-300"
                        }`}
                      >
                        <FiCalendar size={13} className={isSelected ? "text-white/80" : darkMode ? "text-gray-500" : "text-gray-400"} />
                        <span className="text-[13px] font-bold">Sem {sem}</span>
                      </button>
                    );
                  })}
                </div>
                {errors.semester && <p className="mt-1.5 text-[12px] font-semibold text-primary">{errors.semester}</p>}
              </div>

              <div>
                <FieldLabel darkMode={darkMode}>Urgency</FieldLabel>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {URGENCY_LEVELS.map((level) => {
                    const isSelected = form.urgency === level.key;
                    return (
                      <button
                        key={level.key}
                        onClick={() => updateField("urgency", level.key)}
                        className={`text-left p-3 border transition-colors duration-200 ${
                          isSelected
                            ? "bg-primary border-primary text-white"
                            : darkMode
                            ? "border-white/10 text-gray-300 hover:border-white/25"
                            : "border-gray-200 text-gray-600 hover:border-gray-300"
                        }`}
                      >
                        <p className="text-[12.5px] font-bold">{level.label}</p>
                        <p className={`text-[10.5px] mt-0.5 leading-tight ${isSelected ? "text-white/80" : darkMode ? "text-gray-500" : "text-gray-400"}`}>
                          {level.desc}
                        </p>
                      </button>
                    );
                  })}
                </div>
                {errors.urgency && <p className="mt-1.5 text-[12px] font-semibold text-primary">{errors.urgency}</p>}
              </div>
            </motion.div>
          )}

          {/* STEP 2 — EVIDENCE */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.25 }}
            >
              <h3 className={`text-[16px] font-bold mb-1 ${darkMode ? "text-white" : "text-gray-950"}`}>
                Add photo evidence
              </h3>
              <p className={`text-[12.5px] mb-6 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                Optional, but reports with photos get confirmed faster. Up to 4 images.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {form.images.map((img, index) => (
                  <div key={index} className={`relative aspect-square border overflow-hidden ${darkMode ? "border-white/10" : "border-gray-200"}`}>
                    <img src={img.previewUrl} alt={`Evidence ${index + 1}`} className="w-full h-full object-cover" />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute top-1.5 right-1.5 w-6 h-6 bg-black/60 text-white flex items-center justify-center hover:bg-primary transition-colors duration-150"
                      aria-label="Remove image"
                    >
                      <FiX size={13} />
                    </button>
                  </div>
                ))}

                {form.images.length < 4 && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className={`aspect-square border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-colors duration-200 ${
                      darkMode ? "border-white/15 text-gray-500 hover:border-primary/40 hover:text-primary" : "border-gray-200 text-gray-400 hover:border-primary/40 hover:text-primary"
                    }`}
                  >
                    <FiUpload size={18} />
                    <span className="text-[11px] font-semibold">Add photo</span>
                  </button>
                )}
              </div>

              <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleFileSelect} className="hidden" />
            </motion.div>
          )}

          {/* STEP 3 — REVIEW */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.25 }}
            >
              <h3 className={`text-[16px] font-bold mb-5 ${darkMode ? "text-white" : "text-gray-950"}`}>
                Review before submitting
              </h3>

              <div className={`border divide-y ${darkMode ? "border-white/10 divide-white/10" : "border-gray-200 divide-gray-100"}`}>
                {[
                  ["Category", form.category || "—"],
                  ["Title", form.title || "—"],
                  ["Location", form.location || "—"],
                  ["Semester", form.semester ? `Semester ${form.semester}` : "—"],
                  ["Urgency", URGENCY_LEVELS.find((l) => l.key === form.urgency)?.label || "—"],
                  ["Photos attached", `${form.images.length}`],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-start justify-between gap-4 px-4 py-3">
                    <span className={`text-[12.5px] font-semibold shrink-0 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>{label}</span>
                    <span className={`text-[13px] font-bold text-right ${darkMode ? "text-white" : "text-gray-950"}`}>{value}</span>
                  </div>
                ))}
                <div className="px-4 py-3">
                  <span className={`text-[12.5px] font-semibold block mb-1.5 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>Description</span>
                  <p className={`text-[13px] leading-relaxed ${darkMode ? "text-gray-300" : "text-gray-700"}`}>{form.description || "—"}</p>
                </div>
              </div>

              <div className={`mt-4 flex items-start gap-3 border p-4 ${darkMode ? "bg-primary/10 border-primary/25" : "bg-red-50 border-red-200"}`}>
                <FiAlertTriangle className="text-primary shrink-0 mt-0.5" size={16} />
                <p className={`text-[12.5px] leading-relaxed ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Once submitted, this report becomes visible to students on your campus for confirmation. Make sure
                  the details above are accurate.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* NAVIGATION */}
        <div className="flex items-center justify-between mt-8">
          <button
            onClick={goBack}
            disabled={step === 0}
            className={`flex items-center gap-2 h-11 px-5 border font-semibold text-sm transition-colors duration-200 ${
              step === 0
                ? "opacity-0 pointer-events-none"
                : darkMode
                ? "border-white/10 text-gray-300 hover:bg-white/[0.05]"
                : "border-gray-200 text-gray-600 hover:bg-surface-light"
            }`}
          >
            <FiArrowLeft size={15} /> Back
          </button>

          {step < STEPS.length - 1 ? (
            <button
              onClick={goNext}
              className="flex items-center gap-2 h-11 px-6 bg-primary text-white font-semibold text-sm hover:bg-primary-dark transition-colors duration-200"
            >
              Continue <FiArrowRight size={15} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex items-center gap-2 h-11 px-6 bg-primary text-white font-semibold text-sm hover:bg-primary-dark transition-colors duration-200 disabled:opacity-70"
            >
              {submitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  Submit Report <FiCheck size={15} />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportIssueForm;