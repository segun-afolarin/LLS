import { useState, useEffect } from "react";

import AdminHeader from "../../components/admin/AdminHeader";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminBottomNav from "../../components/admin/AdminBottomNav";

import ReportQueueHeader from "../../components/admin/ReportQueueHeader";
import ReportQueueFilters from "../../components/admin/ReportQueueFilters";
import ReportQueueTable from "../../components/admin/ReportQueueTable";

const ReportQueue = () => {
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
  const [activeSort, setActiveSort] = useState("waiting");
  const [search, setSearch] = useState("");

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
        <div className="max-w-[1400px] mx-auto space-y-6">
          <ReportQueueHeader darkMode={darkMode} />

          <ReportQueueFilters
            darkMode={darkMode}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            activeSort={activeSort}
            setActiveSort={setActiveSort}
            search={search}
            setSearch={setSearch}
          />

          <ReportQueueTable darkMode={darkMode} activeCategory={activeCategory} activeSort={activeSort} search={search} />
        </div>
      </main>

      <AdminBottomNav darkMode={darkMode} />
    </div>
  );
};

export default ReportQueue;