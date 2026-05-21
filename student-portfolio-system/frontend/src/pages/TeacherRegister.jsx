import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

export default function TeacherRegister() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const handleTeacherRegister = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        if (!username || !password || !confirmPassword) {
            setError("All fields are required.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);

        try {
            const res = await axios.post(
                "http://127.0.0.1:8000/api/teacher-register/",
                {
                    username,
                    password,
                    password_confirm: confirmPassword
                }
            );

            setMessage(res.data.message || "Teacher registered successfully.");
            setUsername("");
            setPassword("");
            setConfirmPassword("");
            setTimeout(() => navigate("/teacher-login"), 1500);
        } catch (err) {
            setError(err.response?.data?.error || "Teacher registration failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.page}>
            <div style={styles.glowCircle1}></div>
            <div style={styles.glowCircle2}></div>
            <div style={styles.card}>
                <div style={styles.cardHeader}>
                    <div style={styles.badge}>New Teacher</div>
                    <h2 style={styles.title}>Create teacher account</h2>
                    <p style={styles.description}>Add a new teacher so they can sign in and manage classroom tasks.</p>
                </div>

                {error && <div style={styles.error}>{error}</div>}
                {message && <div style={styles.success}>{message}</div>}

                <form onSubmit={handleTeacherRegister} style={styles.form}>
                    <label style={styles.label}>Username</label>
                    <input
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        style={styles.input}
                        placeholder="Teacher username"
                        required
                    />

                    <label style={styles.label}>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={styles.input}
                        placeholder="Password"
                        required
                    />

                    <label style={styles.label}>Confirm Password</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        style={styles.input}
                        placeholder="Confirm password"
                        required
                    />

                    <button type="submit" style={styles.button} disabled={loading}>
                        {loading ? "Creating teacher..." : "Create Teacher"}
                    </button>
                </form>

                <div style={styles.linkRow}>
                    <Link to="/teacher-login" style={styles.linkButton}>
                        Back to Teacher Login
                    </Link>
                </div>
            </div>
        </div>
    );
}

const styles = {
    page: {
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #0f172a, #1d4ed8)",
        position: "relative",
        padding: "24px",
        fontFamily: "Inter, system-ui, sans-serif"
    },
    glowCircle1: {
        position: "absolute",
        width: "280px",
        height: "280px",
        borderRadius: "50%",
        background: "rgba(59,130,246,0.22)",
        top: "-80px",
        left: "-50px",
        filter: "blur(70px)",
        zIndex: 0
    },
    glowCircle2: {
        position: "absolute",
        width: "260px",
        height: "260px",
        borderRadius: "50%",
        background: "rgba(139,92,246,0.24)",
        bottom: "-90px",
        right: "-40px",
        filter: "blur(60px)",
        zIndex: 0
    },
    card: {
        position: "relative",
        zIndex: 1,
        width: "100%",
        maxWidth: "450px",
        background: "rgba(255,255,255,0.96)",
        borderRadius: "28px",
        padding: "36px",
        boxShadow: "0 30px 80px rgba(15,23,42,0.18)"
    },
    cardHeader: {
        marginBottom: "24px"
    },
    badge: {
        display: "inline-block",
        padding: "8px 14px",
        borderRadius: "999px",
        background: "#2563eb",
        color: "white",
        fontSize: "13px",
        fontWeight: "700",
        marginBottom: "14px"
    },
    title: {
        fontSize: "30px",
        fontWeight: "800",
        marginBottom: "10px"
    },
    description: {
        color: "#475569",
        lineHeight: "1.8"
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
        background: "#f8fafc",
        outline: "none"
    },
    button: {
        width: "100%",
        padding: "14px",
        borderRadius: "14px",
        border: "none",
        background: "linear-gradient(135deg, #2563eb, #8b5cf6)",
        color: "white",
        fontWeight: "700",
        cursor: "pointer",
        boxShadow: "0 14px 32px rgba(37,99,235,0.22)"
    },
    linkButton: {
        marginTop: "20px",
        width: "100%",
        padding: "12px 14px",
        border: "1px solid rgba(37,99,235,0.22)",
        borderRadius: "14px",
        background: "white",
        color: "#2563eb",
        cursor: "pointer",
        fontWeight: "700"
    },
    error: {
        padding: "14px 16px",
        borderRadius: "14px",
        background: "#fee2e2",
        color: "#b91c1c",
        marginBottom: "14px"
    },
    success: {
        padding: "14px 16px",
        borderRadius: "14px",
        background: "#dcfce7",
        color: "#166534",
        marginBottom: "14px"
    }
};
