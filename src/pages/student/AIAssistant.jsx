import { useState, useEffect } from "react";

import DashboardHeader from "../../components/layout/DashboardHeader";
import DashboardSidebar from "../../components/layout/DashboardSidebar";
import FloatingBottomNav from "../../components/layout/FloatingBottomNav";

import ChatWindow from "../../components/ai/ChatWindow";

const AIAssistant = () => {
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

      {/* MAIN — fixed-height chat shell rather than a scrolling page body,
          since a chat interface should own its own scroll region. */}
      <main
        className={`relative z-10 pt-24 md:pt-28 pb-24 md:pb-8 px-4 sm:px-6 lg:px-8 transition-all duration-500 h-screen flex flex-col ${
          sidebarOpen ? "xl:ml-[290px]" : "xl:ml-[96px]"
        }`}
      >
        <div className="max-w-[900px] w-full mx-auto flex-1 flex flex-col min-h-0">
          <ChatWindow darkMode={darkMode} />
        </div>
      </main>

      <FloatingBottomNav darkMode={darkMode} />
    </div>
  );
};

export default AIAssistant;