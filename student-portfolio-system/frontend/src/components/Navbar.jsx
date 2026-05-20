import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {

    const navigate = useNavigate();
    const role = localStorage.getItem("role");

    const handleLogout = () => {
        localStorage.clear();
        navigate("/");
    };

    return (
        <nav className="navbar navbar-dark bg-dark navbar-expand-lg shadow-sm">

            <div className="container">

                {/* BRAND */}
                <Link className="navbar-brand fw-bold" to="/">
                    Student Task Repo
                </Link>

                <ul className="navbar-nav ms-auto">

                    {/* ================= STUDENT ================= */}
                    {role === "student" && (
                        <>
                            <li className="nav-item">
                                <Link className="nav-link" to="/dashboard">
                                    Dashboard
                                </Link>
                            </li>

                            <li className="nav-item">
                                <Link className="nav-link" to="/submit">
                                    Submit Assignment
                                </Link>
                            </li>

                            <li className="nav-item">
                                <Link className="nav-link" to="/history">
                                    History
                                </Link>
                            </li>

                            <li className="nav-item">
                                <Link className="nav-link" to="/portfolio">
                                    Portfolio Wizard
                                </Link>
                            </li>

                            {/* ✅ FIXED: Preview Page */}
                            <li className="nav-item">
                                <Link className="nav-link" to="/preview">
                                    Portfolio Preview
                                </Link>
                            </li>
                        </>
                    )}

                    {/* ================= TEACHER ================= */}
                    {role === "teacher" && (
                        <>
                            <li className="nav-item">
                                <Link className="nav-link" to="/teacher-dashboard">
                                    Teacher Dashboard
                                </Link>
                            </li>

                            <li className="nav-item">
                                <Link className="nav-link" to="/teacher-create">
                                    Create Assignment
                                </Link>
                            </li>

                            <li className="nav-item">
                                <Link className="nav-link" to="/teacher-evaluation">
                                    Evaluation Panel
                                </Link>
                            </li>

                            <li className="nav-item">
                                <Link className="nav-link" to="/teacher-submissions">
                                    All Submissions
                                </Link>
                            </li>

                            <li className="nav-item">
                                <Link className="nav-link" to="/preview">
                                    Preview View
                                </Link>
                            </li>
                        </>
                    )}

                    {/* ================= ADMIN ================= */}
                    {role === "admin" && (
                        <>
                            <li className="nav-item">
                                <Link className="nav-link" to="/admin">
                                    Admin Dashboard
                                </Link>
                            </li>

                            <li className="nav-item">
                                <Link className="nav-link" to="/admin-analytics">
                                    Analytics
                                </Link>
                            </li>

                            <li className="nav-item">
                                <Link className="nav-link" to="/preview">
                                    Portfolio Preview
                                </Link>
                            </li>
                        </>
                    )}

                    {/* ================= LOGOUT ================= */}
                    <li className="nav-item ms-3">
                        <button
                            className="btn btn-danger btn-sm"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </li>

                </ul>

            </div>
        </nav>
    );
}