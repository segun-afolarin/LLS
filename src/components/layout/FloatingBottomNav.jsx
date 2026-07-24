import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiHome, FiRss, FiFolder, FiUser, FiPlus } from "react-icons/fi";
import { Link, useLocation, useNavigate } from "react-router-dom";

/*
  FloatingBottomNav
  ------------------
  Mobile-only companion to the sidebar. Visible below the `md` breakpoint.
  Five slots: Home, Campus Feed, an elevated center action (Report Issue),
  My Reports, Profile.

  Behavior:
  - Stays hidden while the user is reading/scrolling through content.
  - Reveals itself only once the user nears the bottom of the page,
    so it doesn't pop in/out on every up/down scroll.
  - Active tab gets a sliding red underline + filled icon tile.
  - Safe-area aware for iOS home-indicator devices.
  - Full-width bar flush against the screen edges (not a floating card).
*/

const NAV_ITEMS = [
  { title: "Home", path: "/dashboard", icon: <FiHome /> },
  { title: "Feed", path: "/campus-feed", icon: <FiRss /> },
  { title: "__action__" },
  { title: "Reports", path: "/my-reports", icon: <FiFolder /> },
  { title: "Profile", path: "/profile", icon: <FiUser /> },
];

// How close to the bottom of the page (in px) before the nav reveals itself.
const BOTTOM_REVEAL_THRESHOLD = 160;

const FloatingBottomNav = ({ darkMode }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [visible, setVisible] = useState(false);
  const ticking = useRef(false);

  useEffect(() => {
    const evaluate = () => {
      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;
      const fullHeight = document.documentElement.scrollHeight;

      // If the page itself is shorter than the viewport, there's nothing
      // to scroll to — don't hide the nav in that case.
      if (fullHeight <= viewportHeight) {
        setVisible(true);
        return;
      }

      const distanceFromBottom = fullHeight - (scrollY + viewportHeight);
      setVisible(distanceFromBottom <= BOTTOM_REVEAL_THRESHOLD);
    };

    const handleScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        evaluate();
        ticking.current = false;
      });
    };

    // Check once on mount (e.g. short pages, or landing mid-page via anchor).
    evaluate();

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  return (
    <motion.nav
      initial={{ y: 120 }}
      animate={{ y: visible ? 0 : 120 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="md:hidden fixed bottom-0 left-0 right-0 z-40"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div
        className={`
          relative w-full border-t backdrop-blur-2xl
          ${darkMode ? "bg-[#0A0A0C]/95 border-white/10" : "bg-white/95 border-gray-200"}
        `}
      >
        {/* top hairline accent */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-primary" />

        <div className="flex items-stretch justify-between h-[60px] px-2">
          {NAV_ITEMS.map((item, index) => {
            if (item.title === "__action__") {
              return (
                <div key={index} className="relative flex-1 flex items-center justify-center">
                  <motion.button
                    whileTap={{ scale: 0.92 }}
                    whileHover={{ y: -2 }}
                    onClick={() => navigate("/report-issue")}
                    aria-label="Report an issue"
                    className="absolute -top-5 w-14 h-14 bg-primary text-white flex items-center justify-center shadow-[0_10px_28px_rgba(193,18,31,0.4)]"
                  >
                    <FiPlus size={24} />
                  </motion.button>
                  <span
                    className={`mt-8 text-[10px] font-bold tracking-wide ${
                      darkMode ? "text-gray-500" : "text-gray-400"
                    }`}
                  >
                    Report
                  </span>
                </div>
              );
            }

            const isActive = location.pathname === item.path;

            return (
              <Link
                key={index}
                to={item.path}
                className="relative flex-1 flex flex-col items-center justify-center gap-1"
              >
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      layoutId="bottomNavActive"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 26 }}
                      className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-primary"
                    />
                  )}
                </AnimatePresence>

                <motion.div
                  animate={{ scale: isActive ? 1.05 : 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className={`w-9 h-9 flex items-center justify-center text-[18px] transition-colors duration-200 ${
                    isActive
                      ? "bg-primary text-white"
                      : darkMode
                      ? "text-gray-400"
                      : "text-gray-500"
                  }`}
                >
                  {item.icon}
                </motion.div>

                <span
                  className={`text-[10px] font-bold tracking-wide transition-colors duration-200 ${
                    isActive
                      ? "text-primary"
                      : darkMode
                      ? "text-gray-500"
                      : "text-gray-400"
                  }`}
                >
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

export default FloatingBottomNav;