import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Login() {

    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("student");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // ================= LOGIN FUNCTION =================

    const handleLogin = async (e) => {

        e.preventDefault();

        setLoading(true);
        setError("");

        try {

            // ================= TEACHER LOGIN =================

            if (role === "teacher") {

                const res = await axios.post(
                    "/api/teacher-login/",
                    {
                        username,
                        password
                    }
                );

                console.log(res.data);

                localStorage.setItem(
                    "teacher",
                    JSON.stringify(res.data)
                );

                localStorage.setItem("role", "teacher");

                navigate("/teacher-dashboard");

                return;
            }

            // ================= STUDENT + ADMIN LOGIN =================

            const res = await axios.post(
                "/api/token/",
                {
                    username,
                    password
                }
            );

            console.log(res.data);

            localStorage.setItem("token", res.data.access);
            localStorage.setItem("refresh", res.data.refresh);
            localStorage.setItem("username", username);
            localStorage.setItem("role", res.data.role);

            // ================= ROUTING =================

            if (res.data.role === "student") {
                navigate("/dashboard");
            }

            if (res.data.role === "admin") {
                navigate("/admin");
            }

        }
        catch (err) {

            console.log(err);

            setError(
                err.response?.data?.detail ||
                err.response?.data?.error ||
                "Invalid Username or Password"
            );
        }
        finally {
            setLoading(false);
        }
    };

    return (

        <div style={styles.page}>

            {/* BACKGROUND EFFECTS */}

            <div style={styles.circle1}></div>
            <div style={styles.circle2}></div>
            <div style={styles.circle3}></div>

            {/* MAIN CARD */}

            <div style={styles.card}>

                {/* LEFT SECTION */}

                <div style={styles.left}>

                    <div style={styles.logoBox}>
                        🎓
                    </div>

                    <h1 style={styles.title}>
                        EduSphere
                    </h1>

                    <p style={styles.tagline}>
                        Smart Student Portfolio & Evaluation Platform
                    </p>

                    <div style={styles.featureBox}>

                        <div style={styles.feature}>
                            📚 Assignment Submission
                        </div>

                        <div style={styles.feature}>
                            👨‍🏫 Teacher Evaluation
                        </div>

                        <div style={styles.feature}>
                            📊 Admin Dashboard
                        </div>

                        <div style={styles.feature}>
                            🧠 AI Portfolio Generator
                        </div>

                    </div>

                    <img
                        src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                        alt="student"
                        style={styles.image}
                    />

                </div>

                {/* RIGHT SECTION */}

                <div style={styles.right}>

                    <div style={styles.loginCard}>

                        <h2 style={styles.loginTitle}>
                            Welcome Back 👋
                        </h2>

                        <p style={styles.subText}>
                            Login to continue
                        </p>

                        {/* ROLE BUTTONS */}

                        <div style={styles.roleBox}>

                            {["student", "teacher", "admin"].map((r) => (

                                <button
                                    key={r}
                                    type="button"
                                    onClick={() => setRole(r)}
                                    style={{
                                        ...styles.roleBtn,
                                        background:
                                            role === r
                                                ? "linear-gradient(135deg,#2563eb,#7c3aed)"
                                                : "#f1f5f9",
                                        color:
                                            role === r
                                                ? "white"
                                                : "#111827",
                                        transform:
                                            role === r
                                                ? "scale(1.05)"
                                                : "scale(1)"
                                    }}
                                >

                                    {
                                        r === "student"
                                            ? "🎓 Student"
                                            : r === "teacher"
                                                ? "👨‍🏫 Teacher"
                                                : "🛡️ Admin"
                                    }

                                </button>

                            ))}

                        </div>

                        {/* ERROR */}

                        {
                            error &&
                            <div style={styles.error}>
                                {error}
                            </div>
                        }

                        {/* FORM */}

                        <form onSubmit={handleLogin}>

                            <div style={styles.inputGroup}>

                                <label style={styles.label}>
                                    Username
                                </label>

                                <input
                                    type="text"
                                    placeholder="Enter username"
                                    value={username}
                                    onChange={(e) =>
                                        setUsername(e.target.value)
                                    }
                                    style={styles.input}
                                    required
                                />

                            </div>

                            <div style={styles.inputGroup}>

                                <label style={styles.label}>
                                    Password
                                </label>

                                <input
                                    type="password"
                                    placeholder="Enter password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    style={styles.input}
                                    required
                                />

                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                style={styles.button}
                            >

                                {
                                    loading
                                        ? "Logging In..."
                                        : `Login as ${role}`
                                }

                            </button>

                        </form>

                        {/* FOOTER */}

                        <div style={styles.footer}>

                            <p>
                                <Link
                                    to="/forgot-password"
                                    style={styles.link}
                                >
                                    Forgot Password?
                                </Link>
                            </p>

                            <p style={{ marginTop: "10px" }}>
                                New Student?
                                <Link
                                    to="/register"
                                    style={styles.link}
                                >
                                    Register
                                </Link>
                            </p>

                            <small>
                                © 2026 EduSphere
                            </small>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

}

/* ================= STYLES ================= */

const styles = {

    page: {
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg,#dbeafe,#eef2ff,#f8fafc)",
        position: "relative",
        overflow: "hidden",
        fontFamily: "Arial"
    },

    circle1: {
        position: "absolute",
        width: "300px",
        height: "300px",
        background: "#60a5fa",
        borderRadius: "50%",
        top: "-100px",
        left: "-100px",
        opacity: 0.3,
        filter: "blur(70px)"
    },

    circle2: {
        position: "absolute",
        width: "350px",
        height: "350px",
        background: "#a78bfa",
        borderRadius: "50%",
        bottom: "-120px",
        right: "-120px",
        opacity: 0.3,
        filter: "blur(70px)"
    },

    circle3: {
        position: "absolute",
        width: "220px",
        height: "220px",
        background: "#34d399",
        borderRadius: "50%",
        top: "40%",
        left: "45%",
        opacity: 0.2,
        filter: "blur(60px)"
    },

    card: {
        width: "1000px",
        maxWidth: "95%",
        background: "white",
        borderRadius: "30px",
        overflow: "hidden",
        display: "flex",
        boxShadow: "0 25px 70px rgba(0,0,0,0.15)",
        zIndex: 2
    },

    left: {
        flex: 1,
        background: "linear-gradient(135deg,#2563eb,#7c3aed)",
        color: "white",
        padding: "50px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center"
    },

    logoBox: {
        width: "90px",
        height: "90px",
        borderRadius: "20px",
        background: "rgba(255,255,255,0.2)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "40px",
        marginBottom: "20px"
    },

    title: {
        fontSize: "42px",
        fontWeight: "bold"
    },

    tagline: {
        marginTop: "10px",
        fontSize: "17px",
        lineHeight: "28px"
    },

    featureBox: {
        marginTop: "30px",
        width: "100%"
    },

    feature: {
        background: "rgba(255,255,255,0.15)",
        padding: "14px",
        borderRadius: "14px",
        marginBottom: "12px",
        fontSize: "15px"
    },

    image: {
        width: "220px",
        marginTop: "30px"
    },

    right: {
        flex: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f8fafc"
    },

    loginCard: {
        width: "90%",
        maxWidth: "430px",
        background: "white",
        padding: "40px",
        borderRadius: "25px",
        boxShadow: "0 15px 40px rgba(0,0,0,0.08)"
    },

    loginTitle: {
        fontSize: "32px",
        fontWeight: "bold",
        color: "#111827"
    },

    subText: {
        color: "#64748b",
        marginTop: "10px",
        marginBottom: "25px"
    },

    roleBox: {
        display: "flex",
        gap: "10px",
        marginBottom: "20px"
    },

    roleBtn: {
        flex: 1,
        padding: "12px",
        border: "none",
        borderRadius: "12px",
        cursor: "pointer",
        fontWeight: "bold",
        transition: "0.3s"
    },

    inputGroup: {
        marginBottom: "18px"
    },

    label: {
        display: "block",
        marginBottom: "8px",
        fontWeight: "600",
        color: "#111827"
    },

    input: {
        width: "100%",
        padding: "14px",
        borderRadius: "12px",
        border: "1px solid #cbd5e1",
        outline: "none",
        background: "#f8fafc",
        fontSize: "15px"
    },

    button: {
        width: "100%",
        padding: "15px",
        border: "none",
        borderRadius: "14px",
        background: "linear-gradient(135deg,#2563eb,#7c3aed)",
        color: "white",
        fontWeight: "bold",
        fontSize: "16px",
        cursor: "pointer",
        marginTop: "10px",
        boxShadow: "0 15px 30px rgba(37,99,235,0.2)"
    },

    error: {
        background: "#fee2e2",
        color: "#dc2626",
        padding: "12px",
        borderRadius: "10px",
        marginBottom: "15px",
        fontWeight: "bold"
    },

    footer: {
        marginTop: "25px",
        textAlign: "center",
        color: "#64748b"
    },

    link: {
        color: "#2563eb",
        textDecoration: "none",
        fontWeight: "bold",
        marginLeft: "5px"
    }

};