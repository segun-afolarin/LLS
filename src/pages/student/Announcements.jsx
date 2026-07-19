import { useState, useEffect } from "react";

import DashboardHeader from "../../components/layout/DashboardHeader";
import DashboardSidebar from "../../components/layout/DashboardSidebar";
import FloatingBottomNav from "../../components/layout/FloatingBottomNav";

import AnnouncementsHeader from "../../components/announcements/AnnouncementsHeader";
import AnnouncementsFilters from "../../components/announcements/AnnouncementsFilters";
import AnnouncementsList from "../../components/announcements/AnnouncementsList";

const Announcements = () => {
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

  const [activeCategory, setActiveCategory] = useState("All");

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
        <div className="max-w-[900px] mx-auto space-y-6">
          <AnnouncementsHeader darkMode={darkMode} />
          <AnnouncementsFilters darkMode={darkMode} activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
          <AnnouncementsList darkMode={darkMode} activeCategory={activeCategory} />
        </div>
      </main>

      <FloatingBottomNav darkMode={darkMode} />
    </div>
  );
};

export default Announcements;