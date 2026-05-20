import { Link } from "react-router-dom"

export default function Navbar() {

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

                        <li className="nav-item">
                            <Link className="nav-link" to="/">
                                Home
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
                            <Link className="nav-link" to="/evaluation">
                                Evaluation
                            </Link>
                        </li>

                        <li className="nav-item">
                            <Link className="nav-link" to="/portfolio">
                                Portfolio
                            </Link>
                        </li>

                        <li className="nav-item">
                            <Link className="nav-link" to="/admin">
                                Admin
                            </Link>
                        </li>

                    </ul>

                </div>

            </div>

        </nav>

    )
}