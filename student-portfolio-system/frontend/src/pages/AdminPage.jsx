import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AdminPage() {

    const navigate = useNavigate();

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const [taskType, setTaskType] = useState("");
    const [date, setDate] = useState("");

    useEffect(() => {

        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");

        if (!token) {
            alert("Please Login First");
            navigate("/");
            return;
        }

        if (role !== "admin") {
            alert("Access Denied");
            localStorage.clear();
            navigate("/");
            return;
        }

        fetchData();

    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);

            const token = localStorage.getItem("token");

            const res = await axios.get(
                "http://127.0.0.1:8000/api/submissions/",
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            setData(res.data);

        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    // ================= FILTER (NO SUBJECT) =================
    const filteredData = data.filter((item) => {

        const tagsValue = (item.tags ?? "")
            .toString()
            .toLowerCase();

        const dateValue = (item.created_at ?? "")
            .toString();

        const matchTaskType =
            !taskType ||
            tagsValue.includes(taskType.toLowerCase());

        const matchDate =
            !date ||
            dateValue.includes(date);

        return matchTaskType && matchDate;
    });

    const total = data.length;
    const pending = data.filter(i => i.status !== "Evaluated").length;
    const evaluated = data.filter(i => i.status === "Evaluated").length;

    const handleLogout = () => {
        localStorage.clear();
        navigate("/");
    };

    return (

        <div style={page}>

            {/* HEADER */}
            <div style={header}>
                <div>
                    <h1>📊 Admin Dashboard</h1>
                    <p>Monitor submissions & evaluation status</p>
                </div>

                <button style={logoutBtn} onClick={handleLogout}>
                    Logout
                </button>
            </div>

            {/* STATS */}
            <div style={statsContainer}>

                <div style={{ ...cardStat, borderLeft: "6px solid #3b82f6" }}>
                    <h3>Total</h3>
                    <h1>{total}</h1>
                </div>

                <div style={{ ...cardStat, borderLeft: "6px solid #f59e0b" }}>
                    <h3>Pending</h3>
                    <h1>{pending}</h1>
                </div>

                <div style={{ ...cardStat, borderLeft: "6px solid #22c55e" }}>
                    <h3>Evaluated</h3>
                    <h1>{evaluated}</h1>
                </div>

            </div>

            {/* FILTERS (ONLY TASK TYPE + DATE) */}
            <div style={filterBox}>

                <input
                    placeholder="Task Type (Tags)"
                    style={input}
                    onChange={(e) => setTaskType(e.target.value)}
                />

                <input
                    type="date"
                    style={input}
                    onChange={(e) => setDate(e.target.value)}
                />

            </div>

            {/* TABLE HEADER */}
            <div style={tableHeader}>
                <div>Title</div>
                <div>Tags</div>
                <div>Status</div>
                <div>Date</div>
            </div>

            {/* DATA */}
            {loading ? (

                <div style={loadingBox}>Loading...</div>

            ) : (

                filteredData.map((item) => (

                    <div key={item.id} style={row}>

                        <div style={cellTitle}>{item.title}</div>

                        <div>{item.tags || "N/A"}</div>

                        <div>
                            <span style={{
                                ...badge,
                                background:
                                    item.status === "Evaluated"
                                        ? "#22c55e"
                                        : "#f59e0b"
                            }}>
                                {item.status}
                            </span>
                        </div>

                        <div>
                            {item.created_at
                                ? new Date(item.created_at).toLocaleDateString()
                                : "N/A"}
                        </div>

                    </div>

                ))

            )}

        </div>
    );
}

/* ================= STYLES ================= */

const page = {
    minHeight: "100vh",
    padding: "20px",
    background: "linear-gradient(to right,#eef2ff,#f8fafc)"
};

const header = {
    background: "linear-gradient(to right,#1e3a8a,#2563eb)",
    color: "white",
    padding: "25px",
    borderRadius: "15px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.2)"
};

const logoutBtn = {
    background: "#ef4444",
    border: "none",
    padding: "10px 20px",
    color: "white",
    borderRadius: "10px",
    fontWeight: "bold",
    cursor: "pointer"
};

const statsContainer = {
    display: "flex",
    gap: "15px",
    marginBottom: "20px",
    flexWrap: "wrap"
};

const cardStat = {
    flex: 1,
    minWidth: "200px",
    background: "white",
    padding: "20px",
    borderRadius: "15px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.1)"
};

const filterBox = {
    display: "flex",
    gap: "10px",
    padding: "15px",
    background: "white",
    borderRadius: "12px",
    marginBottom: "20px"
};

const input = {
    flex: 1,
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc"
};

const tableHeader = {
    display: "grid",
    gridTemplateColumns: "2fr 1fr 1fr 1fr",
    background: "#1e3a8a",
    color: "white",
    padding: "12px",
    borderRadius: "10px",
    fontWeight: "bold"
};

const row = {
    display: "grid",
    gridTemplateColumns: "2fr 1fr 1fr 1fr",
    background: "white",
    padding: "12px",
    borderBottom: "1px solid #eee"
};

const cellTitle = {
    fontWeight: "bold",
    color: "#1e3a8a"
};

const badge = {
    padding: "5px 12px",
    borderRadius: "20px",
    color: "white",
    fontSize: "12px"
};

const loadingBox = {
    marginTop: "20px",
    padding: "20px",
    background: "#dbeafe",
    borderRadius: "10px"
};