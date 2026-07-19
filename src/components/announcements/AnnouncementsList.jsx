import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiTool,
  FiShield,
  FiFileText,
  FiBookOpen,
  FiMessageSquare,
  FiChevronDown,
  FiPaperclip,
  FiUser,
} from "react-icons/fi";
import { BsPinAngleFill } from "react-icons/bs";

/*
  FRONTEND-ONLY NOTE
  -------------------
  No backend yet. MOCK_ANNOUNCEMENTS stands in for GET /api/announcements,
  scoped server-side to the student's own campus. Pinned announcements
  always render first regardless of date; the rest are grouped under
  date headers exactly as a real feed would render once paginated data
  arrives.
*/

const CATEGORY_CFG = {
  Maintenance: { icon: <FiTool />, tone: "gray" },
  Safety: { icon: <FiShield />, tone: "primary" },
  Policy: { icon: <FiFileText />, tone: "gray" },
  Academic: { icon: <FiBookOpen />, tone: "emerald" },
  General: { icon: <FiMessageSquare />, tone: "gray" },
};

const TONE_CFG = {
  gray: { light: "bg-gray-100 text-gray-600 border-gray-200", dark: "bg-white/10 text-gray-300 border-white/15" },
  primary: { light: "bg-red-50 text-primary-dark border-red-200", dark: "bg-primary/10 text-red-300 border-primary/25" },
  emerald: { light: "bg-emerald-50 text-emerald-700 border-emerald-200", dark: "bg-emerald-500/10 text-emerald-400 border-emerald-500/25" },
};

const MOCK_ANNOUNCEMENTS = [
  {
    id: 1,
    pinned: true,
    category: "Safety",
    title: "Campus-wide security patrol schedule update",
    author: "Office of Student Affairs",
    date: "Today",
    dateGroup: "This Week",
    summary: "Evening patrol routes have been expanded to cover all three hostel blocks following recent reports.",
    body: "Following a review of recent security reports submitted through LLS, patrol routes have been expanded to include the perimeter of all three hostel blocks between 9pm and 5am. Additional lighting will also be installed at Gate 2 within the next two weeks. Students are encouraged to continue reporting any security concerns through the platform.",
    hasAttachment: false,
  },
  {
    id: 2,
    pinned: true,
    category: "Maintenance",
    title: "Water supply interruption — Female Hostel, Wing B",
    author: "Facilities Management",
    date: "Today",
    dateGroup: "This Week",
    summary: "Scheduled pipe repair will affect water supply in Wing B tomorrow between 8am and 2pm.",
    body: "In response to reports filed on LLS regarding water pressure issues, a scheduled repair has been arranged for tomorrow. Water supply to Female Hostel Wing B will be interrupted between 8:00am and 2:00pm while the affected pipe section is replaced. Alternative water points will be available at the ground floor common room during this period.",
    hasAttachment: true,
  },
  {
    id: 3,
    pinned: false,
    category: "Academic",
    title: "Semester 6 exam clearance deadline extended",
    author: "Faculty of Computer Science & Multimedia",
    date: "2 days ago",
    dateGroup: "This Week",
    summary: "The exam clearance submission deadline has been moved from Friday to the following Wednesday.",
    body: "Due to a high volume of pending clearance submissions, the Faculty of Computer Science & Multimedia has extended the Semester 6 exam clearance deadline. All outstanding documents must now be submitted by Wednesday at 4:00pm. No further extensions will be granted.",
    hasAttachment: true,
  },
  {
    id: 4,
    pinned: false,
    category: "Policy",
    title: "Updated guest policy for hostel visitors",
    author: "Office of Student Affairs",
    date: "3 days ago",
    dateGroup: "This Week",
    summary: "All hostel guests must now be registered at the gate before 8pm, with valid ID required.",
    body: "Effective immediately, all visitors to any hostel block must be registered with the gate security officer before 8:00pm. Visitors must present a valid ID and state the name of the student they are visiting. This policy applies to all three campuses and was introduced following student feedback submitted via LLS.",
    hasAttachment: false,
  },
  {
    id: 5,
    pinned: false,
    category: "Maintenance",
    title: "ICT portal maintenance window this weekend",
    author: "ICT Directorate",
    date: "1 week ago",
    dateGroup: "Earlier",
    summary: "The student portal will be unavailable Saturday from 12am to 6am for scheduled upgrades.",
    body: "The student portal, including course registration and results access, will undergo scheduled maintenance this Saturday from 12:00am to 6:00am. This is in direct response to the login failures reported by multiple students this week. We apologize for any inconvenience.",
    hasAttachment: false,
  },
  {
    id: 6,
    pinned: false,
    category: "General",
    title: "Library extended hours during exam period",
    author: "University Library",
    date: "1 week ago",
    dateGroup: "Earlier",
    summary: "The main library will remain open until midnight throughout the exam period, starting Monday.",
    body: "To support students during the upcoming exam period, the main library will extend its operating hours to midnight daily, starting next Monday. The 3rd floor reading room's air conditioning has also been repaired following recent reports.",
    hasAttachment: false,
  },
];

