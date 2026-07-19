import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiHome,
  FiSend,
  FiRss,
  FiFolder,
  FiUser,
  FiBell,
  FiCpu,
  FiSettings,
  FiLogOut,
  FiChevronRight,
} from "react-icons/fi";
import { Link, useLocation } from "react-router-dom";

const DashboardSidebar = ({ sidebarOpen, mobileSidebar, setMobileSidebar, darkMode }) => {
  const location = useLocation();

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  const menuItems = [
    { title: "Dashboard", path: "/student/dashboard", icon: <FiHome /> },
    { title: "Report Issue", path: "/student/report-issue", icon: <FiSend /> },
    { title: "Campus Feed", path: "/student/campus-feed", icon: <FiRss /> },
    { title: "My Reports", path: "/student/my-reports", icon: <FiFolder /> },
    { title: "Announcements", path: "/student/announcements", icon: <FiBell /> },
    { title: "AI Assistant", path: "/student/ai-assistant", icon: <FiCpu /> },
    { title: "Profile", path: "/student/profile", icon: <FiUser /> },
  ];

  return (
    <>
      {/* MOBILE OVERLAY */}
      <AnimatePresence>
        {mobileSidebar && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(6px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            onClick={() => setMobileSidebar(false)}
            className="fixed inset-0 bg-black/40 z-30 xl:hidden"
          />
        )}
      </AnimatePresence>

      {/* SIDEBAR */}
      <motion.aside
        initial={false}
        animate={{
          width: sidebarOpen || isMobile ? 290 : 92,
          x: mobileSidebar || !isMobile ? 0 : -320,
        }}
        transition={{
          width: { type: "spring", stiffness: 180, damping: 22 },
          x: { type: "spring", stiffness: 140, damping: 20 },
        }}
        className={`
          fixed top-[74px] md:top-[78px] left-0 bottom-0
          w-[290px] max-w-[88vw] z-40 border-r overflow-hidden
          shadow-[8px_0_40px_rgba(0,0,0,0.06)]
          ${darkMode ? "bg-[#0A0A0C]/98 border-white/10" : "bg-white border-gray-200"}
        `}
      >
        {/* BACKGROUND — hairline grid, restrained, no glow-soup */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage:
                "linear-gradient(to right, #C1121F 1px, transparent 1px), linear-gradient(to bottom, #C1121F 1px, transparent 1px)",
              backgroundSize: "56px 56px",
            }}
          />
        </div>

        {/* TOP ACCENT STRIP */}
        <div className="h-[3px] w-full bg-primary" />

        {/* CONTENT */}
        <div className="relative z-10 h-full overflow-y-auto overscroll-contain flex flex-col">
          {/* HEADER — wordmark only, no subtitle text, matches reference */}
          <div className={`px-4 py-6 border-b ${darkMode ? "border-white/10" : "border-gray-200"}`}>
            <AnimatePresence mode="wait">
              {sidebarOpen || isMobile ? (
                <motion.h1
                  key="full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-[36px] font-black tracking-tight leading-none text-primary"
                >
                  LLS
                </motion.h1>
              ) : (
                <motion.div
                  key="collapsed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="w-11 h-11 mx-auto bg-primary flex items-center justify-center"
                >
                  <span className="text-white text-[15px] font-black tracking-tight">LLS</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* NAVIGATION */}
          <div className="flex-1 px-4 py-6">
            <AnimatePresence mode="wait">
              {(sidebarOpen || isMobile) && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`px-2 mb-4 text-[11px] font-bold tracking-[0.22em] uppercase ${darkMode ? "text-gray-500" : "text-gray-400"}`}
                >
                  Navigation
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex flex-col gap-1.5">
              {menuItems.map((item, index) => {
                const isActive = location.pathname === item.path;

                return (
                  <motion.div
                    key={index}
                    whileHover={{ x: sidebarOpen || isMobile ? 4 : 0 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 260, damping: 18 }}
                    className={`
                      group relative h-[54px] transition-all duration-200 overflow-hidden
                      ${
                        isActive
                          ? "bg-primary text-white"
                          : darkMode
                          ? "text-gray-300 hover:bg-white/[0.05] hover:text-white"
                          : "text-gray-600 hover:bg-[#F8F9FA] hover:text-gray-950"
                      }
                    `}
                  >
                    <Link
                      to={item.path}
                      onClick={() => {
                        if (window.innerWidth < 1280) setMobileSidebar(false);
                      }}
                      className="flex items-center justify-between w-full h-full"
                    >
                      {isActive && (
                        <>
                          <motion.div
                            layoutId="activeSidebarLLS"
                            transition={{ type: "spring", stiffness: 280, damping: 22 }}
                            className="absolute left-0 top-0 bottom-0 w-[3px] bg-white"
                          />
                          <motion.div
                            layoutId="activeSidebarLLSRight"
                            transition={{ type: "spring", stiffness: 280, damping: 22 }}
                            className="absolute right-0 top-0 bottom-0 w-[3px] bg-white"
                          />
                        </>
                      )}

                      <div className={`relative z-10 flex items-center ${sidebarOpen || isMobile ? "gap-4 px-4" : "justify-center w-full"}`}>
                        <div className="text-[19px] shrink-0">{item.icon}</div>

                        <AnimatePresence mode="wait">
                          {(sidebarOpen || isMobile) && (
                            <motion.span
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -10 }}
                              transition={{ duration: 0.2 }}
                              className="text-sm font-semibold whitespace-nowrap"
                            >
                              {item.title}
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </div>

                      {(sidebarOpen || isMobile) && (
                        <motion.div
                          animate={{ opacity: isActive ? 1 : 0, x: isActive ? 0 : -4 }}
                          transition={{ duration: 0.2 }}
                          className="relative z-10 pr-4"
                        >
                          <FiChevronRight className="text-sm" />
                        </motion.div>
                      )}

                      {/* TOOLTIP — collapsed state only */}
                      {!sidebarOpen && !isMobile && (
                        <motion.div
                          initial={{ opacity: 0, x: -8 }}
                          whileHover={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.2 }}
                          className="absolute left-[78px] px-3 py-2 text-sm font-semibold whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 bg-[#111827] text-white z-50 shadow-elevated border border-white/10"
                        >
                          {item.title}
                        </motion.div>
                      )}
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* BOTTOM — Settings + Logout */}
          <div className={`p-4 border-t flex flex-col gap-1.5 ${darkMode ? "border-white/10" : "border-gray-200"}`}>
            <Link
              to="/student/settings"
              onClick={() => {
                if (window.innerWidth < 1280) setMobileSidebar(false);
              }}
              className={`
                group relative h-[54px] flex items-center transition-all duration-200 overflow-hidden
                ${
                  location.pathname === "/student/settings"
                    ? "bg-primary text-white"
                    : darkMode
                    ? "text-gray-300 hover:bg-white/[0.05] hover:text-white"
                    : "text-gray-600 hover:bg-[#F8F9FA] hover:text-gray-950"
                }
                ${sidebarOpen || isMobile ? "gap-4 px-4" : "justify-center"}
              `}
            >
              {location.pathname === "/student/settings" && (
                <>
                  <motion.div
                    layoutId="activeSidebarLLS"
                    transition={{ type: "spring", stiffness: 280, damping: 22 }}
                    className="absolute left-0 top-0 bottom-0 w-[3px] bg-white"
                  />
                  <motion.div
                    layoutId="activeSidebarLLSRight"
                    transition={{ type: "spring", stiffness: 280, damping: 22 }}
                    className="absolute right-0 top-0 bottom-0 w-[3px] bg-white"
                  />
                </>
              )}

              <FiSettings className="text-[19px] relative z-10" />

              <AnimatePresence mode="wait">
                {(sidebarOpen || isMobile) && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="relative z-10 text-sm font-semibold"
                  >
                    Settings
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>

            <Link
              to="/student/logout"
              onClick={() => {
                localStorage.clear();
                sessionStorage.clear();
                if (window.innerWidth < 1280) setMobileSidebar(false);
              }}
              className={`
                group relative h-[54px] flex items-center transition-all duration-200 overflow-hidden
                text-primary hover:bg-primary/[0.06]
                ${sidebarOpen || isMobile ? "gap-4 px-4" : "justify-center"}
              `}
            >
              <FiLogOut className="text-[19px] relative z-10" />

              <AnimatePresence mode="wait">
                {(sidebarOpen || isMobile) && (
                  <motion.span
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    transition={{ duration: 0.2 }}
                    className="relative z-10 text-sm font-semibold whitespace-nowrap"
                  >
                    Logout
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default DashboardSidebar;