import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function TeacherLogin() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        const teacher = localStorage.getItem("teacher");
        if (teacher) navigate("/teacher-dashboard");
    }, [navigate]);

    const login = async (e) => {
        e.preventDefault();
        setError("");

        if (!username || !password) {
            setError("Please enter your username and password.");
            return;
        }

        setLoading(true);

        try {
            const res = await axios.post(
                "http://127.0.0.1:8000/api/teacher-login/",
                { username, password }
            );

            localStorage.setItem("teacher", JSON.stringify(res.data));
            localStorage.setItem("role", "teacher");
            navigate("/teacher-dashboard");
        } catch (err) {
            setError(err.response?.data?.error || "Login failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.page}>
            <div style={styles.backgroundCircle1}></div>
            <div style={styles.backgroundCircle2}></div>
            <div style={styles.backgroundCircle3}></div>

            <motion.div
                style={styles.card}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.45 }}
            >
                <div style={styles.header}>
                    <h1 style={styles.headerTitle}>Teacher Login</h1>
                    <p style={styles.headerSubtitle}>Sign in to manage your classes and evaluate students.</p>
                </div>

                {error && <div style={styles.error}>{error}</div>}

                <form style={styles.form} onSubmit={login}>
                    <label style={styles.label}>Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        style={styles.input}
                        placeholder="Enter teacher username"
                        required
                    />

                    <label style={styles.label}>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={styles.input}
                        placeholder="Enter password"
                        required
                    />

                    <button type="submit" style={styles.button} disabled={loading}>
                        {loading ? "Signing in..." : "Login"}
                    </button>
                </form>

                <div style={styles.footerRow}>
                    <Link to="/teacher-forgot-password" style={styles.linkStyle}>
                        Forgot password?
                    </Link>
                </div>
                <div style={styles.footerRow}>
                    <span style={styles.promptText}>New teacher?</span>
                    <Link to="/teacher-register" style={styles.linkStyle}>
                        Create an account
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}

const styles = {
    page: {
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #1e3a8a, #2563eb)",
        position: "relative",
        padding: "24px",
        fontFamily: "Inter, system-ui, sans-serif"
    },
    backgroundCircle1: {
        position: "absolute",
        width: "320px",
        height: "320px",
        borderRadius: "50%",
        background: "rgba(59,130,246,0.35)",
        top: "-80px",
        left: "-80px",
        filter: "blur(60px)",
        zIndex: 0
    },
    backgroundCircle2: {
        position: "absolute",
        width: "260px",
        height: "260px",
        borderRadius: "50%",
        background: "rgba(139,92,246,0.3)",
        bottom: "-80px",
        right: "-60px",
        filter: "blur(50px)",
        zIndex: 0
    },
    backgroundCircle3: {
        position: "absolute",
        width: "180px",
        height: "180px",
        borderRadius: "50%",
        background: "rgba(34,197,94,0.22)",
        top: "40%",
        right: "20%",
        filter: "blur(40px)",
        zIndex: 0
    },
    card: {
        position: "relative",
        zIndex: 1,
        width: "100%",
        maxWidth: "520px",
        background: "rgba(255,255,255,0.95)",
        borderRadius: "28px",
        padding: "40px",
        boxShadow: "0 32px 90px rgba(15,23,42,0.16)",
        color: "#0f172a"
    },
    header: {
        marginBottom: "26px"
    },
    headerTitle: {
        fontSize: "32px",
        marginBottom: "8px"
    },
    headerSubtitle: {
        color: "#475569",
        lineHeight: "1.6"
    },
    form: {
        display: "grid",
        gap: "18px"
    },
    label: {
        fontWeight: "700",
        color: "#0f172a"
    },
    input: {
        width: "100%",
        padding: "14px 16px",
        borderRadius: "14px",
        border: "1px solid #cbd5e1",
        fontSize: "15px",
        outline: "none",
        background: "#f8fafc"
    },
    button: {
        width: "100%",
        padding: "14px",
        borderRadius: "14px",
        border: "none",
        background: "linear-gradient(135deg, #2563eb, #7c3aed)",
        color: "white",
        fontWeight: "700",
        cursor: "pointer",
        boxShadow: "0 14px 28px rgba(37,99,235,0.2)"
    },
    footerRow: {
        marginTop: "18px",
        textAlign: "center"
    },
    linkStyle: {
        color: "#2563eb",
        textDecoration: "none",
        fontWeight: "700"
    },
    promptText: {
        color: "#64748b",
        marginRight: "8px"
    },
    error: {
        padding: "14px 16px",
        borderRadius: "14px",
        background: "#fee2e2",
        color: "#b91c1c",
        marginBottom: "10px"
    }
};