import { useState, useEffect } from "react";

import DashboardHeader from "../../components/layout/DashboardHeader";
import DashboardSidebar from "../../components/layout/DashboardSidebar";
import FloatingBottomNav from "../../components/layout/FloatingBottomNav";

import DashboardHero from "../../components/dashboard/DashboardHero";
import DashboardStats from "../../components/dashboard/DashboardStats";
import RecentReports from "../../components/dashboard/RecentReports";
import CampusOverview from "../../components/dashboard/CampusOverview";
import ActivityTimeline from "../../components/dashboard/ActivityTimeline";

const StudentDashboard = () => {
  /* DARK MODE */
  const [darkMode, setDarkMode] = useState(false);

  /* DESKTOP SIDEBAR */
  const [sidebarOpen, setSidebarOpen] = useState(
    typeof window !== "undefined" ? window.innerWidth >= 1280 : true
  );

  /* MOBILE SIDEBAR */
  const [mobileSidebar, setMobileSidebar] = useState(false);

  /* DARK MODE EFFECT */
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  /* RESPONSIVE SIDEBAR */
  useEffect(() => {
    const handleResize = () => {
      setSidebarOpen(window.innerWidth >= 1280);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      className={`relative min-h-screen transition-colors duration-500 ${
        darkMode ? "bg-[#0A0A0C] text-white" : "bg-surface-light text-text"
      }`}
    >
      {/* GLOBAL BACKGROUND — one quiet signal, not a light show.
          A single hairline top accent is enough; the content carries
          the page, not decorative color washes. */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-primary" />
      </div>

      {/* HEADER */}
      <DashboardHeader
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        mobileSidebar={mobileSidebar}
        setMobileSidebar={setMobileSidebar}
      />

      {/* SIDEBAR */}
      <DashboardSidebar
        sidebarOpen={sidebarOpen}
        mobileSidebar={mobileSidebar}
        setMobileSidebar={setMobileSidebar}
        darkMode={darkMode}
      />

      {/* MAIN CONTENT */}
      <main
        className={`relative z-10 pt-24 md:pt-28 pb-32 px-4 sm:px-6 lg:px-8 transition-all duration-500 ${
          sidebarOpen ? "xl:ml-[290px]" : "xl:ml-[96px]"
        }`}
      >
        <div className="max-w-[1700px] mx-auto space-y-8">
          {/* HERO — greeting + single primary action, not a marketing banner */}
          <DashboardHero darkMode={darkMode} />

          {/* STATS — the at-a-glance numbers, the reason a dashboard exists */}
          <DashboardStats darkMode={darkMode} />

          {/* CAMPUS CONTEXT + TRUE SHORTCUTS */}
          <section className="grid grid-cols-1 2xl:grid-cols-[1.35fr_0.65fr] gap-6">
            <CampusOverview darkMode={darkMode} />
          </section>

          {/* CONTENT: report list + status log (kept distinct, not duplicated) */}
          <section className="grid grid-cols-1 2xl:grid-cols-[1fr_0.42fr] gap-6">
            <RecentReports darkMode={darkMode} />
            <ActivityTimeline darkMode={darkMode} />
          </section>
        </div>
      </main>

      {/* MOBILE NAVIGATION */}
      <FloatingBottomNav darkMode={darkMode} />
    </div>
  );
};

export default StudentDashboard;