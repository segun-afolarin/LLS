import { useState, useEffect } from "react";

import AdminHeader from "../../components/admin/AdminHeader";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminBottomNav from "../../components/admin/AdminBottomNav";

import StaffDirectoryHeader from "../../components/admin/StaffDirectoryHeader";
import StaffDirectoryFilters from "../../components/admin/StaffDirectoryFilters";
import StaffList, { MOCK_STAFF } from "../../components/admin/StaffList";
import StaffFormModal from "../../components/admin/StaffFormModal";

const StaffDirectory = () => {
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

  const [staff, setStaff] = useState(MOCK_STAFF);
  const [activeDepartment, setActiveDepartment] = useState("All");
  const [search, setSearch] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);

  const openAddModal = () => {
    setEditingStaff(null);
    setModalOpen(true);
  };

  const openEditModal = (member) => {
    setEditingStaff(member);
    setModalOpen(true);
  };

  const handleSave = (member) => {
    setStaff((prev) => {
      const exists = prev.some((s) => s.id === member.id);
      return exists ? prev.map((s) => (s.id === member.id ? member : s)) : [...prev, member];
    });
  };

  const handleRemove = (id) => setStaff((prev) => prev.filter((s) => s.id !== id));

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
        <div className="max-w-[1200px] mx-auto space-y-6">
          <StaffDirectoryHeader darkMode={darkMode} onAddStaff={openAddModal} />

          <StaffDirectoryFilters
            darkMode={darkMode}
            activeDepartment={activeDepartment}
            setActiveDepartment={setActiveDepartment}
            search={search}
            setSearch={setSearch}
          />

          <StaffList
            staff={staff}
            darkMode={darkMode}
            activeDepartment={activeDepartment}
            search={search}
            onEdit={openEditModal}
            onRemove={handleRemove}
          />
        </div>
      </main>

      <AdminBottomNav darkMode={darkMode} />

      <StaffFormModal open={modalOpen} darkMode={darkMode} editingStaff={editingStaff} onClose={() => setModalOpen(false)} onSave={handleSave} />
    </div>
  );
};

export default StaffDirectory;