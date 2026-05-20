import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function HistoryPage() {

    const navigate = useNavigate();

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const user = localStorage.getItem("user");

    const fetchData = async () => {
        try {
            const res = await axios.get("http://127.0.0.1:8000/api/submissions/");
            setData(res.data);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const getBadge = (status) => {
        if (status === "Submitted") return styles.badgeWarning;
        if (status === "Evaluated") return styles.badgeSuccess;
        return styles.badgeGray;
    };

    return (
        <div style={styles.page}>

            {/* HEADER */}
            <div style={styles.header}>
                <div>
                    <h1 style={styles.title}>📜 Submission History</h1>
                    <p style={styles.subtitle}>
                        Logged User: <b>{user}</b>
                    </p>
                </div>

                <button onClick={() => navigate("/dashboard")} style={styles.backBtn}>
                    ⬅ Back
                </button>
            </div>

            {/* LOADING */}
            {loading && <div style={styles.loading}>Loading...</div>}

            {/* EMPTY */}
            {!loading && data.length === 0 && (
                <div style={styles.empty}>No submissions found</div>
            )}

            {/* TABLE */}
            {!loading && data.length > 0 && (
                <div style={styles.tableWrapper}>

                    <div style={styles.tableHeader}>
                        <div>Title</div>
                        <div>Tags</div>
                        <div>Status</div>
                        <div>Marks</div>
                        <div>Feedback</div>
                        <div>File</div>
                        <div>Date</div>
                    </div>

                    {data.map((item) => (
                        <div key={item.id} style={styles.row}>

                            <div style={styles.titleCell}>
                                {item.title}
                            </div>

                            <div>{item.tags}</div>

                            <div>
                                <span style={getBadge(item.status)}>
                                    {item.status}
                                </span>
                            </div>

                            <div>
                                {item.marks ?? "N/A"}
                            </div>

                            <div style={styles.feedback}>
                                {item.feedback ?? "No Feedback"}
                            </div>

                            <div>
                                {item.file ? (
                                    <a
                                        href={item.file}
                                        target="_blank"
                                        rel="noreferrer"
                                        style={styles.fileBtn}
                                    >
                                        View
                                    </a>
                                ) : (
                                    <span style={styles.muted}>No File</span>
                                )}
                            </div>

                            <div>
                                {item.created_at
                                    ? new Date(item.created_at).toLocaleDateString()
                                    : "N/A"}
                            </div>

                        </div>
                    ))}

                </div>
            )}

        </div>
    );
}

/* ================= STYLES ================= */

const styles = {

    page: {
        minHeight: "100vh",
        padding: "25px",
        background: "linear-gradient(135deg,#eef2ff,#f8fafc)"
    },

    header: {
        background: "linear-gradient(90deg,#1e3a8a,#2563eb)",
        color: "white",
        padding: "25px",
        borderRadius: "18px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "25px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.2)"
    },

    title: { margin: 0, fontSize: "28px" },
    subtitle: { margin: 0, opacity: 0.9 },

    backBtn: {
        padding: "10px 18px",
        border: "none",
        borderRadius: "10px",
        background: "white",
        color: "#1e3a8a",
        fontWeight: "bold",
        cursor: "pointer"
    },

    loading: {
        padding: "20px",
        background: "#dbeafe",
        borderRadius: "12px",
        fontWeight: "bold"
    },

    empty: {
        padding: "20px",
        background: "#fee2e2",
        borderRadius: "12px",
        fontWeight: "bold"
    },

    tableWrapper: {
        background: "white",
        borderRadius: "15px",
        overflow: "hidden",
        boxShadow: "0 5px 15px rgba(0,0,0,0.1)"
    },

    tableHeader: {
        display: "grid",
        gridTemplateColumns: "2fr 1fr 1fr 1fr 2fr 1fr 1fr",
        background: "#1e3a8a",
        color: "white",
        padding: "12px",
        fontWeight: "bold"
    },

    row: {
        display: "grid",
        gridTemplateColumns: "2fr 1fr 1fr 1fr 2fr 1fr 1fr",
        padding: "12px",
        borderBottom: "1px solid #eee",
        alignItems: "center",
        transition: "0.2s"
    },

    titleCell: {
        fontWeight: "bold",
        color: "#1e3a8a"
    },

    feedback: {
        fontSize: "13px",
        color: "#444"
    },

    fileBtn: {
        padding: "6px 10px",
        background: "#2563eb",
        color: "white",
        borderRadius: "8px",
        textDecoration: "none",
        fontSize: "12px"
    },

    muted: {
        color: "#888",
        fontSize: "12px"
    },

    badgeWarning: {
        background: "#f59e0b",
        color: "white",
        padding: "4px 10px",
        borderRadius: "20px",
        fontSize: "12px"
    },

    badgeSuccess: {
        background: "#22c55e",
        color: "white",
        padding: "4px 10px",
        borderRadius: "20px",
        fontSize: "12px"
    },

    badgeGray: {
        background: "#6b7280",
        color: "white",
        padding: "4px 10px",
        borderRadius: "20px",
        fontSize: "12px"
    }
};