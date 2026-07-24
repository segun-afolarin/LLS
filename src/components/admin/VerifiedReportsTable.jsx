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
  FiCheck,
  FiChevronDown,
  FiClock,
  FiCheckCircle,
} from "react-icons/fi";

/*
  FRONTEND-ONLY NOTE
  -------------------
  No backend yet. MOCK_VERIFIED stands in for GET /api/admin/verified-reports,
  scoped to this admin's campus. handleResolve updates local state only —
  swap for a real PATCH /api/admin/reports/:id/resolve once the backend
  exists. Row shape stays the same either way.
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

const MOCK_VERIFIED = [
  {
    id: "LLS-2281", title: "Library AC unit not working, 3rd floor", category: "Library",
    student: "Peace Adeyemi", department: "Facilities", status: "resolved",
    verifiedDaysAgo: 6, resolvedDaysAgo: 1,
  },
  {
    id: "LLS-2260", title: "Broken window latch, Room 214", category: "Hostel",
    student: "Femi Balogun", department: "Facilities", status: "resolved",
    verifiedDaysAgo: 9, resolvedDaysAgo: 3,
  },
  {
    id: "LLS-2249", title: "Projector not working, Lecture Hall 1", category: "General",
    student: "Ngozi Chukwu", department: "ICT", status: "in-progress",
    verifiedDaysAgo: 4, resolvedDaysAgo: null,
  },
  {
    id: "LLS-2244", title: "Leaking pipe outside female hostel", category: "Water",
    student: "Halima Suleiman", department: "Facilities", status: "in-progress",
    verifiedDaysAgo: 2, resolvedDaysAgo: null,
  },
  {
    id: "LLS-2231", title: "Perimeter fence gap near Block D", category: "Security",
    student: "Emeka Obi", department: "Security", status: "in-progress",
    verifiedDaysAgo: 5, resolvedDaysAgo: null,
  },
  {
    id: "LLS-2219", title: "Sick bay understaffed on weekends", category: "Medical",
    student: "Blessing Okoro", department: "Health Center", status: "resolved",
    verifiedDaysAgo: 12, resolvedDaysAgo: 4,
  },
];

const STATUS_CFG = {
  "in-progress": { label: "In Progress", dotLight: "bg-amber-500", dotDark: "bg-amber-400", textLight: "text-amber-700", textDark: "text-amber-400" },
  resolved: { label: "Resolved", dotLight: "bg-emerald-500", dotDark: "bg-emerald-400", textLight: "text-emerald-700", textDark: "text-emerald-400" },
};

const ReportRow = ({ report, index, darkMode, onResolve }) => {
  const [expanded, setExpanded] = useState(false);
  const status = STATUS_CFG[report.status];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      className={`border ${darkMode ? "bg-[#0A0A0C] border-white/10" : "bg-white border-gray-200"} shadow-subtle`}
    >
      <button onClick={() => setExpanded((v) => !v)} className="w-full text-left p-4 sm:p-5">
        <div className="flex items-start gap-3.5">
          <div className={`w-10 h-10 shrink-0 flex items-center justify-center text-[16px] ${darkMode ? "bg-white/[0.05] text-gray-200" : "bg-surface-light text-gray-700"}`}>
            {CATEGORY_ICONS[report.category] || <FiMessageSquare />}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className={`text-[11px] font-semibold ${darkMode ? "text-gray-500" : "text-gray-400"}`}>{report.id}</span>
              <span className={`text-[11px] ${darkMode ? "text-gray-600" : "text-gray-400"}`}>· {report.category}</span>
              <span className={`text-[10.5px] font-bold px-1.5 py-0.5 ${darkMode ? "bg-white/[0.06] text-gray-300" : "bg-surface-light text-gray-600"}`}>
                {report.department}
              </span>
            </div>

            <p className={`text-[14px] font-bold leading-snug ${darkMode ? "text-white" : "text-gray-950"}`}>{report.title}</p>
            <p className={`mt-1.5 text-[11.5px] font-medium ${darkMode ? "text-gray-500" : "text-gray-400"}`}>Filed by {report.student}</p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 ${darkMode ? status.dotDark : status.dotLight}`} />
              <span className={`text-[11px] font-bold uppercase tracking-wide ${darkMode ? status.textDark : status.textLight}`}>{status.label}</span>
            </div>
            <FiChevronDown className={`transition-transform duration-200 ${expanded ? "rotate-180" : ""} ${darkMode ? "text-gray-500" : "text-gray-400"}`} size={16} />
          </div>
        </div>
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
            <div className={`px-4 sm:px-5 pb-5 pt-1 ml-[52px] border-t ${darkMode ? "border-white/10" : "border-gray-100"}`}>
              {/* MINI TIMELINE */}
              <div className="pt-4 flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <FiCheckCircle className="text-emerald-500" size={13} />
                  <span className={`text-[11.5px] font-semibold ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                    Verified {report.verifiedDaysAgo}d ago
                  </span>
                </div>
                <div className={`flex-1 h-px ${darkMode ? "bg-white/10" : "bg-gray-200"}`} />
                <div className="flex items-center gap-2">
                  {report.status === "resolved" ? (
                    <>
                      <FiCheckCircle className="text-primary" size={13} />
                      <span className={`text-[11.5px] font-semibold ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                        Resolved {report.resolvedDaysAgo}d ago
                      </span>
                    </>
                  ) : (
                    <>
                      <FiClock className={darkMode ? "text-gray-500" : "text-gray-400"} size={13} />
                      <span className={`text-[11.5px] font-semibold ${darkMode ? "text-gray-500" : "text-gray-400"}`}>Awaiting resolution</span>
                    </>
                  )}
                </div>
              </div>

              {report.status === "in-progress" && (
                <button
                  onClick={() => onResolve(report.id)}
                  className="mt-4 flex items-center gap-1.5 px-3.5 py-2 bg-primary text-white text-[12px] font-bold hover:bg-primary-dark transition-colors duration-150"
                >
                  <FiCheck size={12} /> Mark Resolved
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const VerifiedReportsTable = ({ darkMode, activeStatus, activeDepartment, search }) => {
  const [reports, setReports] = useState(MOCK_VERIFIED);

  const handleResolve = (id) =>
    setReports((prev) => prev.map((r) => (r.id === id ? { ...r, status: "resolved", resolvedDaysAgo: 0 } : r)));

  const visible = useMemo(() => {
    let list = [...reports];

    if (activeStatus !== "all") list = list.filter((r) => r.status === activeStatus);
    if (activeDepartment !== "All") list = list.filter((r) => r.department === activeDepartment);

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((r) => r.title.toLowerCase().includes(q) || r.id.toLowerCase().includes(q) || r.student.toLowerCase().includes(q));
    }

    return list;
  }, [reports, activeStatus, activeDepartment, search]);

  if (visible.length === 0) {
    return (
      <div className={`border p-14 text-center ${darkMode ? "bg-[#0A0A0C] border-white/10" : "bg-white border-gray-200"}`}>
        <p className={`text-[14px] font-bold ${darkMode ? "text-white" : "text-gray-950"}`}>No reports match these filters</p>
        <p className={`mt-1.5 text-[12.5px] ${darkMode ? "text-gray-500" : "text-gray-400"}`}>Try a different status or department.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3.5">
      <AnimatePresence mode="popLayout">
        {visible.map((report, i) => (
          <ReportRow key={report.id} report={report} index={i} darkMode={darkMode} onResolve={handleResolve} />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default VerifiedReportsTable;