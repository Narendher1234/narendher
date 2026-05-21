import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {

    const navigate = useNavigate();
    const role = localStorage.getItem("role");

    const handleLogout = () => {
        localStorage.clear();
        navigate("/");
    };

    return (

        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">

            <div className="container">

                {/* BRAND */}
                <Link className="navbar-brand" to="/">
                    Student Portfolio
                </Link>

                {/* TOGGLE BUTTON */}
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* NAV LINKS */}
                <div className="collapse navbar-collapse" id="navbarNav">

                    <ul className="navbar-nav ms-auto">

                        {role === "student" && (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/dashboard">
                                        Dashboard
                                    </Link>
                                </li>

                                <li className="nav-item">
                                    <Link className="nav-link" to="/submit">
                                        Submission
                                    </Link>
                                </li>

                                <li className="nav-item">
                                    <Link className="nav-link" to="/history">
                                        History
                                    </Link>
                                </li>

                                <li className="nav-item">
                                    <Link className="nav-link" to="/portfolio">
                                        Portfolio
                                    </Link>
                                </li>
                            </>
                        )}

                        {role === "teacher" && (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/teacher-dashboard">
                                        Teacher Dashboard
                                    </Link>
                                </li>

                                <li className="nav-item">
                                    <Link className="nav-link" to="/evaluation">
                                        Evaluation
                                    </Link>
                                </li>

                                <li className="nav-item">
                                    <Link className="nav-link" to="/preview">
                                        Preview View
                                    </Link>
                                </li>
                            </>
                        )}

                        {role === "admin" && (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/admin">
                                        Admin Dashboard
                                    </Link>
                                </li>
                            </>
                        )}

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

            </div>

        </nav>

    );
}