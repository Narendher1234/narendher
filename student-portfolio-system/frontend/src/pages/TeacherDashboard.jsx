import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function TeacherDashboard() {

    const navigate = useNavigate();

    const [data, setData] = useState([]);
    const [selected, setSelected] = useState(null);

    const [subject, setSubject] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [tags, setTags] = useState("");

    const [marks, setMarks] = useState("");
    const [feedback, setFeedback] = useState("");

    const [view, setView] = useState("dashboard");

    // AUTH
    useEffect(() => {

        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");

        if (!token) {
            alert("Please Login First");
            navigate("/");
            return;
        }

        if (role !== "teacher") {
            alert("Only Teacher Can Access");
            localStorage.clear();
            navigate("/");
            return;
        }

        fetchData();

    }, []);

    const fetchData = async () => {

        try {

            const token = localStorage.getItem("token");

            const res = await axios.get(
                "http://127.0.0.1:8000/api/submissions/",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setData(res.data);

        } catch (error) {
            console.log(error);
        }
    };

    const createTask = async () => {

        if (!subject || !title || !description || !tags) {
            alert("Fill all fields");
            return;
        }

        const token = localStorage.getItem("token");

        const formData = new FormData();
        formData.append("subject", subject);
        formData.append("title", title);
        formData.append("description", description);
        formData.append("tags", tags);
        formData.append("status", "Pending");

        const emptyFile = new File(["empty"], "task.txt", {
            type: "text/plain"
        });

        formData.append("file", emptyFile);

        await axios.post(
            "http://127.0.0.1:8000/api/submissions/",
            formData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                }
            }
        );

        setSubject("");
        setTitle("");
        setDescription("");
        setTags("");

        fetchData();
    };

    const saveEvaluation = async () => {

        const token = localStorage.getItem("token");

        await axios.patch(
            `http://127.0.0.1:8000/api/submissions/${selected.id}/`,
            {
                marks,
                feedback,
                status: "Evaluated"
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        setSelected(null);
        setMarks("");
        setFeedback("");
        fetchData();
    };

    const logout = () => {
        localStorage.clear();
        navigate("/");
    };

    return (

        <div style={page}>

            {/* HEADER */}
            <div style={header}>
                <div>
                    <h1>🎓 Teacher Dashboard</h1>
                    <p>Manage Tasks & Evaluate Students</p>
                </div>

                <div style={{ display: "flex", gap: "10px" }}>
                    <button style={btnLight} onClick={() => setView("dashboard")}>Dashboard</button>
                    <button style={btnYellow} onClick={() => setView("evaluation")}>Evaluation</button>
                    <button style={btnRed} onClick={logout}>Logout</button>
                </div>
            </div>

            {/* DASHBOARD */}
            {view === "dashboard" && (

                <div style={grid}>

                    {/* CREATE TASK */}
                    <div style={card}>
                        <h2 style={{ marginBottom: "15px", color: "#1e3a8a" }}>
                            Create Task
                        </h2>

                        <input style={input} placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
                        <input style={input} placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
                        <input style={input} placeholder="Tags" value={tags} onChange={(e) => setTags(e.target.value)} />
                        <textarea style={textarea} placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />

                        <button style={btnBlue} onClick={createTask}>
                            ➕ Create Task
                        </button>
                    </div>

                    {/* SUBMISSIONS */}
                    <div style={card}>
                        <h2 style={{ marginBottom: "15px", color: "#1e3a8a" }}>
                            Student Submissions
                        </h2>

                        {data.map((item) => (
                            <div
                                key={item.id}
                                onClick={() => setSelected(item)}
                                style={submissionCard}
                            >
                                <h3>{item.title}</h3>

                                <p>👤 {item.student_name}</p>
                                <p>📘 {item.subject}</p>

                                <span style={{
                                    ...badge,
                                    background:
                                        item.status === "Evaluated"
                                            ? "#16a34a"
                                            : "#2563eb"
                                }}>
                                    {item.status}
                                </span>
                            </div>
                        ))}
                    </div>

                </div>
            )}

            {/* EVALUATION */}
            {view === "evaluation" && (

                <div style={card}>

                    <h2 style={{ color: "#1e3a8a" }}>Evaluation Panel</h2>

                    {!selected ? (
                        <p style={infoBox}>Select a submission from dashboard</p>
                    ) : (

                        <>

                            <div style={selectedBox}>
                                <h3>{selected.title}</h3>
                                <p>Student: {selected.student_name}</p>
                                <p>Subject: {selected.subject}</p>
                            </div>

                            <input
                                style={input}
                                placeholder="Marks"
                                value={marks}
                                onChange={(e) => setMarks(e.target.value)}
                            />

                            <textarea
                                style={textarea}
                                placeholder="Feedback"
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                            />

                            <button style={btnGreen} onClick={saveEvaluation}>
                                Save Evaluation
                            </button>

                        </>
                    )}

                </div>

            )}

        </div>
    );
}

/* ================= STYLES ================= */

const page = {
    minHeight: "100vh",
    background: "linear-gradient(to right,#eef2ff,#f8fafc)",
    padding: "20px"
};

const header = {
    background: "linear-gradient(to right,#1e3a8a,#2563eb)",
    color: "white",
    padding: "25px",
    borderRadius: "15px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px"
};

const grid = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px"
};

const card = {
    background: "white",
    padding: "20px",
    borderRadius: "15px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.1)"
};

const input = {
    width: "100%",
    padding: "12px",
    marginBottom: "10px",
    borderRadius: "10px",
    border: "1px solid #ccc"
};

const textarea = {
    width: "100%",
    padding: "12px",
    marginBottom: "10px",
    borderRadius: "10px",
    border: "1px solid #ccc",
    height: "100px"
};

const submissionCard = {
    padding: "15px",
    marginBottom: "10px",
    borderRadius: "12px",
    border: "1px solid #ddd",
    cursor: "pointer",
    background: "#f9fafb"
};

const badge = {
    padding: "5px 10px",
    borderRadius: "20px",
    color: "white",
    fontSize: "12px"
};

const btnBlue = {
    width: "100%",
    padding: "12px",
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "10px"
};

const btnGreen = {
    width: "100%",
    padding: "12px",
    background: "#16a34a",
    color: "white",
    border: "none",
    borderRadius: "10px"
};

const btnRed = {
    padding: "10px 15px",
    background: "#ef4444",
    color: "white",
    border: "none",
    borderRadius: "10px"
};

const btnYellow = {
    padding: "10px 15px",
    background: "#f59e0b",
    color: "white",
    border: "none",
    borderRadius: "10px"
};

const btnLight = {
    padding: "10px 15px",
    background: "white",
    color: "#1e3a8a",
    border: "none",
    borderRadius: "10px"
};

const infoBox = {
    background: "#eff6ff",
    padding: "15px",
    borderRadius: "10px"
};

const selectedBox = {
    background: "#f1f5f9",
    padding: "15px",
    borderRadius: "12px",
    marginBottom: "10px"
};