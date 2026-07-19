import { useState, useEffect } from "react";

import DashboardHeader from "../../components/layout/DashboardHeader";
import DashboardSidebar from "../../components/layout/DashboardSidebar";
import FloatingBottomNav from "../../components/layout/FloatingBottomNav";

import ProfileIDCard from "../../components/profile/ProfileIDCard";
import ProfileStats from "../../components/profile/ProfileStats";
import ProfileBadges from "../../components/profile/ProfileBadges";
import ProfileInfoForm from "../../components/profile/ProfileInfoForm";

const Profile = () => {
  const [darkMode, setDarkMode] = useState(false);
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
        <div className="max-w-[1100px] mx-auto space-y-6">
          <ProfileIDCard darkMode={darkMode} />

          <div className="grid grid-cols-1 xl:grid-cols-[1fr_0.75fr] gap-6">
            <ProfileInfoForm darkMode={darkMode} />
            <div className="space-y-6">
              <ProfileStats darkMode={darkMode} />
              <ProfileBadges darkMode={darkMode} />
            </div>
          </div>
        </div>
      </main>

      <FloatingBottomNav darkMode={darkMode} />
    </div>
  );
};

export default Profile;