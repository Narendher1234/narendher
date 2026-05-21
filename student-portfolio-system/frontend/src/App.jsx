import {
    BrowserRouter,
    Routes,
    Route,
    useLocation
} from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";

// ================= AUTH =================
import Login from "./pages/Login";
import TeacherLogin from "./pages/TeacherLogin";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import TeacherForgotPassword from "./pages/TeacherForgotPassword";
import TeacherRegister from "./pages/TeacherRegister";

// ================= STUDENT =================
import Dashboard from "./pages/Dashboard";
import SubmissionPage from "./pages/SubmissionPage";
import HistoryPage from "./pages/HistoryPage";
import PortfolioPage from "./pages/PortfolioPage";
import PreviewPage from "./pages/PreviewPage";

// ================= TEACHER =================
import TeacherDashboard from "./pages/TeacherDashboard";
import Evaluation from "./pages/Evaluation";

// ================= ADMIN =================
import AdminPage from "./pages/AdminPage";

// ================= NAVBAR =================
import Navbar from "./Navbar";

function Layout() {

    const location = useLocation();

    return (
        <>
            {/* NAVBAR (hide on login, teacher, and admin pages) */}
            {location.pathname !== "/" &&
             location.pathname !== "/teacher-login" &&
             location.pathname !== "/register" &&
             location.pathname !== "/forgot-password" &&
             location.pathname !== "/teacher-forgot-password" &&
             location.pathname !== "/teacher-dashboard" &&
             location.pathname !== "/evaluation" &&
             location.pathname !== "/admin" && (
                <Navbar />
            )}

            <Routes>

                {/* AUTH */}
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/teacher-login" element={<TeacherLogin />} />
                <Route path="/teacher-forgot-password" element={<TeacherForgotPassword />} />
                <Route path="/teacher-register" element={<TeacherRegister />} />

                {/* STUDENT */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute allowedRole="student">
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />
                <Route path="/submit" element={<SubmissionPage />} />
                <Route path="/history" element={<HistoryPage />} />
                <Route path="/portfolio" element={<PortfolioPage />} />
                <Route path="/preview" element={<PreviewPage />} />
                

                {/* TEACHER */}
                <Route
                    path="/teacher-dashboard"
                    element={
                        <ProtectedRoute allowedRole="teacher">
                            <TeacherDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/evaluation"
                    element={
                        <ProtectedRoute allowedRole="teacher">
                            <Evaluation />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/teacher-evaluation"
                    element={
                        <ProtectedRoute allowedRole="teacher">
                            <Evaluation />
                        </ProtectedRoute>
                    }
                />

                {/* ADMIN */}
                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute allowedRole="admin">
                            <AdminPage />
                        </ProtectedRoute>
                    }
                />

            </Routes>
        </>
    );
}

export default function App() {
    return (
        <BrowserRouter>
            <Layout />
        </BrowserRouter>
    );
}