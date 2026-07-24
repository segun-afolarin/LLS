import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import {
  FiBell, FiMoon, FiSun, FiMenu, FiSearch, FiX,
  FiAlertTriangle, FiCheckCircle, FiInfo, FiZap,
  FiChevronRight, FiTrash2,
} from "react-icons/fi";

/*
  FRONTEND-ONLY NOTE
  -------------------
  No backend yet. MOCK_ADMIN and MOCK_NOTIFICATIONS stand in for
  useAuth() and a real GET /api/admin/notifications call. Same shape,
  handlers, and panel component as the student header — only the mock
  data and the "Campus Admin — {campus}" role line differ. When the
  backend is ready, swap:
    - MOCK_NOTIFICATIONS        -> GET /admin/notifications
    - handleMarkAllRead body    -> PATCH /admin/notifications/read-all
    - handleMarkRead body       -> PATCH /admin/notifications/:id/read
    - handleDismiss body        -> DELETE /admin/notifications/:id
*/

const MOCK_ADMIN = {
  name: "Afolarin Oluwasegun",
  role: "Campus Admin",
  campus: "Abuja",
  avatar: null,
};

const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    type: "alert",
    title: "Report overdue",
    message: "LLS-2288 has been pending admin action for 48+ hours.",
    time: "10m ago",
    read: false,
  },
  {
    id: 2,
    type: "success",
    title: "Confirmation threshold reached",
    message: "LLS-2290 is ready for verification.",
    time: "35m ago",
    read: false,
  },
  {
    id: 3,
    type: "warning",
    title: "Action needed",
    message: "Portal/ICT issue on Gombe campus has been pending for 48 hours.",
    time: "1h ago",
    read: false,
  },
  {
    id: 4,
    type: "info",
    title: "New staff account created",
    message: "A new Facilities staff account was added.",
    time: "2h ago",
    read: true,
  },
];

const TYPE_CFG = {
  alert: {
    Icon: FiAlertTriangle, iconBg: "bg-primary", stripe: "bg-primary", dot: "bg-primary",
    badgeDark: "bg-primary/15 text-red-300 border-primary/30", badgeLight: "bg-red-50 text-primary-dark border-red-200", label: "Alert",
  },
  success: {
    Icon: FiCheckCircle, iconBg: "bg-gray-800", stripe: "bg-gray-800", dot: "bg-gray-600",
    badgeDark: "bg-white/10 text-gray-200 border-white/15", badgeLight: "bg-gray-100 text-gray-700 border-gray-200", label: "Verified",
  },
  info: {
    Icon: FiInfo, iconBg: "bg-gray-500", stripe: "bg-gray-500", dot: "bg-gray-400",
    badgeDark: "bg-white/10 text-gray-300 border-white/15", badgeLight: "bg-gray-100 text-gray-600 border-gray-200", label: "Info",
  },
  warning: {
    Icon: FiZap, iconBg: "bg-primary-dark", stripe: "bg-primary-dark", dot: "bg-primary-dark",
    badgeDark: "bg-primary/15 text-red-300 border-primary/30", badgeLight: "bg-red-50 text-primary-dark border-red-200", label: "Action Needed",
  },
};

