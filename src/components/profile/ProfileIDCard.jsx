import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { FiCamera, FiMapPin, FiCheckCircle } from "react-icons/fi";

/*
  FRONTEND-ONLY NOTE
  -------------------
  No backend yet. MOCK_STUDENT stands in for useAuth(). Avatar upload
  below only updates local preview state via URL.createObjectURL — swap
  for a real multipart/form-data upload to the backend once it exists.
*/
const MOCK_STUDENT = {
  name: "Afolarin Oluwasegun",
  matricNo: "LLS/CSC/22/4471",
  department: "Computer Science (Hons) Software Engineering",
  campus: "Abuja",
  level: "200 Level",
  memberSince: "September 2023",
  avatar: null,
};

const ProfileIDCard = ({ darkMode }) => {
  const student = MOCK_STUDENT;
  const fileInputRef = useRef(null);
  const [avatarPreview, setAvatarPreview] = useState(student.avatar);

  const initials = student.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setAvatarPreview(url);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`relative overflow-hidden border ${darkMode ? "bg-[#0A0A0C] border-white/10" : "bg-white border-gray-200"} shadow-elevated`}
    >
      {/* watermark — same quiet ghost-type signature used on the dashboard */}
      <div
        aria-hidden="true"
        className="pointer-events-none select-none absolute -top-4 right-2 sm:right-8 text-[80px] sm:text-[130px] font-black leading-none tracking-tight"
        style={{ color: darkMode ? "rgba(255,255,255,0.025)" : "rgba(10,10,12,0.03)", transform: "rotate(-6deg)" }}
      >
        LLS ID
      </div>

      {/* top identity strip */}
      <div className="h-[4px] w-full bg-primary" />

      <div className="relative z-10 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center gap-6">
          {/* AVATAR */}
          <div className="relative shrink-0 mx-auto sm:mx-0">
            <div className={`w-28 h-28 border-4 overflow-hidden flex items-center justify-center ${darkMode ? "border-white/10 bg-white/[0.04]" : "border-gray-100 bg-surface-light"}`}>
              {avatarPreview ? (
                <img src={avatarPreview} alt={student.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl font-black text-primary">{initials}</span>
              )}
            </div>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-1.5 -right-1.5 w-9 h-9 bg-primary text-white flex items-center justify-center hover:bg-primary-dark transition-colors duration-200 shadow-elevated"
              aria-label="Change photo"
            >
              <FiCamera size={14} />
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
          </div>

          {/* IDENTITY BLOCK */}
          <div className="flex-1 min-w-0 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
              <h1 className={`text-2xl sm:text-[28px] font-black tracking-tight ${darkMode ? "text-white" : "text-gray-950"}`}>{student.name}</h1>
              <FiCheckCircle className="text-primary" size={18} title="Verified student" />
            </div>
            <p className={`mt-1 text-[13px] font-semibold ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{student.department}</p>

            <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap mt-3">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 border text-[11px] font-bold ${darkMode ? "bg-white/[0.05] border-white/10 text-gray-300" : "bg-surface-light border-gray-200 text-gray-600"}`}>
                <FiMapPin size={11} /> {student.campus} Campus
              </span>
              <span className={`inline-flex items-center px-2.5 py-1 border text-[11px] font-bold ${darkMode ? "bg-white/[0.05] border-white/10 text-gray-300" : "bg-surface-light border-gray-200 text-gray-600"}`}>
                {student.level}
              </span>
            </div>
          </div>

          {/* MATRIC / ID BLOCK — mono, ledger-card treatment */}
          <div className={`shrink-0 sm:border-l sm:pl-6 text-center sm:text-left ${darkMode ? "sm:border-white/10" : "sm:border-gray-200"}`}>
            <p className={`font-mono text-[10px] uppercase tracking-[0.2em] ${darkMode ? "text-gray-500" : "text-gray-400"}`}>Matric No.</p>
            <p className={`mt-1.5 font-mono text-lg font-bold tracking-wide ${darkMode ? "text-white" : "text-gray-950"}`}>{student.matricNo}</p>
            <p className={`mt-3 text-[11px] ${darkMode ? "text-gray-500" : "text-gray-400"}`}>Member since {student.memberSince}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileIDCard;