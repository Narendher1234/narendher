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
            {/* NAVBAR (hide on login pages) */}
            {location.pathname !== "/" &&
             location.pathname !== "/teacher-login" && (
                <Navbar />
            )}

            <Routes>

                {/* AUTH */}
                <Route path="/" element={<Login />} />
                <Route path="/teacher-login" element={<TeacherLogin />} />

                {/* STUDENT */}
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/submit" element={<SubmissionPage />} />
                <Route path="/history" element={<HistoryPage />} />
                <Route path="/portfolio" element={<PortfolioPage />} />
                <Route path="/preview" element={<PreviewPage />} />
                

                {/* TEACHER */}
                <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
             <Route path="/evaluation" element={<Evaluation />} />  

                {/* ADMIN */}
                <Route path="/admin" element={<AdminPage />} />
                <Route
    path="/admin"
    element={
        <ProtectedRoute allowedRole="admin">
            <AdminPage />
        </ProtectedRoute>
    }
/>

<Route
    path="/dashboard"
    element={
        <ProtectedRoute allowedRole="student">
            <Dashboard />
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