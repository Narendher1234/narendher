import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

export default function ForgotPassword() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleReset = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        if (!username || !email || !password || !confirmPassword) {
            setError("All fields are required.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords must match.");
            return;
        }

        setLoading(true);

        try {
            const res = await axios.post(
                "/api/password-reset/student/",
                {
                    username,
                    email,
                    password,
                    password_confirm: confirmPassword
                }
            );
            setMessage(res.data.message || "Password updated successfully.");
            setUsername("");
            setEmail("");
            setPassword("");
            setConfirmPassword("");
        } catch (err) {
            setError(err.response?.data?.error || "Unable to reset password.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.page}>
            <div style={styles.glowCircle1}></div>
            <div style={styles.glowCircle2}></div>
            <div style={styles.card}>
                <h2 style={styles.title}>Reset Your Password</h2>
                <p style={styles.subtitle}>Enter your details to update your student password securely.</p>

                {error && <div style={styles.error}>{error}</div>}
                {message && <div style={styles.success}>{message}</div>}

                <form style={styles.form} onSubmit={handleReset}>
                    <label style={styles.label}>Username</label>
                    <input
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        style={styles.input}
                        placeholder="Your username"
                        required
                    />

                    <label style={styles.label}>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={styles.input}
                        placeholder="Your email"
                        required
                    />

                    <label style={styles.label}>New Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={styles.input}
                        placeholder="New password"
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
                        {loading ? "Resetting..." : "Reset Password"}
                    </button>
                </form>

                <div style={styles.linkRow}>
                    <Link to="/" style={styles.linkStyle}>Back to Login</Link>
                </div>
            </div>
        </div>
    );
}

const styles = {
    page: {
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #0f172a, #2563eb)",
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
        top: "-90px",
        left: "-70px",
        filter: "blur(70px)",
        zIndex: 0
    },
    glowCircle2: {
        position: "absolute",
        width: "240px",
        height: "240px",
        borderRadius: "50%",
        background: "rgba(139,92,246,0.22)",
        bottom: "-90px",
        right: "-50px",
        filter: "blur(60px)",
        zIndex: 0
    },
    card: {
        position: "relative",
        zIndex: 1,
        width: "100%",
        maxWidth: "460px",
        background: "rgba(255,255,255,0.96)",
        borderRadius: "28px",
        padding: "36px",
        boxShadow: "0 30px 80px rgba(15,23,42,0.16)"
    },
    title: {
        marginBottom: "10px",
        fontSize: "30px",
        color: "#111827"
    },
    subtitle: {
        marginBottom: "24px",
        color: "#475569"
    },
    form: {
        display: "grid",
        gap: "16px"
    },
    label: {
        color: "#334155",
        fontWeight: "600"
    },
    input: {
        width: "100%",
        padding: "14px 16px",
        borderRadius: "14px",
        border: "1px solid #cbd5e1",
        background: "#f8fafc",
        outline: "none"
    },
    button: {
        width: "100%",
        padding: "14px",
        borderRadius: "14px",
        border: "none",
        background: "linear-gradient(135deg, #2563eb, #7c3aed)",
        color: "white",
        fontWeight: "700",
        cursor: "pointer"
    },
    error: {
        marginBottom: "16px",
        padding: "12px",
        borderRadius: "12px",
        background: "#fee2e2",
        color: "#b91c1c"
    },
    success: {
        marginBottom: "16px",
        padding: "12px",
        borderRadius: "12px",
        background: "#dcfce7",
        color: "#166534"
    },
    linkRow: {
        marginTop: "22px",
        textAlign: "center"
    },
    linkStyle: {
        color: "#2563eb",
        textDecoration: "none",
        fontWeight: "700"
    }
};
