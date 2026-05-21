import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRole }) {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const teacherData = localStorage.getItem("teacher");

    if (allowedRole === "teacher") {
        if (role !== "teacher" || !teacherData) {
            return <Navigate to="/teacher-login" replace />;
        }
        return children;
    }

    // ❌ NOT LOGGED IN
    if (!token) {
        return <Navigate to="/" replace />;
    }

    // ❌ WRONG ROLE
    if (allowedRole && role !== allowedRole) {
        return <Navigate to="/" replace />;
    }

    return children;
}