import { useState, useEffect } from "react";

import DashboardHeader from "../../components/layout/DashboardHeader";
import DashboardSidebar from "../../components/layout/DashboardSidebar";
import FloatingBottomNav from "../../components/layout/FloatingBottomNav";

import SettingsSecurity from "../../components/settings/SettingsSecurity";
import SettingsNotifications from "../../components/settings/SettingsNotifications";
import SettingsPreferences from "../../components/settings/SettingsPreferences";

const Settings = ({ darkMode: darkModeProp, setDarkMode: setDarkModeProp }) => {
  const [darkMode, setDarkMode] = useState(darkModeProp ?? false);
  const [sidebarOpen, setSidebarOpen] = useState(
    typeof window !== "undefined" ? window.innerWidth >= 1280 : true
  );
  const [mobileSidebar, setMobileSidebar] = useState(false);

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [darkMode]);

  useEffect(() => {
    const handleResize = () => setSidebarOpen(window.innerWidth >= 1280);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className={`relative min-h-screen transition-colors duration-500 ${darkMode ? "bg-[#0A0A0C] text-white" : "bg-surface-light text-text"}`}>
      <DashboardHeader
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        mobileSidebar={mobileSidebar}
        setMobileSidebar={setMobileSidebar}
      />

      <DashboardSidebar
        sidebarOpen={sidebarOpen}
        mobileSidebar={mobileSidebar}
        setMobileSidebar={setMobileSidebar}
        darkMode={darkMode}
      />

      <main
        className={`relative z-10 pt-24 md:pt-28 pb-32 px-4 sm:px-6 lg:px-8 transition-all duration-500 ${
          sidebarOpen ? "xl:ml-[290px]" : "xl:ml-[96px]"
        }`}
      >
        <div className="max-w-[760px] mx-auto space-y-6">
          <div>
            <h1 className={`text-[22px] sm:text-[26px] font-black tracking-tight leading-none ${darkMode ? "text-white" : "text-gray-950"}`}>
              Settings
            </h1>
            <p className={`mt-2 text-[13px] ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              Manage your security, notifications, and display preferences.
            </p>
          </div>

          <SettingsSecurity darkMode={darkMode} />
          <SettingsNotifications darkMode={darkMode} />
          <SettingsPreferences darkMode={darkMode} setDarkMode={setDarkMode} />
        </div>
      </main>

      <FloatingBottomNav darkMode={darkMode} />
    </div>
  );
};

export default Settings;