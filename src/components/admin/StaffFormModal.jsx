import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiSave } from "react-icons/fi";

const DEPARTMENTS = ["Facilities", "ICT", "Security", "Health Center", "Student Affairs"];

const StaffFormModal = ({ open, darkMode, editingStaff, onClose, onSave }) => {
  const isEditing = !!editingStaff;

  const [form, setForm] = useState({ name: "", role: "", department: DEPARTMENTS[0], email: "", phone: "" });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      setForm({
        name: editingStaff?.name ?? "",
        role: editingStaff?.role ?? "",
        department: editingStaff?.department ?? DEPARTMENTS[0],
        email: editingStaff?.email ?? "",
        phone: editingStaff?.phone ?? "",
      });
      setErrors({});
    }
  }, [open, editingStaff]);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: null }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Enter a name.";
    if (!form.role.trim()) newErrors.role = "Enter a role or title.";
    if (!form.email.trim()) newErrors.email = "Enter an email address.";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    onSave({
      id: editingStaff?.id ?? Date.now(),
      ...form,
      activeReports: editingStaff?.activeReports ?? 0,
    });
    onClose();
  };

  const inputCls = (field) =>
    `w-full h-11 px-4 border text-sm outline-none transition-colors duration-150 ${
      errors[field]
        ? "border-primary"
        : darkMode
        ? "bg-white/[0.03] border-white/10 text-white placeholder:text-gray-600 focus:border-primary/50"
        : "bg-white border-gray-200 text-gray-950 placeholder:text-gray-400 focus:border-primary/50"
    }`;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
          />

          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", stiffness: 340, damping: 26 }}
              className={`relative w-full max-w-md pointer-events-auto border overflow-hidden ${
                darkMode ? "bg-[#0A0A0C] border-white/10" : "bg-white border-gray-200"
              } shadow-elevated`}
            >
              <div className="h-[3px] w-full bg-primary" />

              <button
                onClick={onClose}
                className={`absolute top-4 right-4 w-8 h-8 flex items-center justify-center transition-colors duration-150 ${
                  darkMode ? "text-gray-500 hover:text-white hover:bg-white/[0.06]" : "text-gray-400 hover:text-gray-900 hover:bg-gray-100"
                }`}
                aria-label="Close"
              >
                <FiX size={16} />
              </button>

              <form onSubmit={handleSubmit} className="p-6 sm:p-7 max-h-[85vh] overflow-y-auto">
                <h2 className={`text-lg font-black tracking-tight ${darkMode ? "text-white" : "text-gray-950"}`}>
                  {isEditing ? "Edit Staff Member" : "Add Staff Member"}
                </h2>
                <p className={`mt-1.5 text-[12.5px] ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                  {isEditing ? "Update this staff member's details." : "Add someone verified reports can be assigned to."}
                </p>

                <div className="mt-6 space-y-4">
                  <div>
                    <label className={`block text-[11.5px] font-bold uppercase tracking-wide mb-2 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                      Full Name
                    </label>
                    <input type="text" value={form.name} onChange={(e) => updateField("name", e.target.value)} placeholder="e.g. Yakubu Ibrahim" className={inputCls("name")} />
                    {errors.name && <p className="mt-1.5 text-[12px] font-semibold text-primary">{errors.name}</p>}
                  </div>

                  <div>
                    <label className={`block text-[11.5px] font-bold uppercase tracking-wide mb-2 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                      Role / Title
                    </label>
                    <input type="text" value={form.role} onChange={(e) => updateField("role", e.target.value)} placeholder="e.g. Facilities Supervisor" className={inputCls("role")} />
                    {errors.role && <p className="mt-1.5 text-[12px] font-semibold text-primary">{errors.role}</p>}
                  </div>

                  <div>
                    <label className={`block text-[11.5px] font-bold uppercase tracking-wide mb-2 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                      Department
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {DEPARTMENTS.map((dept) => {
                        const isSelected = form.department === dept;
                        return (
                          <button
                            type="button"
                            key={dept}
                            onClick={() => updateField("department", dept)}
                            className={`px-3.5 py-1.5 text-[12px] font-semibold border transition-colors duration-150 ${
                              isSelected
                                ? "bg-primary border-primary text-white"
                                : darkMode
                                ? "border-white/10 text-gray-400 hover:border-white/25"
                                : "border-gray-200 text-gray-500 hover:border-gray-300"
                            }`}
                          >
                            {dept}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-[11.5px] font-bold uppercase tracking-wide mb-2 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                        Email
                      </label>
                      <input type="email" value={form.email} onChange={(e) => updateField("email", e.target.value)} placeholder="name@lincoln.edu.ng" className={inputCls("email")} />
                      {errors.email && <p className="mt-1.5 text-[12px] font-semibold text-primary">{errors.email}</p>}
                    </div>
                    <div>
                      <label className={`block text-[11.5px] font-bold uppercase tracking-wide mb-2 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                        Phone
                      </label>
                      <input type="tel" value={form.phone} onChange={(e) => updateField("phone", e.target.value)} placeholder="+234..." className={inputCls("phone")} />
                    </div>
                  </div>
                </div>

                <div className="mt-7 flex gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className={`flex-1 h-11 font-bold text-[13px] border transition-colors duration-200 ${
                      darkMode ? "border-white/10 text-gray-200 hover:bg-white/[0.05]" : "border-gray-200 text-gray-700 hover:bg-surface-light"
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 h-11 flex items-center justify-center gap-2 bg-primary text-white font-bold text-[13px] hover:bg-primary-dark transition-colors duration-200"
                  >
                    <FiSave size={13} /> {isEditing ? "Save Changes" : "Add Staff"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default StaffFormModal;