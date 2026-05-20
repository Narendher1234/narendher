import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRole }) {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

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