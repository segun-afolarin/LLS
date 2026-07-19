import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiHome, FiCheckSquare, FiInbox, FiBarChart2, FiUsers } from "react-icons/fi";
import { Link, useLocation, useNavigate } from "react-router-dom";

/*
  Mirrors the student FloatingBottomNav's structure (scroll-aware hide,
  raised center action, safe-area padding) but with admin-relevant
  destinations. Report Queue is raised since triage is an admin's most
  frequent single action — the equivalent of a student's "Report Issue."
*/

const NAV_ITEMS = [
  { title: "Home", path: "/admin/dashboard", icon: <FiHome /> },
  { title: "Verified", path: "/admin/verified-reports", icon: <FiCheckSquare /> },
  { title: "__action__" },
  { title: "Staff", path: "/admin/staff", icon: <FiUsers /> },
  { title: "Analytics", path: "/admin/analytics", icon: <FiBarChart2 /> },
];

const AdminBottomNav = ({ darkMode }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    lastScrollY.current = window.scrollY;

    const handleScroll = () => {
      if (ticking.current) return;
      ticking.current = true;

      requestAnimationFrame(() => {
        const currentY = window.scrollY;
        const delta = currentY - lastScrollY.current;

        if (currentY < 40) setVisible(true);
        else if (delta > 6) setVisible(false);
        else if (delta < -6) setVisible(true);

        lastScrollY.current = currentY;
        ticking.current = false;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: 0 }}
      animate={{ y: visible ? 0 : 120 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="md:hidden fixed bottom-0 left-0 right-0 z-40"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className={`relative mx-3 mb-3 border shadow-elevated backdrop-blur-2xl ${darkMode ? "bg-[#0A0A0C]/95 border-white/10" : "bg-white/95 border-gray-200"}`}>
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-primary" />

        <div className="flex items-stretch justify-between h-[64px] px-1">
          {NAV_ITEMS.map((item, index) => {
            if (item.title === "__action__") {
              return (
                <div key={index} className="relative flex-1 flex items-center justify-center">
                  <motion.button
                    whileTap={{ scale: 0.92 }}
                    whileHover={{ y: -2 }}
                    onClick={() => navigate("/admin/report-queue")}
                    aria-label="Report Queue"
                    className="absolute -top-6 w-14 h-14 bg-primary text-white flex items-center justify-center shadow-[0_10px_28px_rgba(221,27,34,0.4)]"
                  >
                    <FiInbox size={22} />
                  </motion.button>
                  <span className={`mt-8 text-[10px] font-bold tracking-wide ${darkMode ? "text-gray-500" : "text-gray-400"}`}>Queue</span>
                </div>
              );
            }

            const isActive = location.pathname === item.path;

            return (
              <Link key={index} to={item.path} className="relative flex-1 flex flex-col items-center justify-center gap-1">
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      layoutId="adminBottomNavActive"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 26 }}
                      className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-primary"
                    />
                  )}
                </AnimatePresence>

                <div className={`w-9 h-9 flex items-center justify-center text-[18px] transition-colors duration-200 ${isActive ? "bg-primary text-white" : darkMode ? "text-gray-400" : "text-gray-500"}`}>
                  {item.icon}
                </div>
                <span className={`text-[10px] font-bold tracking-wide transition-colors duration-200 ${isActive ? "text-primary" : darkMode ? "text-gray-500" : "text-gray-400"}`}>
                  {item.title}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </motion.nav>
  );
};

export default AdminBottomNav;