import { useState } from "react";
import { FiSliders } from "react-icons/fi";
import Toggle from "../common/Toggle";

/*
  FRONTEND-ONLY NOTE
  -------------------
  No backend yet. Privacy toggles are local state only — swap for a real
  PATCH /api/profile/preferences call once the backend exists. Dark mode
  toggle here controls the actual app-wide darkMode state passed down
  from the Settings page (same state the header's sun/moon button uses).
*/
const SettingsPreferences = ({ darkMode, setDarkMode }) => {
  const [privacy, setPrivacy] = useState({
    showNameOnReports: true,
    showProfileToOthers: true,
  });

  const updatePrivacy = (key, value) => setPrivacy((prev) => ({ ...prev, [key]: value }));

  return (
    <div className={`border ${darkMode ? "bg-[#0A0A0C] border-white/10" : "bg-white border-gray-200"} shadow-subtle`}>
      <div className={`flex items-center gap-3 px-5 py-4 border-b ${darkMode ? "border-white/10" : "border-gray-200"}`}>
        <div className={`w-8 h-8 flex items-center justify-center ${darkMode ? "bg-white/[0.05] text-gray-300" : "bg-surface-light text-primary"}`}>
          <FiSliders size={14} />
        </div>
        <div>
          <h2 className={`text-[14px] font-black tracking-tight ${darkMode ? "text-white" : "text-gray-950"}`}>Preferences</h2>
          <p className={`mt-0.5 text-[11.5px] ${darkMode ? "text-gray-500" : "text-gray-400"}`}>Display and privacy defaults</p>
        </div>
      </div>

      <div className="p-5 space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className={`text-[13px] font-bold ${darkMode ? "text-white" : "text-gray-950"}`}>Dark mode</p>
            <p className={`mt-0.5 text-[11.5px] ${darkMode ? "text-gray-500" : "text-gray-400"}`}>Set as your default appearance</p>
          </div>
          <Toggle checked={darkMode} onChange={setDarkMode} darkMode={darkMode} />
        </div>

        <div className="flex items-center justify-between gap-4">
          <div>
            <p className={`text-[13px] font-bold ${darkMode ? "text-white" : "text-gray-950"}`}>Show my name on reports I file</p>
            <p className={`mt-0.5 text-[11.5px] ${darkMode ? "text-gray-500" : "text-gray-400"}`}>Off, your reports appear as "Anonymous Student"</p>
          </div>
          <Toggle checked={privacy.showNameOnReports} onChange={(v) => updatePrivacy("showNameOnReports", v)} darkMode={darkMode} />
        </div>

        <div className="flex items-center justify-between gap-4">
          <div>
            <p className={`text-[13px] font-bold ${darkMode ? "text-white" : "text-gray-950"}`}>Show my profile to other students</p>
            <p className={`mt-0.5 text-[11.5px] ${darkMode ? "text-gray-500" : "text-gray-400"}`}>Controls visibility on the campus contributor list</p>
          </div>
          <Toggle checked={privacy.showProfileToOthers} onChange={(v) => updatePrivacy("showProfileToOthers", v)} darkMode={darkMode} />
        </div>
      </div>
    </div>
  );
};

export default SettingsPreferences;