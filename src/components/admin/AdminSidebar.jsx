import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiHome,
  FiInbox,
  FiCheckSquare,
  FiTag,
  FiBell,
  FiUsers,
  FiBarChart2,
  FiSettings,
  FiLogOut,
  FiChevronRight,
} from "react-icons/fi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import LogoutConfirmModal from "../layout/LogoutConfirmModal";

/*
  FRONTEND-ONLY NOTE
  -------------------
  No backend yet. CURRENT_CAMPUS stands in for the authenticated admin's
  assigned campus (from context, once auth exists). Unlike the student
  sidebar, this campus label is load-bearing information — it's the
  one thing that reminds an admin their view is scoped to a single
  campus, never university-wide. It now lives under the wordmark so the
  header still matches the student sidebar's structure exactly.
*/
const CURRENT_CAMPUS = "Abuja";

const AdminSidebar = ({ sidebarOpen, mobileSidebar, setMobileSidebar, darkMode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  const menuItems = [
    { title: "Dashboard", path: "/admin/dashboard", icon: <FiHome /> },
    { title: "Report Queue", path: "/admin/report-queue", icon: <FiInbox /> },
    { title: "Verified Reports", path: "/admin/verified-reports", icon: <FiCheckSquare /> },
    { title: "Category Manager", path: "/admin/categories", icon: <FiTag /> },
    { title: "Announcements", path: "/admin/announcements", icon: <FiBell /> },
    { title: "Staff Directory", path: "/admin/staff", icon: <FiUsers /> },
    { title: "Analytics", path: "/admin/analytics", icon: <FiBarChart2 /> },
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
          {/* HEADER — wordmark, exact match to student sidebar; campus badge sits below it, expanded-only */}
          <div className={`px-4 py-6 border-b ${darkMode ? "border-white/10" : "border-gray-200"}`}>
            <AnimatePresence mode="wait">
              {sidebarOpen || isMobile ? (
                <motion.div
                  key="full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <h1 className="text-[36px] font-black tracking-tight leading-none text-primary">
                    LLS
                  </h1>
                  <div className="flex items-center gap-1.5 mt-2">
                    <span className="w-1.5 h-1.5 bg-primary" />
                    <p className={`text-[10.5px] font-bold tracking-[0.14em] uppercase ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                      {CURRENT_CAMPUS} Campus
                    </p>
                  </div>
                </motion.div>
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
                  Administration
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
                      onClick={() => window.innerWidth < 1280 && setMobileSidebar(false)}
                      className="flex items-center justify-between w-full h-full"
                    >
                      {isActive && (
                        <>
                          <motion.div
                            layoutId="activeAdminSidebar"
                            transition={{ type: "spring", stiffness: 280, damping: 22 }}
                            className="absolute left-0 top-0 bottom-0 w-[3px] bg-white"
                          />
                          <motion.div
                            layoutId="activeAdminSidebarRight"
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
              to="/admin/settings"
              onClick={() => window.innerWidth < 1280 && setMobileSidebar(false)}
              className={`
                group relative h-[54px] flex items-center transition-all duration-200 overflow-hidden
                ${
                  location.pathname === "/admin/settings"
                    ? "bg-primary text-white"
                    : darkMode
                    ? "text-gray-300 hover:bg-white/[0.05] hover:text-white"
                    : "text-gray-600 hover:bg-[#F8F9FA] hover:text-gray-950"
                }
                ${sidebarOpen || isMobile ? "gap-4 px-4" : "justify-center"}
              `}
            >
              {location.pathname === "/admin/settings" && (
                <>
                  <motion.div
                    layoutId="activeAdminSidebar"
                    transition={{ type: "spring", stiffness: 280, damping: 22 }}
                    className="absolute left-0 top-0 bottom-0 w-[3px] bg-white"
                  />
                  <motion.div
                    layoutId="activeAdminSidebarRight"
                    transition={{ type: "spring", stiffness: 280, damping: 22 }}
                    className="absolute right-0 top-0 bottom-0 w-[3px] bg-white"
                  />
                </>
              )}

              <FiSettings className="text-[19px] relative z-10" />
              <AnimatePresence mode="wait">
                {(sidebarOpen || isMobile) && (
                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="relative z-10 text-sm font-semibold">
                    Settings
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>

            <button
              onClick={() => setLogoutModalOpen(true)}
              className={`group relative h-[54px] flex items-center w-full transition-all duration-200 overflow-hidden text-primary hover:bg-primary/[0.06] ${
                sidebarOpen || isMobile ? "gap-4 px-4" : "justify-center"
              }`}
            >
              <FiLogOut className="text-[19px] relative z-10" />
              <AnimatePresence mode="wait">
                {(sidebarOpen || isMobile) && (
                  <motion.span initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }} transition={{ duration: 0.2 }} className="relative z-10 text-sm font-semibold whitespace-nowrap">
                    Logout
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </motion.aside>

      <LogoutConfirmModal
        open={logoutModalOpen}
        darkMode={darkMode}
        onCancel={() => setLogoutModalOpen(false)}
        onConfirm={() => {
          localStorage.clear();
          sessionStorage.clear();
          setLogoutModalOpen(false);
          if (window.innerWidth < 1280) setMobileSidebar(false);
          navigate("/");
        }}
      />
    </>
  );
};

export default AdminSidebar;