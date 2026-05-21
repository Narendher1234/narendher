import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Register() {

    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        if (password !== confirmPassword) {
            setError("Passwords must match.");
            return;
        }

        setLoading(true);

        try {
            const res = await axios.post(
                "/api/register/",
                {
                    username,
                    email,
                    password,
                    password_confirm: confirmPassword
                }
            );

            setMessage(res.data.message || "Registration successful. Please login.");
            setTimeout(() => navigate("/"), 1500);
        }
        catch (err) {
            setError(
                err.response?.data?.error ||
                "Registration failed. Please check your details."
            );
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.page}>
            <div style={styles.circle1}></div>
            <div style={styles.circle2}></div>
            <div style={styles.circle3}></div>

            <div style={styles.card}>
                <div style={styles.left}>
                    <div style={styles.logoBox}>🎓</div>
                    <h1 style={styles.title}>EduSphere</h1>
                    <p style={styles.tagline}>
                        Join the smart student portfolio platform.
                    </p>
                    <div style={styles.featureBox}>
                        <div style={styles.featureItem}>📚 Manage assignments</div>
                        <div style={styles.featureItem}>🧠 Build your portfolio</div>
                        <div style={styles.featureItem}>👩‍🏫 Work with teachers</div>
                        <div style={styles.featureItem}>📈 Track your progress</div>
                    </div>
                    <img
                        src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                        alt="student"
                        style={styles.image}
                    />
                </div>

                <div style={styles.right}>
                    <div style={styles.loginCard}>
                        <h2 style={styles.loginTitle}>Create student account</h2>
                        <p style={styles.subText}>
                            Register now and access your dashboard.
                        </p>

                        {error && <div style={styles.error}>{error}</div>}
                        {message && <div style={styles.success}>{message}</div>}

                        <form onSubmit={handleRegister}>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Username</label>
                                <input
                                    type="text"
                                    placeholder="Enter username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    style={styles.input}
                                    required
                                />
                            </div>

                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Email</label>
                                <input
                                    type="email"
                                    placeholder="Enter email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    style={styles.input}
                                    required
                                />
                            </div>

                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Password</label>
                                <input
                                    type="password"
                                    placeholder="Enter password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    style={styles.input}
                                    required
                                />
                            </div>

                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Confirm Password</label>
                                <input
                                    type="password"
                                    placeholder="Confirm password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    style={styles.input}
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                style={styles.button}
                            >
                                {loading ? "Registering..." : "Create Account"}
                            </button>
                        </form>

                        <div style={styles.registerBox}>
                            <p style={styles.registerText}>
                                Already have an account? <Link to="/" style={styles.registerLink}>Login here</Link>
                            </p>
                        </div>
                    </div>
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
        background: "linear-gradient(135deg,#0f172a,#1e3a8a,#2563eb)",
        overflow: "hidden",
        position: "relative",
        fontFamily: "Arial"
    },
    circle1: {
        position: "absolute",
        width: "300px",
        height: "300px",
        background: "#3b82f6",
        borderRadius: "50%",
        top: "-100px",
        left: "-100px",
        opacity: 0.4,
        filter: "blur(70px)"
    },
    circle2: {
        position: "absolute",
        width: "350px",
        height: "350px",
        background: "#8b5cf6",
        borderRadius: "50%",
        bottom: "-120px",
        right: "-100px",
        opacity: 0.4,
        filter: "blur(80px)"
    },
    circle3: {
        position: "absolute",
        width: "200px",
        height: "200px",
        background: "#06b6d4",
        borderRadius: "50%",
        top: "50%",
        left: "45%",
        opacity: 0.2,
        filter: "blur(70px)"
    },
    card: {
        width: "1100px",
        minHeight: "650px",
        background: "rgba(255,255,255,0.1)",
        backdropFilter: "blur(20px)",
        borderRadius: "25px",
        overflow: "hidden",
        display: "flex",
        boxShadow: "0 25px 60px rgba(0,0,0,0.4)",
        zIndex: 10
    },
    left: {
        flex: 1,
        padding: "50px",
        color: "white",
        background: "linear-gradient(135deg,rgba(37,99,235,0.9),rgba(124,58,237,0.9))",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center"
    },
    logoBox: {
        width: "90px",
        height: "90px",
        borderRadius: "50%",
        background: "rgba(255,255,255,0.2)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "40px",
        marginBottom: "20px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
    },
    title: {
        fontSize: "48px",
        fontWeight: "bold",
        marginBottom: "10px"
    },
    tagline: {
        fontSize: "18px",
        opacity: 0.9,
        marginBottom: "30px",
        lineHeight: "30px"
    },
    featureBox: {
        width: "100%",
        maxWidth: "350px",
        background: "rgba(255,255,255,0.15)",
        padding: "20px",
        borderRadius: "15px",
        marginBottom: "30px"
    },
    featureItem: {
        padding: "10px",
        marginBottom: "10px",
        background: "rgba(255,255,255,0.1)",
        borderRadius: "10px",
        fontSize: "15px"
    },
    image: {
        width: "220px",
        marginTop: "20px",
        animation: "float 3s ease-in-out infinite"
    },
    right: {
        flex: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "rgba(255,255,255,0.9)"
    },
    loginCard: {
        width: "85%",
        padding: "40px",
        borderRadius: "20px"
    },
    loginTitle: {
        fontSize: "35px",
        fontWeight: "bold",
        color: "#1e3a8a",
        marginBottom: "10px"
    },
    subText: {
        color: "#64748b",
        marginBottom: "25px"
    },
    inputGroup: {
        marginBottom: "18px"
    },
    label: {
        display: "block",
        marginBottom: "8px",
        fontWeight: "bold",
        color: "#1e293b"
    },
    input: {
        width: "100%",
        padding: "14px",
        borderRadius: "12px",
        border: "1px solid #cbd5e1",
        outline: "none",
        fontSize: "15px",
        transition: "0.3s",
        background: "#f8fafc"
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
        boxShadow: "0 10px 20px rgba(37,99,235,0.3)"
    },
    error: {
        background: "#fee2e2",
        color: "#dc2626",
        padding: "12px",
        borderRadius: "10px",
        marginBottom: "15px",
        fontWeight: "bold"
    },
    success: {
        background: "#d1fae5",
        color: "#065f46",
        padding: "12px",
        borderRadius: "10px",
        marginBottom: "15px",
        fontWeight: "bold"
    },
    registerBox: {
        marginTop: "18px",
        textAlign: "center"
    },
    registerText: {
        color: "#475569",
        fontSize: "14px"
    },
    registerLink: {
        color: "#2563eb",
        textDecoration: "none",
        fontWeight: "700"
    }
};