const AnnouncementCard = ({ announcement, index, darkMode }) => {
  const [expanded, setExpanded] = useState(false);
  const cfg = CATEGORY_CFG[announcement.category] || CATEGORY_CFG.General;
  const tone = TONE_CFG[cfg.tone];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
      className={`border ${darkMode ? "bg-[#0A0A0C] border-white/10" : "bg-white border-gray-200"} shadow-subtle`}
    >
      <button onClick={() => setExpanded((v) => !v)} className="w-full text-left p-4 sm:p-5">
        <div className="flex items-start gap-3.5">
          <div className={`w-10 h-10 shrink-0 flex items-center justify-center text-[16px] ${darkMode ? "bg-white/[0.05] text-gray-200" : "bg-surface-light text-gray-700"}`}>
            {cfg.icon}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              {announcement.pinned && (
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 border text-[10px] font-black tracking-wide uppercase ${darkMode ? "bg-primary/10 border-primary/25 text-red-300" : "bg-red-50 border-red-200 text-primary-dark"}`}>
                  <BsPinAngleFill size={9} /> Pinned
                </span>
              )}
              <span className={`inline-flex items-center px-2 py-0.5 border text-[10px] font-black tracking-[0.08em] uppercase ${darkMode ? tone.dark : tone.light}`}>
                {announcement.category}
              </span>
            </div>

            <h3 className={`text-[14.5px] font-bold leading-snug ${darkMode ? "text-white" : "text-gray-950"}`}>{announcement.title}</h3>
            <p className={`mt-1.5 text-[12.5px] leading-relaxed ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{announcement.summary}</p>

            <div className="flex items-center gap-3 flex-wrap mt-2.5">
              <span className={`flex items-center gap-1.5 text-[11px] font-semibold ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                <FiUser size={10} /> {announcement.author}
              </span>
              <span className={`text-[11px] ${darkMode ? "text-gray-600" : "text-gray-400"}`}>{announcement.date}</span>
              {announcement.hasAttachment && (
                <span className={`flex items-center gap-1 text-[11px] font-semibold ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                  <FiPaperclip size={10} /> Attachment
                </span>
              )}
            </div>
          </div>

          <FiChevronDown className={`shrink-0 mt-1 transition-transform duration-200 ${expanded ? "rotate-180" : ""} ${darkMode ? "text-gray-500" : "text-gray-400"}`} size={16} />
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className={`px-4 sm:px-5 pb-5 pt-1 ml-[52px] border-t ${darkMode ? "border-white/10" : "border-gray-100"}`}>
              <p className={`text-[13px] leading-relaxed pt-4 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>{announcement.body}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const AnnouncementsList = ({ darkMode, activeCategory }) => {
  const filtered = useMemo(() => {
    if (activeCategory === "All") return MOCK_ANNOUNCEMENTS;
    return MOCK_ANNOUNCEMENTS.filter((a) => a.category === activeCategory);
  }, [activeCategory]);

  const pinned = filtered.filter((a) => a.pinned);
  const unpinned = filtered.filter((a) => !a.pinned);

  const groups = useMemo(() => {
    const map = {};
    unpinned.forEach((a) => {
      if (!map[a.dateGroup]) map[a.dateGroup] = [];
      map[a.dateGroup].push(a);
    });
    return map;
  }, [unpinned]);

  if (filtered.length === 0) {
    return (
      <div className={`border p-14 text-center ${darkMode ? "bg-[#0A0A0C] border-white/10" : "bg-white border-gray-200"}`}>
        <p className={`text-[14px] font-bold ${darkMode ? "text-white" : "text-gray-950"}`}>No announcements in this category</p>
        <p className={`mt-1.5 text-[12.5px] ${darkMode ? "text-gray-500" : "text-gray-400"}`}>Check back later, or try a different filter.</p>
      </div>
    );
  }

  return (
    <div className="space-y-7">
      {pinned.length > 0 && (
        <div className="flex flex-col gap-3.5">
          {pinned.map((a, i) => (
            <AnnouncementCard key={a.id} announcement={a} index={i} darkMode={darkMode} />
          ))}
        </div>
      )}

      {Object.entries(groups).map(([groupName, items]) => (
        <div key={groupName}>
          <p className={`text-[11px] font-black uppercase tracking-[0.18em] mb-3 px-1 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>{groupName}</p>
          <div className="flex flex-col gap-3.5">
            {items.map((a, i) => (
              <AnnouncementCard key={a.id} announcement={a} index={i} darkMode={darkMode} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnnouncementsList;