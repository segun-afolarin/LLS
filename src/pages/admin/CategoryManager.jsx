import { useState, useEffect } from "react";

import AdminHeader from "../../components/admin/AdminHeader";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminBottomNav from "../../components/admin/AdminBottomNav";

import CategoryManagerHeader from "../../components/admin/CategoryManagerHeader";
import CategoryList, { MOCK_CATEGORIES } from "../../components/admin/CategoryList";
import CategoryFormModal from "../../components/admin/CategoryFormModal";

const CategoryManager = () => {
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

  /* Category data lives here, at the page level, so the "Add/Edit"
     modal and the list below always stay in sync within this page. */
  const [categories, setCategories] = useState(MOCK_CATEGORIES);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const openAddModal = () => {
    setEditingCategory(null);
    setModalOpen(true);
  };

  const openEditModal = (category) => {
    setEditingCategory(category);
    setModalOpen(true);
  };

  const handleSaveCategory = (category) => {
    setCategories((prev) => {
      const exists = prev.some((c) => c.id === category.id);
      return exists ? prev.map((c) => (c.id === category.id ? category : c)) : [...prev, category];
    });
  };

  const handleToggleActive = (id) => setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, active: !c.active } : c)));
  const handleDelete = (id) => setCategories((prev) => prev.filter((c) => c.id !== id));

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
        <div className="max-w-[1000px] mx-auto space-y-6">
          <CategoryManagerHeader darkMode={darkMode} onAddCategory={openAddModal} />
          <CategoryList
            categories={categories}
            darkMode={darkMode}
            onToggleActive={handleToggleActive}
            onEdit={openEditModal}
            onDelete={handleDelete}
          />
        </div>
      </main>

      <AdminBottomNav darkMode={darkMode} />

      <CategoryFormModal
        open={modalOpen}
        darkMode={darkMode}
        editingCategory={editingCategory}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveCategory}
      />
    </div>
  );
};

export default CategoryManager;