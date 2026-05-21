import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function PortfolioPage() {

    const navigate = useNavigate();

    const [submissions, setSubmissions] = useState([]);
    const [selectedWorks, setSelectedWorks] = useState([]);
    const [selectedWork, setSelectedWork] = useState(null);
    const [selectedWorkAI, setSelectedWorkAI] = useState(null);
    const [bestWork, setBestWork] = useState(null);
    const [bestWorkAI, setBestWorkAI] = useState(null);
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

    const generateAssignmentDetails = (item) => {
        if (!item) return null;

        const tags = item.tags
            ? item.tags.split(",").map((tag) => tag.trim()).filter(Boolean)
            : [];

        const techText = tags.length
            ? `It demonstrates skills in ${tags.join(", ")}.`
            : "It demonstrates general academic and technical skills.";

        const statusText = item.status
            ? `The current status of this submission is ${item.status}.`
            : "The current status of this submission is not available yet.";

        const marksText = item.marks !== null && item.marks !== undefined
            ? `The teacher assigned a score of ${item.marks}.`
            : "This work is still pending evaluation.";

        const feedbackText = item.feedback
            ? `Teacher feedback: ${item.feedback}`
            : "No teacher feedback has been recorded yet.";

        const summary = `AI Assignment Insight for "${item.title}": ${item.description || "No description was provided for this assignment."} ${techText} ${statusText} ${marksText} ${feedbackText}`;

        const bulletPoints = [
            `Project title: ${item.title}`,
            `Subject: ${item.subject || "Not specified"}`,
            `Focus areas: ${tags.length ? tags.join(", ") : "General coursework"}`,
            `Teacher comments: ${item.feedback || "None"}`,
            `Evaluation state: ${item.status || "Unknown"}`
        ];

        return {
            summary,
            bullets: bulletPoints
        };
    };

    const selectWork = (item) => {
        setSelectedWork(item);
        setSelectedWorkAI(generateAssignmentDetails(item));
    };

    const scoreWork = (item) => {
        let score = 0;

        if (item.marks !== null && item.marks !== undefined) {
            score += Number(item.marks) * 2;
        }
        if (item.status === "Evaluated") score += 20;
        if (item.tags) score += item.tags.split(",").length * 3;
        if (item.feedback) score += Math.min(15, item.feedback.length / 20);
        if (item.description) score += Math.min(10, item.description.length / 50);

        if (item.status === "Pending") score -= 5;
        if (item.status === "Rejected") score -= 10;

        return score;
    };

    const determineBestAssignment = (items) => {
        if (!items || items.length === 0) {
            setBestWork(null);
            setBestWorkAI(null);
            return;
        }

        const sorted = [...items].sort((a, b) => scoreWork(b) - scoreWork(a));
        const winner = sorted[0];

        const explanation = generateAssignmentDetails(winner);

        setBestWork(winner);
        setBestWorkAI({
            summary: `Based on marks, evaluation status, task detail, and skill tags, the AI recommends "${winner.title}" as the best work. ${explanation.summary}`,
            bullets: [
                `Highest estimated score: ${scoreWork(winner).toFixed(0)}`,
                `Subject: ${winner.subject || "Not specified"}`,
                `Status: ${winner.status || "Unknown"}`,
                `AI picked it because it has strong task detail, tags, and teacher feedback.`
            ]
        });
        setSelectedWork(winner);
        setSelectedWorkAI(explanation);
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
                                <th>Details</th>
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

                                    <td>{item.file ? (
                                            <a href={item.file} target="_blank" rel="noreferrer">
                                                View
                                            </a>
                                        ) : "No File"}</td>

                                    <td>
                                        <div style={styles.detailsCell}>
                                            <button
                                                type="button"
                                                onClick={() => selectWork(item)}
                                                style={styles.detailBtn}
                                            >
                                                View AI Details
                                            </button>

                                            {bestWork?.id === item.id && (
                                                <span style={styles.badge}>
                                                    AI Best
                                                </span>
                                            )}
                                        </div>
                                    </td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                <button onClick={() => {
                    if (selectedWorks.length === 0) {
                        alert("Select at least one work");
                        return;
                    }
                    determineBestAssignment(selectedWorks);
                    generatePortfolio();
                }} style={styles.generateBtn}>
                    Generate AI Portfolio & Recommend Best Work
                </button>

            </div>

            {/* BEST ASSIGNMENT */}
            <div style={styles.card}>
                {!bestWork ? (
                    <div style={{ textAlign: "center" }}>
                        <h3>Best Assignment Recommendation</h3>
                        <p>AI will suggest the strongest work after you select assignments.</p>
                    </div>
                ) : (
                    <>
                        <h3 style={{ color: "#2563eb" }}>Best Assignment: {bestWork.title}</h3>
                        <p style={styles.copyText}>{bestWorkAI?.summary}</p>

                        <div style={styles.infoGrid}>
                            <div><strong>Description:</strong> {bestWork.description || "No description available."}</div>
                            <div><strong>Subject:</strong> {bestWork.subject || "Not specified"}</div>
                            <div><strong>Tags:</strong> {bestWork.tags || "None"}</div>
                            <div><strong>Status:</strong> {bestWork.status || "Unknown"}</div>
                            <div><strong>Marks:</strong> {bestWork.marks ?? "Pending"}</div>
                            <div><strong>Feedback:</strong> {bestWork.feedback || "No teacher feedback"}</div>
                            {bestWork.file && (
                                <div><strong>File:</strong> <a href={bestWork.file} target="_blank" rel="noreferrer">View submission</a></div>
                            )}
                        </div>

                        <h4>Why this work?</h4>
                        <ul>
                            {bestWorkAI?.bullets.map((bullet, idx) => (
                                <li key={idx}>{bullet}</li>
                            ))}
                        </ul>
                    </>
                )}
            </div>

            {/* SELECTED WORK DETAILS */}
            <div style={styles.card}>

                {!selectedWork ? (
                    <div style={{ textAlign: "center" }}>
                        <h3>Selected Work</h3>
                        <p>Click "View AI Details" for any work to read more about that assignment.</p>
                    </div>
                ) : (
                    <>
                        <h3 style={{ color: "#2563eb" }}>AI Details for "{selectedWork.title}"</h3>

                        <p style={styles.copyText}>{selectedWorkAI?.summary}</p>

                        <h4>Key highlights</h4>
                        <ul>
                            {selectedWorkAI?.bullets.map((bullet, idx) => (
                                <li key={idx}>{bullet}</li>
                            ))}
                        </ul>
                    </>
                )}

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

    detailBtn: {
        background: "#2563eb",
        color: "white",
        border: "none",
        padding: "8px 12px",
        borderRadius: "8px",
        cursor: "pointer"
    },

    detailsCell: {
        display: "flex",
        alignItems: "center",
        gap: "10px"
    },

    badge: {
        background: "#fde047",
        color: "#92400e",
        padding: "4px 8px",
        borderRadius: "999px",
        fontSize: "12px",
        fontWeight: "700"
    },

    copyText: {
        lineHeight: "1.7",
        color: "#334155",
        marginBottom: "12px"
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

    infoGrid: {
        display: "grid",
        gap: "10px",
        marginBottom: "15px",
        padding: "15px",
        background: "#f8fafc",
        borderRadius: "12px",
        border: "1px solid #e2e8f0"
    },

    skill: {
        background: "#2563eb",
        color: "white",
        padding: "5px 10px",
        borderRadius: "20px",
        fontSize: "12px"
    }
};