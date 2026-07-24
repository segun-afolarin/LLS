import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMail, FiPhone, FiEdit2, FiTrash2, FiBriefcase } from "react-icons/fi";

/*
  FRONTEND-ONLY NOTE
  -------------------
  No backend yet. MOCK_STAFF stands in for GET /api/admin/staff, scoped
  to this campus. activeReports reflects how many currently-assigned
  reports (from Report Queue / Verified Reports) point to this staff
  member — read-only here, since it's derived, not directly editable.
*/

export const MOCK_STAFF = [
  { id: 1, name: "Yakubu Ibrahim", role: "Facilities Supervisor", department: "Facilities", email: "y.ibrahim@lincoln.edu.ng", phone: "+234 803 220 1145", activeReports: 5 },
  { id: 2, name: "Chinwe Obasi", role: "ICT Support Lead", department: "ICT", email: "c.obasi@lincoln.edu.ng", phone: "+234 806 441 8820", activeReports: 3 },
  { id: 3, name: "Musa Aliyu", role: "Chief Security Officer", department: "Security", email: "m.aliyu@lincoln.edu.ng", phone: "+234 802 115 6634", activeReports: 2 },
  { id: 4, name: "Dr. Amaka Nwachukwu", role: "Sick Bay Physician", department: "Health Center", email: "a.nwachukwu@lincoln.edu.ng", phone: "+234 807 332 9012", activeReports: 1 },
  { id: 5, name: "Bello Fatima", role: "Student Affairs Officer", department: "Student Affairs", email: "b.fatima@lincoln.edu.ng", phone: "+234 809 771 4456", activeReports: 4 },
];

const DEPT_TONE = {
  Facilities: { light: "bg-gray-100 text-gray-600", dark: "bg-white/10 text-gray-300" },
  ICT: { light: "bg-blue-50 text-blue-700", dark: "bg-blue-500/10 text-blue-400" },
  Security: { light: "bg-red-50 text-primary-dark", dark: "bg-primary/10 text-red-300" },
  "Health Center": { light: "bg-emerald-50 text-emerald-700", dark: "bg-emerald-500/10 text-emerald-400" },
  "Student Affairs": { light: "bg-amber-50 text-amber-700", dark: "bg-amber-500/10 text-amber-400" },
};

const StaffCard = ({ member, index, darkMode, onEdit, onRemove }) => {
  const tone = DEPT_TONE[member.department] || DEPT_TONE.Facilities;
  const initials = member.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={`border p-5 ${darkMode ? "bg-[#0A0A0C] border-white/10" : "bg-white border-gray-200"} shadow-subtle`}
    >
      <div className="flex items-start gap-3.5">
        <div className="w-11 h-11 shrink-0 bg-primary flex items-center justify-center">
          <span className="text-white text-[13px] font-black">{initials}</span>
        </div>

        <div className="flex-1 min-w-0">
          <p className={`text-[14px] font-bold leading-snug ${darkMode ? "text-white" : "text-gray-950"}`}>{member.name}</p>
          <p className={`mt-0.5 text-[11.5px] font-medium flex items-center gap-1.5 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
            <FiBriefcase size={11} /> {member.role}
          </p>
          <span className={`inline-block mt-2 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide ${darkMode ? tone.dark : tone.light}`}>
            {member.department}
          </span>
        </div>
      </div>

      <div className={`mt-4 pt-4 border-t space-y-1.5 ${darkMode ? "border-white/[0.06]" : "border-gray-100"}`}>
        <p className={`flex items-center gap-2 text-[11.5px] ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
          <FiMail size={11} className="shrink-0" /> <span className="truncate">{member.email}</span>
        </p>
        <p className={`flex items-center gap-2 text-[11.5px] ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
          <FiPhone size={11} className="shrink-0" /> {member.phone}
        </p>
      </div>

      <div className={`flex items-center justify-between mt-4 pt-4 border-t ${darkMode ? "border-white/[0.06]" : "border-gray-100"}`}>
        <span className={`text-[11.5px] font-semibold ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
          <span className={`font-black ${darkMode ? "text-white" : "text-gray-950"}`}>{member.activeReports}</span> active reports
        </span>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onEdit(member)}
            className={`w-8 h-8 flex items-center justify-center transition-colors duration-150 ${
              darkMode ? "text-gray-400 hover:text-white hover:bg-white/[0.06]" : "text-gray-500 hover:text-gray-900 hover:bg-surface-light"
            }`}
            aria-label="Edit staff member"
          >
            <FiEdit2 size={13} />
          </button>
          <button
            onClick={() => onRemove(member.id)}
            className={`w-8 h-8 flex items-center justify-center transition-colors duration-150 ${
              darkMode ? "text-gray-400 hover:text-red-300 hover:bg-primary/10" : "text-gray-500 hover:text-primary hover:bg-red-50"
            }`}
            aria-label="Remove staff member"
          >
            <FiTrash2 size={13} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const StaffList = ({ staff, darkMode, activeDepartment, search, onEdit, onRemove }) => {
  const visible = useMemo(() => {
    let list = [...staff];

    if (activeDepartment !== "All") list = list.filter((s) => s.department === activeDepartment);

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((s) => s.name.toLowerCase().includes(q) || s.role.toLowerCase().includes(q));
    }

    return list;
  }, [staff, activeDepartment, search]);

  if (visible.length === 0) {
    return (
      <div className={`border p-14 text-center ${darkMode ? "bg-[#0A0A0C] border-white/10" : "bg-white border-gray-200"}`}>
        <p className={`text-[14px] font-bold ${darkMode ? "text-white" : "text-gray-950"}`}>No staff match these filters</p>
        <p className={`mt-1.5 text-[12.5px] ${darkMode ? "text-gray-500" : "text-gray-400"}`}>Try a different department or search term.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      <AnimatePresence mode="popLayout">
        {visible.map((member, i) => (
          <StaffCard key={member.id} member={member} index={i} darkMode={darkMode} onEdit={onEdit} onRemove={onRemove} />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default StaffList;