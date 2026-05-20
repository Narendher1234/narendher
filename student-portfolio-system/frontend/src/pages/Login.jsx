import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Login() {

    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("student");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // ================= LOGIN =================
    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await axios.post(
                "http://127.0.0.1:8000/api/token/",
                { username, password }
            );

            localStorage.setItem("token", res.data.access);
            localStorage.setItem("refresh", res.data.refresh);
            localStorage.setItem("username", username);
            localStorage.setItem("role", role);

            // ROLE BASED ROUTING
            if (role === "student") navigate("/dashboard");
            if (role === "teacher") navigate("/teacher-dashboard");
            if (role === "admin") navigate("/admin");

        } catch (err) {
            setError("Invalid username or password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.page}>

            <div style={styles.card}>

                {/* LEFT INFO */}
                <div style={styles.left}>
                    <h1>🎓 EduSphere</h1>
                    <p>Smart Student Portfolio System</p>
                    <img
                        src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                        style={{ width: "180px" }}
                    />
                </div>

                {/* RIGHT LOGIN */}
                <div style={styles.right}>

                    <h2>Login</h2>
                    <p>Select your role to continue</p>

                    {/* ROLE SWITCH TABS */}
                    <div style={styles.roleBox}>

                        {["student", "teacher", "admin"].map((r) => (
                            <button
                                key={r}
                                type="button"
                                onClick={() => setRole(r)}
                                style={{
                                    ...styles.roleBtn,
                                    background: role === r ? "#2563eb" : "#e5e7eb",
                                    color: role === r ? "white" : "black"
                                }}
                            >
                                {r.toUpperCase()}
                            </button>
                        ))}

                    </div>

                    {/* ERROR */}
                    {error && <div style={styles.error}>{error}</div>}

                    {/* FORM */}
                    <form onSubmit={handleLogin}>

                        <input
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            style={styles.input}
                            required
                        />

                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={styles.input}
                            required
                        />

                        <button
                            type="submit"
                            disabled={loading}
                            style={styles.button}
                        >
                            {loading ? "Logging in..." : `Login as ${role}`}
                        </button>

                    </form>

                </div>

            </div>

        </div>
    );
}

/* ================= STYLES ================= */

const styles = {

    page: {
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg,#4f46e5,#2563eb,#7c3aed)"
    },

    card: {
        display: "flex",
        width: "900px",
        background: "white",
        borderRadius: "20px",
        overflow: "hidden",
        boxShadow: "0 20px 50px rgba(0,0,0,0.3)"
    },

    left: {
        flex: 1,
        background: "linear-gradient(135deg,#1e3a8a,#4338ca)",
        color: "white",
        padding: "40px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center"
    },

    right: {
        flex: 1,
        padding: "40px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center"
    },

    roleBox: {
        display: "flex",
        gap: "10px",
        marginBottom: "15px"
    },

    roleBtn: {
        flex: 1,
        padding: "8px",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "bold"
    },

    input: {
        width: "100%",
        padding: "12px",
        marginBottom: "12px",
        borderRadius: "10px",
        border: "1px solid #ccc",
        outline: "none"
    },

    button: {
        width: "100%",
        padding: "12px",
        border: "none",
        borderRadius: "10px",
        background: "linear-gradient(135deg,#2563eb,#7c3aed)",
        color: "white",
        fontWeight: "bold",
        cursor: "pointer"
    },

    error: {
        background: "#fee2e2",
        color: "#b91c1c",
        padding: "10px",
        borderRadius: "8px",
        marginBottom: "10px"
    }
};