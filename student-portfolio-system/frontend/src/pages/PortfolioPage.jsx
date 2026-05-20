import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function PortfolioPage() {

    const navigate = useNavigate();

    const [submissions, setSubmissions] = useState([]);
    const [selectedWorks, setSelectedWorks] = useState([]);
    const [portfolio, setPortfolio] = useState(null);
    const [loading, setLoading] = useState(true);

    const user = localStorage.getItem("username");

    useEffect(() => {
        fetchSubmissions();
    }, []);

    const fetchSubmissions = async () => {
        try {
            const res = await axios.get("http://127.0.0.1:8000/api/submissions/");
            setSubmissions(res.data);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    // ================= AI SKILL ENGINE =================
    const extractSkillsAI = (items) => {

        const text = items
            .map(i =>
                `${i.title} ${i.tags} ${i.feedback || ""} ${i.description || ""}`
            )
            .join(" ")
            .toLowerCase();

        const skillMap = {
            "react": ["react", "jsx", "hooks"],
            "node": ["node", "express", "backend"],
            "django": ["django", "python", "api"],
            "python": ["python", "ml", "ai", "pandas"],
            "javascript": ["javascript", "js"],
            "html": ["html", "css", "frontend"],
            "css": ["css", "bootstrap", "tailwind"],
            "database": ["sql", "mongodb", "mysql", "db"],
            "api": ["api", "rest", "fetch", "axios"],
            "ai/ml": ["ai", "ml", "model", "training"]
        };

        let skills = [];

        Object.keys(skillMap).forEach(skill => {
            if (skillMap[skill].some(k => text.includes(k))) {
                skills.push(skill);
            }
        });

        // fallback tag extraction
        items.forEach(i => {
            if (i.tags) {
                i.tags.split(",").forEach(t => skills.push(t.trim()));
            }
        });

        // remove duplicates + empty
        return [...new Set(skills.filter(Boolean))];
    };

    const toggleSelect = (item) => {

        const exists = selectedWorks.find((w) => w.id === item.id);

        if (exists) {
            setSelectedWorks(selectedWorks.filter((w) => w.id !== item.id));
        } else {
            setSelectedWorks([...selectedWorks, item]);
        }
    };

    // ================= PORTFOLIO GENERATION =================
    const generatePortfolio = () => {

        if (selectedWorks.length === 0) {
            alert("Select at least one work");
            return;
        }

        const skills = extractSkillsAI(selectedWorks);

        const portfolioData = {
            summary: `AI Generated Portfolio for ${user}`,
            skills,
            projects: selectedWorks
        };

        setPortfolio(portfolioData);
    };

    return (
        <div style={styles.page}>

            {/* HEADER */}
            <div style={styles.header}>
                <div>
                    <h2 style={styles.title}>🤖 AI Portfolio Builder</h2>
                    <p style={styles.sub}>Welcome, <b>{user}</b></p>
                </div>

                <button
                    onClick={() => navigate("/dashboard")}
                    style={styles.backBtn}
                >
                    Back
                </button>
            </div>

            {/* SUBMISSIONS */}
            <div style={styles.card}>

                <h3 style={styles.sectionTitle}>Student Works</h3>

                {loading && <p>Loading...</p>}

                {!loading && submissions.length === 0 && (
                    <div style={styles.alert}>No submissions found</div>
                )}

                {!loading && submissions.length > 0 && (

                    <table style={styles.table}>
                        <thead>
                            <tr style={styles.theadRow}>
                                <th>Select</th>
                                <th>Title</th>
                                <th>Tags</th>
                                <th>Status</th>
                                <th>Marks</th>
                                <th>File</th>
                            </tr>
                        </thead>

                        <tbody>
                            {submissions.map((item) => (
                                <tr key={item.id} style={styles.row}>

                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={selectedWorks.some(w => w.id === item.id)}
                                            onChange={() => toggleSelect(item)}
                                        />
                                    </td>

                                    <td>{item.title}</td>
                                    <td>{item.tags}</td>
                                    <td>{item.status}</td>
                                    <td>{item.marks ?? "Pending"}</td>

                                    <td>
                                        {item.file ? (
                                            <a href={item.file} target="_blank" rel="noreferrer">
                                                View
                                            </a>
                                        ) : "No File"}
                                    </td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                <button onClick={generatePortfolio} style={styles.generateBtn}>
                    Generate AI Portfolio
                </button>

            </div>

            {/* PORTFOLIO */}
            <div style={styles.card}>

                {!portfolio ? (
                    <div style={{ textAlign: "center" }}>
                        <h3>Generated Portfolio</h3>
                        <p>Select works to generate AI portfolio</p>
                    </div>
                ) : (
                    <>
                        <h3 style={{ color: "#2563eb" }}>✨ {portfolio.summary}</h3>

                        <h4>AI Extracted Skills</h4>

                        <div style={styles.skillBox}>
                            {portfolio.skills.map((s, i) => (
                                <span key={i} style={styles.skill}>
                                    {s}
                                </span>
                            ))}
                        </div>

                        <h4>Projects</h4>

                        <table style={styles.table}>
                            <thead>
                                <tr style={styles.theadRow}>
                                    <th>Title</th>
                                    <th>Status</th>
                                    <th>Marks</th>
                                    <th>Feedback</th>
                                </tr>
                            </thead>

                            <tbody>
                                {portfolio.projects.map((p) => (
                                    <tr key={p.id} style={styles.row}>
                                        <td>{p.title}</td>
                                        <td>{p.status}</td>
                                        <td>{p.marks ?? "Pending"}</td>
                                        <td>{p.feedback ?? "No Feedback"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                    </>
                )}

            </div>

        </div>
    );
}

/* ================= STYLES ================= */

const styles = {

    page: {
        minHeight: "100vh",
        background: "linear-gradient(135deg,#eef2ff,#f8fafc)",
        padding: "20px",
        fontFamily: "Arial"
    },

    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: "white",
        padding: "15px",
        borderRadius: "12px",
        marginBottom: "20px",
        boxShadow: "0 10px 20px rgba(0,0,0,0.1)"
    },

    title: { margin: 0, color: "#1e3a8a" },
    sub: { margin: 0, color: "#6b7280" },

    backBtn: {
        background: "#111827",
        color: "white",
        padding: "10px",
        border: "none",
        borderRadius: "8px"
    },

    card: {
        background: "white",
        padding: "20px",
        borderRadius: "12px",
        marginBottom: "20px",
        boxShadow: "0 10px 20px rgba(0,0,0,0.08)"
    },

    table: {
        width: "100%",
        borderCollapse: "collapse"
    },

    theadRow: {
        background: "#1e3a8a",
        color: "white"
    },

    row: {
        borderBottom: "1px solid #ddd"
    },

    generateBtn: {
        marginTop: "15px",
        background: "linear-gradient(90deg,#22c55e,#16a34a)",
        color: "white",
        padding: "12px",
        border: "none",
        borderRadius: "10px"
    },

    alert: {
        background: "#fee2e2",
        padding: "10px",
        borderRadius: "8px"
    },

    skillBox: {
        display: "flex",
        gap: "10px",
        flexWrap: "wrap"
    },

    skill: {
        background: "#2563eb",
        color: "white",
        padding: "5px 10px",
        borderRadius: "20px",
        fontSize: "12px"
    }
};