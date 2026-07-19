import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/auth/Login";
import StudentDashboard from "./pages/student/StudentDashboard";
import ReportIssue from "./pages/student/ReportIssue";
import CampusFeed from "./pages/student/CampusFeed";
import Onboarding from "./pages/auth/Onboarding";
import MyReports from "./pages/student/MyReports";
import Logout from "./pages/student/Logout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import NotFound from "./pages/student/NotFound";
import Settings from "./pages/student/Settings";
import Profile from "./pages/student/Profile";
import Announcements from "./pages/student/Announcements";
import AIAssistant from "./pages/student/AIAssistant";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Authentication */}
        <Route path="/" element={<Login />} />

        {/* Student */}
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/logout" element={<Logout />} />
        <Route path="/student/report-issue" element={<ReportIssue />} />
        <Route path="/student/campus-feed" element={<CampusFeed />} />
        <Route path="/student/my-reports" element={<MyReports />} />
        <Route path="/student/announcements" element={<Announcements />} />
        <Route path="/student/profile" element={<Profile />} />
        <Route path="/student/ai-assistant" element={<AIAssistant />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/student/settings" element={<Settings />} />
        {/* Catch-all — must stay last */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;