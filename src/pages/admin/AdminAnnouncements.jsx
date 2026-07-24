import { useState, useEffect } from "react";

import AdminHeader from "../../components/admin/AdminHeader";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminBottomNav from "../../components/admin/AdminBottomNav";

import AdminAnnouncementsHeader from "../../components/admin/AdminAnnouncementsHeader";
import AdminAnnouncementsList, { MOCK_ADMIN_ANNOUNCEMENTS } from "../../components/admin/AdminAnnouncementsList";
import AnnouncementComposerModal from "../../components/admin/AnnouncementComposerModal";

const AdminAnnouncements = () => {
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

  /* Announcements live at the page level so the composer modal and the
     list below always stay in sync within this page. */
  const [announcements, setAnnouncements] = useState(MOCK_ADMIN_ANNOUNCEMENTS);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);

  const openComposeModal = () => {
    setEditingAnnouncement(null);
    setModalOpen(true);
  };

  const openEditModal = (announcement) => {
    setEditingAnnouncement(announcement);
    setModalOpen(true);
  };

  const handleSave = (announcement) => {
    setAnnouncements((prev) => {
      const exists = prev.some((a) => a.id === announcement.id);
      return exists ? prev.map((a) => (a.id === announcement.id ? announcement : a)) : [announcement, ...prev];
    });
  };

  const handleDelete = (id) => setAnnouncements((prev) => prev.filter((a) => a.id !== id));
  const handleTogglePin = (id) => setAnnouncements((prev) => prev.map((a) => (a.id === id ? { ...a, pinned: !a.pinned } : a)));

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
        <div className="max-w-[900px] mx-auto space-y-6">
          <AdminAnnouncementsHeader darkMode={darkMode} onCompose={openComposeModal} />
          <AdminAnnouncementsList
            announcements={announcements}
            darkMode={darkMode}
            onEdit={openEditModal}
            onDelete={handleDelete}
            onTogglePin={handleTogglePin}
          />
        </div>
      </main>

      <AdminBottomNav darkMode={darkMode} />

      <AnnouncementComposerModal
        open={modalOpen}
        darkMode={darkMode}
        editingAnnouncement={editingAnnouncement}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
};

export default AdminAnnouncements;