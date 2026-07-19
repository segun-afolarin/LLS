import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiBell, FiMoon, FiSun, FiMenu, FiSearch, FiX, FiAlertTriangle, FiCheckCircle } from "react-icons/fi";

/*
  FRONTEND-ONLY NOTE
  -------------------
  No backend yet. MOCK_ADMIN and MOCK_NOTIFICATIONS stand in for
  useAuth() and a real GET /api/admin/notifications call. Same shape as
  the student header's notifications — swap the data source only.
*/
const MOCK_ADMIN = {
  name: "Afolarin Oluwasegun",
  role: "Campus Admin",
  campus: "Abuja",
  avatar: null,
};

const MOCK_NOTIFICATIONS = [
  { id: 1, type: "alert", title: "Report overdue", message: "LLS-2288 has been pending admin action for 48+ hours.", time: "10m ago", read: false },
  { id: 2, type: "success", title: "Confirmation threshold reached", message: "LLS-2290 is ready for verification.", time: "35m ago", read: false },
  { id: 3, type: "info", title: "New staff account created", message: "A new Facilities staff account was added.", time: "2h ago", read: true },
];

const TYPE_CFG = {
  alert: { icon: <FiAlertTriangle size={13} />, bg: "bg-primary" },
  success: { icon: <FiCheckCircle size={13} />, bg: "bg-emerald-600" },
  info: { icon: <FiBell size={13} />, bg: "bg-gray-600" },
};

const AdminHeader = ({ darkMode, setDarkMode, sidebarOpen, setSidebarOpen, mobileSidebar, setMobileSidebar }) => {
  const admin = MOCK_ADMIN;
  const initials = admin.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();

  const [notifications] = useState(MOCK_NOTIFICATIONS);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const [panelOpen, setPanelOpen] = useState(false);
  const bellRef = useRef(null);
  const panelRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target) && bellRef.current && !bellRef.current.contains(e.target)) setPanelOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSidebarToggle = () => {
    if (window.innerWidth < 1280) setMobileSidebar(!mobileSidebar);
    else setSidebarOpen(!sidebarOpen);
  };

  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45 }}
      className={`fixed top-0 left-0 right-0 z-50 h-[74px] md:h-[78px] border-b backdrop-blur-2xl transition-all duration-300 ${
        darkMode ? "bg-[#0A0A0C]/92 border-white/10" : "bg-white/90 border-gray-200"
      }`}
    >
      <div className="relative z-10 h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* LEFT */}
        <div className="flex items-center gap-3 md:gap-4">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSidebarToggle}
            className={`w-11 h-11 flex items-center justify-center text-lg border transition-all duration-300 ${
              darkMode ? "bg-white/[0.04] border-white/10 text-white hover:bg-white/[0.08]" : "bg-[#F7F7F7] border-gray-200 text-black hover:bg-white"
            }`}
          >
            <AnimatePresence mode="wait" initial={false}>
              {mobileSidebar ? (
                <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.18 }}><FiX /></motion.span>
              ) : (
                <motion.span key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.18 }}><FiMenu /></motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          <div className="hidden sm:flex items-center gap-2.5">
            <h1 className="text-[20px] font-black tracking-tight text-primary">LLS</h1>
            <span className={`px-2 py-1 border text-[10px] font-black uppercase tracking-wide ${darkMode ? "bg-white/[0.05] border-white/10 text-gray-300" : "bg-surface-light border-gray-200 text-gray-600"}`}>
              Admin
            </span>
          </div>
        </div>

        {/* CENTER — search scoped to campus data */}
        <div className={`hidden xl:flex items-center gap-3 h-11 px-4 w-[340px] border transition-colors duration-300 ${darkMode ? "bg-white/[0.03] border-white/10" : "bg-[#F7F7F7] border-gray-200"}`}>
          <FiSearch className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`} />
          <input
            type="text"
            placeholder="Search reports, students, staff..."
            className={`bg-transparent outline-none text-sm w-full ${darkMode ? "text-white placeholder:text-gray-500" : "text-black placeholder:text-gray-400"}`}
          />
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
          <div className="relative">
            <motion.button
              ref={bellRef}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setPanelOpen((v) => !v)}
              className={`relative w-11 h-11 flex items-center justify-center text-lg border transition-all duration-300 ${
                darkMode ? "bg-white/[0.03] border-white/10 text-white hover:bg-white/[0.06]" : "bg-[#F7F7F7] border-gray-200 text-black hover:bg-white"
              }`}
            >
              <FiBell />
              {unreadCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 bg-primary text-white text-[9.5px] font-black flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </motion.button>

            <AnimatePresence>
              {panelOpen && (
                <motion.div
                  ref={panelRef}
                  initial={{ opacity: 0, y: -10, scaleY: 0.95 }}
                  animate={{ opacity: 1, y: 0, scaleY: 1 }}
                  exit={{ opacity: 0, y: -10, scaleY: 0.95 }}
                  transition={{ duration: 0.2 }}
                  style={{ transformOrigin: "top right" }}
                  className={`absolute right-0 top-[calc(100%+10px)] w-[340px] border overflow-hidden z-50 ${darkMode ? "bg-[#0A0A0C] border-white/10" : "bg-white border-gray-200"} shadow-elevated`}
                >
                  <div className="h-[2px] bg-primary" />
                  <div className={`px-4 py-3 border-b ${darkMode ? "border-white/10" : "border-gray-100"}`}>
                    <p className={`text-[13px] font-black ${darkMode ? "text-white" : "text-gray-950"}`}>Admin Notifications</p>
                  </div>
                  <div>
                    {notifications.map((n) => {
                      const cfg = TYPE_CFG[n.type];
                      return (
                        <div key={n.id} className={`flex items-start gap-3 px-4 py-3 border-b last:border-0 ${darkMode ? "border-white/[0.05]" : "border-gray-100"}`}>
                          <div className={`w-8 h-8 shrink-0 flex items-center justify-center text-white ${cfg.bg}`}>{cfg.icon}</div>
                          <div className="min-w-0">
                            <p className={`text-[12.5px] font-bold ${darkMode ? "text-white" : "text-gray-950"}`}>{n.title}</p>
                            <p className={`text-[11.5px] mt-0.5 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{n.message}</p>
                            <p className={`text-[10.5px] mt-1 ${darkMode ? "text-gray-600" : "text-gray-400"}`}>{n.time}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setDarkMode(!darkMode)}
            className={`w-11 h-11 flex items-center justify-center text-lg transition-all duration-300 ${darkMode ? "bg-primary text-white" : "bg-black text-white"}`}
          >
            {darkMode ? <FiSun /> : <FiMoon />}
          </motion.button>

          <div className="flex items-center gap-3 pl-1 sm:pl-2">
            <div className="w-11 h-11 bg-primary flex items-center justify-center shrink-0">
              <span className="text-[13px] font-black text-white">{initials}</span>
            </div>
            <div className="hidden lg:block">
              <h3 className={`text-sm font-semibold leading-none ${darkMode ? "text-white" : "text-black"}`}>{admin.name}</h3>
              <p className={`text-xs mt-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{admin.role} — {admin.campus}</p>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default AdminHeader;