const NotificationRow = ({ notif, darkMode, onRead, onDismiss, index }) => {
  const cfg = TYPE_CFG[notif.type] || TYPE_CFG.info;
  const { Icon } = cfg;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -16, height: 0, paddingTop: 0, paddingBottom: 0 }}
      transition={{ delay: index * 0.04, duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      className={`relative group ${darkMode ? !notif.read ? "bg-white/[0.03]" : "" : !notif.read ? "bg-red-50/40" : ""}`}
    >
      {!notif.read && <div className={`absolute left-0 top-0 w-[3px] h-full ${cfg.stripe}`} />}

      <div className="flex items-start gap-3 px-4 py-4 pl-5">
        <div className={`w-9 h-9 shrink-0 flex items-center justify-center text-white mt-0.5 ${cfg.iconBg}`}>
          <Icon size={14} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className={`inline-flex items-center px-2 py-0.5 border text-[10px] font-black tracking-[0.1em] uppercase ${darkMode ? cfg.badgeDark : cfg.badgeLight}`}>
              {cfg.label}
            </span>
            <span className={`text-[10.5px] font-medium shrink-0 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
              {notif.time}
            </span>
          </div>

          <p className={`text-[13px] font-bold leading-snug mb-1 ${darkMode ? "text-white" : "text-gray-950"}`}>
            {notif.title}
          </p>
          <p className={`text-[12px] leading-[1.65] ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            {notif.message}
          </p>

          <div className="flex items-center mt-2.5">
            {!notif.read && (
              <button
                onClick={() => onRead(notif.id)}
                className={`text-[11px] font-bold tracking-wide transition-colors duration-150 ${darkMode ? "text-red-400 hover:text-red-300" : "text-primary hover:text-primary-dark"}`}
              >
                Mark as read
              </button>
            )}
            <button
              onClick={() => onDismiss(notif.id)}
              className={`flex items-center gap-1 text-[11px] font-medium ml-auto opacity-0 group-hover:opacity-100 transition-all duration-150 ${darkMode ? "text-gray-600 hover:text-red-400" : "text-gray-400 hover:text-primary"}`}
            >
              <FiTrash2 size={11} /> Dismiss
            </button>
          </div>
        </div>

        {!notif.read && <div className={`w-2 h-2 shrink-0 mt-1.5 ${cfg.dot}`} />}
      </div>

      <div className={`mx-4 h-px ${darkMode ? "bg-white/[0.05]" : "bg-gray-100"}`} />
    </motion.div>
  );
};

const NotificationPanel = ({ darkMode, notifications, onClose, onMarkAllRead, onMarkRead, onDismiss }) => {
  const [filter, setFilter] = useState("all");
  const unreadCount = notifications.filter((n) => !n.read).length;
  const visible = filter === "unread" ? notifications.filter((n) => !n.read) : notifications;

  return (
    <motion.div
      initial={{ opacity: 0, y: -12, scaleY: 0.95 }}
      animate={{ opacity: 1, y: 0, scaleY: 1 }}
      exit={{ opacity: 0, y: -12, scaleY: 0.95 }}
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      style={{ transformOrigin: "top right" }}
      className={`
        fixed left-2.5 right-2.5 top-[78px]
        sm:absolute sm:left-auto sm:right-0 sm:top-[calc(100%+10px)]
        z-50 w-auto sm:w-[420px]
        max-h-[calc(100vh-94px)] sm:max-h-none
        flex flex-col border overflow-hidden
        ${darkMode ? "bg-[#0C0D10] border-white/[0.09] shadow-[0_24px_80px_rgba(0,0,0,0.7)]" : "bg-white border-gray-200 shadow-elevated"}
      `}
    >
      <div className="h-[2px] w-full shrink-0 bg-gradient-to-r from-transparent via-primary to-transparent" />

      <div className={`shrink-0 px-4 pt-4 pb-0 border-b ${darkMode ? "border-white/[0.07]" : "border-gray-100"}`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <h3 className={`text-[14px] font-black tracking-tight ${darkMode ? "text-white" : "text-gray-950"}`}>Notifications</h3>
            <AnimatePresence>
              {unreadCount > 0 && (
                <motion.span key="badge" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 26 }}
                  className="inline-flex items-center justify-center h-5 min-w-[20px] px-1.5 bg-primary text-white text-[10px] font-black leading-none">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <button onClick={onMarkAllRead}
                className={`text-[11px] font-bold uppercase tracking-wide px-2.5 py-1.5 transition-colors duration-150 ${darkMode ? "text-red-400 hover:text-red-300 hover:bg-white/[0.04]" : "text-primary hover:text-primary-dark hover:bg-red-50"}`}>
                Mark all read
              </button>
            )}
            <button onClick={onClose}
              className={`w-7 h-7 flex items-center justify-center transition-colors duration-150 ${darkMode ? "text-gray-500 hover:text-white hover:bg-white/[0.07]" : "text-gray-400 hover:text-black hover:bg-gray-100"}`}>
              <FiX size={14} />
            </button>
          </div>
        </div>

        <div className="flex items-center">
          {["all", "unread"].map((tab) => (
            <button key={tab} onClick={() => setFilter(tab)}
              className={`relative px-4 py-2.5 text-[11px] font-black uppercase tracking-[0.12em] transition-colors duration-150 ${filter === tab ? darkMode ? "text-white" : "text-gray-950" : darkMode ? "text-gray-500 hover:text-gray-300" : "text-gray-400 hover:text-gray-600"}`}>
              {tab === "all" ? "All" : `Unread${unreadCount > 0 ? ` (${unreadCount})` : ""}`}
              {filter === tab && <motion.div layoutId="admin-notif-tab" className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary" transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }} />}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-y-auto flex-1 sm:flex-none sm:max-h-[380px]">
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.length === 0 ? (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-14 gap-3">
              <div className={`w-12 h-12 flex items-center justify-center ${darkMode ? "bg-white/[0.04] text-gray-600" : "bg-gray-100 text-gray-400"}`}><FiBell size={20} /></div>
              <p className={`text-[13px] font-semibold ${darkMode ? "text-gray-500" : "text-gray-400"}`}>{filter === "unread" ? "No unread notifications" : "You're all caught up"}</p>
              <p className={`text-[11px] ${darkMode ? "text-gray-600" : "text-gray-300"}`}>New activity will appear here</p>
            </motion.div>
          ) : (
            visible.map((notif, i) => (
              <NotificationRow key={notif.id} notif={notif} darkMode={darkMode} onRead={onMarkRead} onDismiss={onDismiss} index={i} />
            ))
          )}
        </AnimatePresence>
      </div>

      {notifications.length > 0 && (
        <div className={`shrink-0 flex items-center justify-between px-4 py-3 border-t ${darkMode ? "border-white/[0.07] bg-white/[0.02]" : "border-gray-100 bg-gray-50/60"}`}>
          <span className={`text-[11px] font-medium ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
            {unreadCount === 0 ? "All caught up" : `${unreadCount} unread notification${unreadCount !== 1 ? "s" : ""}`}
          </span>
          <button className={`flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide transition-colors duration-150 ${darkMode ? "text-red-400 hover:text-red-300" : "text-primary hover:text-primary-dark"}`}>
            View all <FiChevronRight size={11} />
          </button>
        </div>
      )}
    </motion.div>
  );
};

/* ─────────────────────────────────────────────────────
   LLS ADMIN HEADER (frontend-only — no backend yet)
───────────────────────────────────────────────────── */
const AdminHeader = ({ darkMode, setDarkMode, sidebarOpen, setSidebarOpen, mobileSidebar, setMobileSidebar }) => {
  const admin = MOCK_ADMIN;

  const rawName   = admin?.name?.trim() ?? "";
  const parts     = rawName ? rawName.split(" ") : [];
  const firstName = parts[0] ? parts[0].charAt(0).toUpperCase() + parts[0].slice(1) : "Admin";
  const initials  = parts.length >= 2
    ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
    : parts[0] ? parts[0].slice(0, 2).toUpperCase() : "AD";
  // Load-bearing, unlike the student header's plain role: admin view is
  // scoped to a single campus, so that stays visible in the identity line.
  const roleLine = `${admin?.role ?? "Campus Admin"} — ${admin?.campus ?? ""}`;

  const avatarUrl = admin?.avatar || null;
  const [imgError, setImgError] = useState(false);
  useEffect(() => { setImgError(false); }, [avatarUrl]);

  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const [panelOpen, setPanelOpen] = useState(false);
  const bellRef  = useRef(null);
  const panelRef = useRef(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target) &&
          bellRef.current  && !bellRef.current.contains(e.target))
        setPanelOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") setPanelOpen(false); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    if (panelOpen && window.innerWidth < 640) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = prev; };
    }
  }, [panelOpen]);

  // ── Local-only handlers. Replace bodies with api calls once backend exists ──
  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleMarkRead = (id) => {
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  };

  const handleDismiss = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleSidebarToggle = () => {
    if (window.innerWidth < 1280) setMobileSidebar(!mobileSidebar);
    else setSidebarOpen(!sidebarOpen);
  };

  // Whether the menu button should show its "toggled" state — mobile drawer
  // open, or desktop sidebar collapsed. Gives the button a visible click
  // response instead of looking identical before and after the click.
  const menuButtonActive = mobileSidebar || !sidebarOpen;

  // ── Scroll-aware elevation — header gains depth once the page scrolls ──
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ── Command-palette style search — press Cmd/Ctrl+K anywhere to focus it ──
  const searchRef = useRef(null);
  const [searchFocused, setSearchFocused] = useState(false);
  useEffect(() => {
    const handleKeydown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, []);

  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45 }}
      className={`fixed top-0 left-0 right-0 z-50 h-[74px] md:h-[78px] border-b backdrop-blur-2xl transition-all duration-300 ${
        darkMode ? "bg-[#0A0A0C]/92 border-white/10" : "bg-white/90 border-gray-200"
      } ${scrolled ? "shadow-[0_8px_24px_rgba(17,24,39,0.06)]" : "shadow-none"}`}
    >
      <div className="relative z-10 h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">

        {/* LEFT */}
        <div className="flex items-center gap-3 md:gap-4">
          <motion.button
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.95 }}
            onClick={handleSidebarToggle}
            aria-pressed={menuButtonActive}
            aria-label={mobileSidebar ? "Close menu" : sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            className={`relative w-11 h-11 flex items-center justify-center text-lg border transition-all duration-300 ${darkMode ? "bg-white/[0.04] border-white/10 text-white hover:bg-white/[0.08]" : "bg-[#F7F7F7] border-gray-200 text-black hover:bg-white"}`}
          >
            <AnimatePresence mode="wait" initial={false}>
              {menuButtonActive ? (
                <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.18 }}><FiX /></motion.span>
              ) : (
                <motion.span key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.18 }}><FiMenu /></motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Wordmark, same treatment as student header, + Admin tag
              (load-bearing, same idea as the campus badge in the sidebar) */}
          <div className="flex items-center gap-2.5">
            <h1 className="text-[22px] sm:text-[24px] font-black tracking-tight leading-none text-primary">
              LLS
            </h1>
            <span className={`hidden sm:inline-flex px-2 py-1 border text-[10px] font-black uppercase tracking-wide ${darkMode ? "bg-white/[0.05] border-white/10 text-gray-300" : "bg-surface-light border-gray-200 text-gray-600"}`}>
              Admin
            </span>
          </div>
        </div>

        {/* CENTER — command-palette style search (desktop only), scoped to admin data */}
        <motion.div
          animate={{
            boxShadow: searchFocused ? "0 0 0 3px rgba(221,27,34,0.12)" : "0 0 0 0px rgba(221,27,34,0)",
          }}
          transition={{ duration: 0.2 }}
          className={`hidden xl:flex items-center gap-3 h-11 px-4 w-[340px] border transition-colors duration-300 ${
            darkMode
              ? `bg-white/[0.03] ${searchFocused ? "border-primary/50" : "border-white/10"}`
              : `bg-[#F7F7F7] ${searchFocused ? "border-primary/40 bg-white" : "border-gray-200"}`
          }`}
        >
          <FiSearch className={`text-sm shrink-0 ${darkMode ? "text-gray-400" : "text-gray-500"}`} />
          <input
            ref={searchRef}
            type="text"
            placeholder="Search reports, students, staff..."
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className={`bg-transparent outline-none text-sm w-full ${darkMode ? "text-white placeholder:text-gray-500" : "text-black placeholder:text-gray-400"}`}
          />
          <kbd
            className={`shrink-0 flex items-center gap-0.5 px-1.5 py-1 text-[10px] font-bold border ${
              darkMode ? "border-white/10 bg-white/[0.04] text-gray-500" : "border-gray-200 bg-white text-gray-400"
            }`}
          >
            ⌘K
          </kbd>
        </motion.div>

        {/* RIGHT */}
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
          <div className="relative">
            <motion.button
              ref={bellRef} whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }}
              onClick={() => setPanelOpen((v) => !v)}
              aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ""}`}
              className={`relative w-11 h-11 flex items-center justify-center text-lg border transition-all duration-300 ${darkMode ? `bg-white/[0.03] border-white/10 text-white hover:bg-white/[0.06] ${panelOpen ? "bg-white/[0.06]" : ""}` : `bg-[#F7F7F7] border-gray-200 text-black hover:bg-white ${panelOpen ? "bg-white" : ""}`}`}
            >
              <FiBell />
              <AnimatePresence mode="wait">
                {unreadCount > 0 ? (
                  <motion.span key="unread" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 520, damping: 24 }}
                    className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 bg-primary text-white text-[9.5px] font-black leading-none flex items-center justify-center">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </motion.span>
                ) : (
                  <motion.span key="zero" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    className="absolute -top-1.5 -right-1.5 w-[18px] h-[18px] bg-gray-400/50 text-white text-[9.5px] font-black leading-none flex items-center justify-center">
                    0
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            <div ref={panelRef}>
              <AnimatePresence>
                {panelOpen && (
                  <NotificationPanel
                    darkMode={darkMode} notifications={notifications}
                    onClose={() => setPanelOpen(false)}
                    onMarkAllRead={handleMarkAllRead}
                    onMarkRead={handleMarkRead}
                    onDismiss={handleDismiss}
                  />
                )}
              </AnimatePresence>
            </div>
          </div>

          <motion.button
            whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }}
            onClick={() => setDarkMode(!darkMode)}
            className={`w-11 h-11 flex items-center justify-center text-lg transition-all duration-300 ${darkMode ? "bg-primary text-white" : "bg-black text-white"}`}
          >
            <AnimatePresence mode="wait" initial={false}>
              {darkMode ? (
                <motion.span key="sun" initial={{ rotate: -80, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 80, opacity: 0 }} transition={{ duration: 0.2 }}><FiSun /></motion.span>
              ) : (
                <motion.span key="moon" initial={{ rotate: 80, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -80, opacity: 0 }} transition={{ duration: 0.2 }}><FiMoon /></motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          <motion.div whileHover={{ y: -2 }} className="flex items-center gap-3 pl-1 sm:pl-2 cursor-pointer">
            <div className="relative w-11 h-11 overflow-hidden">
              {avatarUrl && !imgError ? (
                <img src={avatarUrl} alt={admin?.name || "Profile"} className="w-full h-full object-cover" onError={() => setImgError(true)} />
              ) : (
                <div className="w-full h-full bg-primary flex items-center justify-center">
                  <span className="text-[13px] font-black tracking-tight text-white">{initials}</span>
                </div>
              )}
            </div>
            <div className="hidden lg:block">
              <h3 className={`text-sm font-semibold leading-none ${darkMode ? "text-white" : "text-black"}`}>{firstName}</h3>
              <p className={`text-xs mt-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{roleLine}</p>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
};

export default AdminHeader;