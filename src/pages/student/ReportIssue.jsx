import { useState, useEffect } from "react";

import DashboardHeader from "../../components/layout/DashboardHeader";
import DashboardSidebar from "../../components/layout/DashboardSidebar";
import FloatingBottomNav from "../../components/layout/FloatingBottomNav";

import ReportIssueHeader from "../../components/reports/ReportIssueHeader";
import ReportIssueForm from "../../components/reports/ReportIssueForm";

const ReportIssue = () => {
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
      {/* HEADER — reused as-is */}
      <DashboardHeader
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        mobileSidebar={mobileSidebar}
        setMobileSidebar={setMobileSidebar}
      />

      {/* SIDEBAR — reused as-is */}
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
        <div className="max-w-[1000px] mx-auto space-y-6">
          {/* PAGE HEADER — title, subtitle, tracking-id preview */}
          <ReportIssueHeader darkMode={darkMode} />

          {/* THE FORM — all step logic, validation, and UI lives here */}
          <ReportIssueForm darkMode={darkMode} />
        </div>
      </main>

      {/* MOBILE NAVIGATION — reused as-is */}
      <FloatingBottomNav darkMode={darkMode} />
    </div>
  );
};

export default ReportIssue;