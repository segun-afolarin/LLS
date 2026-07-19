import { useState, useEffect } from "react";

import AdminHeader from "../../components/admin/AdminHeader";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminBottomNav from "../../components/admin/AdminBottomNav";

import AdminDashboardHero from "../../components/admin/AdminDashboardHero";
import AdminStats from "../../components/admin/AdminStats";
import ReportQueuePreview from "../../components/admin/ReportQueuePreview";
import CategoryBreakdownAdmin from "../../components/admin/CategoryBreakdownAdmin";

const AdminDashboard = () => {
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
      <AdminHeader
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        mobileSidebar={mobileSidebar}
        setMobileSidebar={setMobileSidebar}
      />

      <AdminSidebar
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
        <div className="max-w-[1700px] mx-auto space-y-6">
          <AdminDashboardHero darkMode={darkMode} />
          <AdminStats darkMode={darkMode} />

          <section className="grid grid-cols-1 2xl:grid-cols-[1.4fr_0.6fr] gap-6">
            <ReportQueuePreview darkMode={darkMode} />
            <CategoryBreakdownAdmin darkMode={darkMode} />
          </section>
        </div>
      </main>

      <AdminBottomNav darkMode={darkMode} />
    </div>
  );
};

export default AdminDashboard;