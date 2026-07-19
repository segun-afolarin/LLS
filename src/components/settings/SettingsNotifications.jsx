import { useState } from "react";
import { FiBell } from "react-icons/fi";
import Toggle from "../common/Toggle";

/*
  FRONTEND-ONLY NOTE
  -------------------
  No backend yet. Local state only — swap for a real PATCH
  /api/profile/notifications call once the backend exists. sound_key
  matches the SOUND_MAP keys already used in DashboardHeader.
*/
const SOUND_OPTIONS = [
  { key: "default", label: "Default" },
  { key: "chime", label: "Chime" },
  { key: "alert", label: "Alert" },
  { key: "bell", label: "Bell" },
  { key: "silent", label: "Silent" },
];

const SettingsNotifications = ({ darkMode }) => {
  const [sound, setSound] = useState("default");
  const [prefs, setPrefs] = useState({
    reportUpdates: true,
    campusConfirmations: true,
    announcements: true,
    aiAssistant: false,
  });

  const updatePref = (key, value) => setPrefs((prev) => ({ ...prev, [key]: value }));

  const rows = [
    { key: "reportUpdates", label: "My report status changes", desc: "When a report you filed moves to a new stage" },
    { key: "campusConfirmations", label: "New reports on my campus", desc: "When a fellow student files a new report" },
    { key: "announcements", label: "Official announcements", desc: "New notices from your campus administration" },
    { key: "aiAssistant", label: "AI Assistant suggestions", desc: "Proactive tips while filing or tracking a report" },
  ];

  return (
    <div className={`border ${darkMode ? "bg-[#0A0A0C] border-white/10" : "bg-white border-gray-200"} shadow-subtle`}>
      <div className={`flex items-center gap-3 px-5 py-4 border-b ${darkMode ? "border-white/10" : "border-gray-200"}`}>
        <div className={`w-8 h-8 flex items-center justify-center ${darkMode ? "bg-white/[0.05] text-gray-300" : "bg-surface-light text-primary"}`}>
          <FiBell size={14} />
        </div>
        <div>
          <h2 className={`text-[14px] font-black tracking-tight ${darkMode ? "text-white" : "text-gray-950"}`}>Notifications</h2>
          <p className={`mt-0.5 text-[11.5px] ${darkMode ? "text-gray-500" : "text-gray-400"}`}>Choose what you're notified about</p>
        </div>
      </div>

      <div className="p-5 space-y-4">
        {rows.map((row) => (
          <div key={row.key} className="flex items-center justify-between gap-4">
            <div>
              <p className={`text-[13px] font-bold ${darkMode ? "text-white" : "text-gray-950"}`}>{row.label}</p>
              <p className={`mt-0.5 text-[11.5px] ${darkMode ? "text-gray-500" : "text-gray-400"}`}>{row.desc}</p>
            </div>
            <Toggle checked={prefs[row.key]} onChange={(v) => updatePref(row.key, v)} darkMode={darkMode} />
          </div>
        ))}

        {/* NOTIFICATION SOUND */}
        <div className={`pt-4 mt-1 border-t ${darkMode ? "border-white/10" : "border-gray-100"}`}>
          <label className={`block text-[11.5px] font-bold uppercase tracking-wide mb-2.5 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            Notification Sound
          </label>
          <div className="flex flex-wrap gap-2">
            {SOUND_OPTIONS.map((opt) => {
              const isActive = sound === opt.key;
              return (
                <button
                  key={opt.key}
                  onClick={() => setSound(opt.key)}
                  className={`px-3.5 py-1.5 text-[12px] font-semibold border transition-colors duration-150 ${
                    isActive
                      ? "bg-primary border-primary text-white"
                      : darkMode
                      ? "border-white/10 text-gray-400 hover:border-white/25"
                      : "border-gray-200 text-gray-500 hover:border-gray-300"
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsNotifications;