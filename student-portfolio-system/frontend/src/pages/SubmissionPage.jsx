import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function SubmissionPage() {

    const navigate = useNavigate();

    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [tags, setTags] = useState("");
    const [file, setFile] = useState(null);

    const user = localStorage.getItem("username");

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await axios.get("http://127.0.0.1:8000/api/submissions/");
            setSubmissions(res.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSubmit = async () => {
        const formData = new FormData();

        formData.append("student_name", user);
        formData.append("title", title);
        formData.append("description", description);
        formData.append("tags", tags);
        formData.append("status", "Submitted");

        if (file) formData.append("file", file);

        try {
            await axios.post(
                "http://127.0.0.1:8000/api/submissions/",
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            alert("Assignment Submitted Successfully");

            setTitle("");
            setDescription("");
            setTags("");
            setFile(null);

            fetchData();
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div style={styles.page}>

            {/* HEADER */}
            <div style={styles.header}>
                <div>
                    <h2 style={styles.title}>📘 Submission Portal</h2>
                    <p style={styles.sub}>Welcome, <b>{user}</b></p>
                </div>

                <button style={styles.backBtn} onClick={() => navigate("/dashboard")}>
                    Back
                </button>
            </div>

            {/* FORM CARD */}
            <div style={styles.card}>
                <h3 style={styles.sectionTitle}>Submit Assignment</h3>

                <input
                    style={styles.input}
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <textarea
                    style={{ ...styles.input, height: "100px" }}
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />

                <input
                    style={styles.input}
                    placeholder="Tags (e.g. react, django)"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                />

                <input
                    type="file"
                    style={styles.input}
                    onChange={(e) => setFile(e.target.files[0])}
                />

                <button style={styles.submitBtn} onClick={handleSubmit}>
                    🚀 Submit Assignment
                </button>
            </div>

            {/* SUBMISSIONS LIST */}
            <div style={styles.card}>
                <h3 style={styles.sectionTitle}>My Submissions</h3>

                {loading ? (
                    <p>Loading...</p>
                ) : submissions.length === 0 ? (
                    <p style={{ color: "red" }}>No submissions found</p>
                ) : (
                    submissions.map((item) => (
                        <div key={item.id} style={styles.itemCard}>

                            <h4 style={{ margin: 0 }}>{item.title}</h4>

                            <p style={styles.smallText}>
                                {item.description}
                            </p>

                            <div style={styles.row}>
                                <span style={styles.tag}>{item.tags}</span>
                                <span style={styles.status}>{item.status}</span>
                            </div>

                            <div style={styles.row}>
                                <span>Marks: {item.marks ?? "Pending"}</span>

                                {item.file && (
                                    <a href={item.file} target="_blank" style={styles.link}>
                                        View File
                                    </a>
                                )}
                            </div>
                        </div>
                    ))
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
        background: "#ffffff",
        padding: "15px 20px",
        borderRadius: "12px",
        marginBottom: "20px",
        boxShadow: "0 10px 20px rgba(0,0,0,0.1)"
    },

    title: {
        margin: 0,
        color: "#1e3a8a"
    },

    sub: {
        margin: 0,
        color: "#6b7280"
    },

    backBtn: {
        background: "#111827",
        color: "white",
        padding: "10px 15px",
        borderRadius: "8px",
        border: "none",
        cursor: "pointer"
    },

    card: {
        background: "white",
        padding: "20px",
        borderRadius: "12px",
        marginBottom: "20px",
        boxShadow: "0 10px 20px rgba(0,0,0,0.08)"
    },

    sectionTitle: {
        marginBottom: "15px",
        color: "#111827"
    },

    input: {
        width: "100%",
        padding: "12px",
        marginBottom: "12px",
        borderRadius: "10px",
        border: "1px solid #d1d5db",
        outline: "none"
    },

    submitBtn: {
        width: "100%",
        padding: "12px",
        border: "none",
        borderRadius: "10px",
        background: "linear-gradient(90deg,#2563eb,#1d4ed8)",
        color: "white",
        fontWeight: "bold",
        cursor: "pointer"
    },

    itemCard: {
        border: "1px solid #e5e7eb",
        padding: "15px",
        borderRadius: "10px",
        marginBottom: "10px"
    },

    smallText: {
        color: "#6b7280",
        fontSize: "13px"
    },

    row: {
        display: "flex",
        justifyContent: "space-between",
        marginTop: "8px"
    },

    tag: {
        background: "#e0e7ff",
        padding: "4px 10px",
        borderRadius: "20px",
        fontSize: "12px"
    },

    status: {
        background: "#22c55e",
        color: "white",
        padding: "4px 10px",
        borderRadius: "20px",
        fontSize: "12px"
    },

    link: {
        color: "#2563eb",
        textDecoration: "none",
        fontWeight: "bold"
    }
};