import { useState } from "react";
import { motion } from "framer-motion";
import { FiUser, FiMail, FiPhone, FiLock, FiSave, FiEdit2 } from "react-icons/fi";

/*
  FRONTEND-ONLY NOTE
  -------------------
  No backend yet. Form state is local only. handleSave simulates a save
  with a short delay — replace with a real PATCH /api/profile call once
  the backend exists.
*/
const ProfileInfoForm = ({ darkMode }) => {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    fullName: "Sarah Bello",
    email: "sarah.bello@lincoln.edu.ng",
    phone: "+234 803 123 4567",
    department: "Computer Science (Hons) Software Engineering",
    campus: "Abuja",
  });

  const updateField = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 700));
    setSaving(false);
    setEditing(false);
  };

  const fieldCls = (readonly) =>
    `w-full h-11 px-4 border text-sm outline-none transition-colors duration-150 ${
      readonly
        ? darkMode
          ? "bg-white/[0.015] border-white/5 text-gray-500 cursor-not-allowed"
          : "bg-gray-50 border-gray-100 text-gray-400 cursor-not-allowed"
        : darkMode
        ? "bg-white/[0.03] border-white/10 text-white focus:border-primary/50"
        : "bg-white border-gray-200 text-gray-950 focus:border-primary/50"
    }`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className={`border ${darkMode ? "bg-[#0A0A0C] border-white/10" : "bg-white border-gray-200"} shadow-subtle`}
    >
      <div className={`flex items-center justify-between px-5 py-4 border-b ${darkMode ? "border-white/10" : "border-gray-200"}`}>
        <div>
          <h2 className={`text-[14px] font-black tracking-tight ${darkMode ? "text-white" : "text-gray-950"}`}>Personal Information</h2>
          <p className={`mt-1 text-[11.5px] ${darkMode ? "text-gray-500" : "text-gray-400"}`}>Campus and department fields are managed by the registrar</p>
        </div>

        <button
          onClick={() => (editing ? handleSave() : setEditing(true))}
          disabled={saving}
          className="shrink-0 flex items-center gap-2 h-9 px-4 bg-primary text-white text-[12.5px] font-bold hover:bg-primary-dark transition-colors duration-200 disabled:opacity-70"
        >
          {saving ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white animate-spin" /> Saving
            </>
          ) : editing ? (
            <>
              <FiSave size={13} /> Save
            </>
          ) : (
            <>
              <FiEdit2 size={13} /> Edit
            </>
          )}
        </button>
      </div>

      <div className="p-5 space-y-4">
        <div>
          <label className={`block text-[11.5px] font-bold uppercase tracking-wide mb-2 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            Full Name
          </label>
          <div className={`flex items-center gap-2.5 ${fieldCls(!editing)}`}>
            <FiUser className={darkMode ? "text-gray-500" : "text-gray-400"} size={14} />
            <input
              type="text"
              value={form.fullName}
              disabled={!editing}
              onChange={(e) => updateField("fullName", e.target.value)}
              className="flex-1 bg-transparent outline-none disabled:cursor-not-allowed"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={`block text-[11.5px] font-bold uppercase tracking-wide mb-2 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              Email Address
            </label>
            <div className={`flex items-center gap-2.5 ${fieldCls(!editing)}`}>
              <FiMail className={darkMode ? "text-gray-500" : "text-gray-400"} size={14} />
              <input
                type="email"
                value={form.email}
                disabled={!editing}
                onChange={(e) => updateField("email", e.target.value)}
                className="flex-1 bg-transparent outline-none disabled:cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className={`block text-[11.5px] font-bold uppercase tracking-wide mb-2 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              Phone Number
            </label>
            <div className={`flex items-center gap-2.5 ${fieldCls(!editing)}`}>
              <FiPhone className={darkMode ? "text-gray-500" : "text-gray-400"} size={14} />
              <input
                type="tel"
                value={form.phone}
                disabled={!editing}
                onChange={(e) => updateField("phone", e.target.value)}
                className="flex-1 bg-transparent outline-none disabled:cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        <div>
          <label className={`block text-[11.5px] font-bold uppercase tracking-wide mb-2 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            Department
          </label>
          <div className={`flex items-center px-4 h-11 ${fieldCls(true)}`}>{form.department}</div>
        </div>

        <div>
          <label className={`block text-[11.5px] font-bold uppercase tracking-wide mb-2 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            Campus
          </label>
          <div className={`flex items-center px-4 h-11 ${fieldCls(true)}`}>{form.campus} Campus</div>
        </div>

        {/* PASSWORD LINK */}
        <div className={`flex items-center justify-between pt-4 mt-4 border-t ${darkMode ? "border-white/10" : "border-gray-100"}`}>
          <div className="flex items-center gap-2.5">
            <FiLock className={darkMode ? "text-gray-500" : "text-gray-400"} size={14} />
            <div>
              <p className={`text-[12.5px] font-bold ${darkMode ? "text-white" : "text-gray-950"}`}>Password</p>
              <p className={`text-[11px] ${darkMode ? "text-gray-500" : "text-gray-400"}`}>Last changed 3 months ago</p>
            </div>
          </div>
          <button
            className={`text-[12px] font-bold px-3.5 py-2 border transition-colors duration-150 ${
              darkMode ? "border-white/10 text-gray-300 hover:bg-white/[0.05]" : "border-gray-200 text-gray-600 hover:bg-surface-light"
            }`}
          >
            Change
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileInfoForm;