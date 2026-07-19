import { useState } from "react";
import { FiLock, FiSave } from "react-icons/fi";

/*
  FRONTEND-ONLY NOTE
  -------------------
  No backend yet. handleSubmit simulates a save with a delay — replace
  with a real PATCH /api/profile/password call once the backend exists.
*/
const SettingsSecurity = ({ darkMode }) => {
  const [form, setForm] = useState({ current: "", next: "", confirm: "" });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError("");
    setSaved(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.current || !form.next || !form.confirm) {
      setError("Fill in all three fields.");
      return;
    }
    if (form.next.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }
    if (form.next !== form.confirm) {
      setError("New password and confirmation don't match.");
      return;
    }

    setSaving(true);
    await new Promise((r) => setTimeout(r, 700));
    setSaving(false);
    setSaved(true);
    setForm({ current: "", next: "", confirm: "" });
  };

  const inputCls = `w-full h-11 px-4 border text-sm outline-none transition-colors duration-150 ${
    darkMode
      ? "bg-white/[0.03] border-white/10 text-white placeholder:text-gray-600 focus:border-primary/50"
      : "bg-white border-gray-200 text-gray-950 placeholder:text-gray-400 focus:border-primary/50"
  }`;

  return (
    <div className={`border ${darkMode ? "bg-[#0A0A0C] border-white/10" : "bg-white border-gray-200"} shadow-subtle`}>
      <div className={`flex items-center gap-3 px-5 py-4 border-b ${darkMode ? "border-white/10" : "border-gray-200"}`}>
        <div className={`w-8 h-8 flex items-center justify-center ${darkMode ? "bg-white/[0.05] text-gray-300" : "bg-surface-light text-primary"}`}>
          <FiLock size={14} />
        </div>
        <div>
          <h2 className={`text-[14px] font-black tracking-tight ${darkMode ? "text-white" : "text-gray-950"}`}>Password</h2>
          <p className={`mt-0.5 text-[11.5px] ${darkMode ? "text-gray-500" : "text-gray-400"}`}>Update your account password</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-5 space-y-4">
        <div>
          <label className={`block text-[11.5px] font-bold uppercase tracking-wide mb-2 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            Current Password
          </label>
          <input
            type="password"
            value={form.current}
            onChange={(e) => updateField("current", e.target.value)}
            placeholder="••••••••"
            className={inputCls}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={`block text-[11.5px] font-bold uppercase tracking-wide mb-2 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              New Password
            </label>
            <input
              type="password"
              value={form.next}
              onChange={(e) => updateField("next", e.target.value)}
              placeholder="At least 8 characters"
              className={inputCls}
            />
          </div>
          <div>
            <label className={`block text-[11.5px] font-bold uppercase tracking-wide mb-2 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              Confirm New Password
            </label>
            <input
              type="password"
              value={form.confirm}
              onChange={(e) => updateField("confirm", e.target.value)}
              placeholder="Re-enter new password"
              className={inputCls}
            />
          </div>
        </div>

        {error && <p className="text-[12px] font-semibold text-primary">{error}</p>}
        {saved && <p className="text-[12px] font-semibold text-emerald-600">Password updated successfully.</p>}

        <div className="flex justify-end pt-1">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 h-10 px-5 bg-primary text-white text-[12.5px] font-bold hover:bg-primary-dark transition-colors duration-200 disabled:opacity-70"
          >
            {saving ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white animate-spin" /> Updating
              </>
            ) : (
              <>
                <FiSave size={13} /> Update Password
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SettingsSecurity;