import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {

    const navigate = useNavigate();

    const [tasks, setTasks] = useState([]);
    const [selectedWorks, setSelectedWorks] = useState([]);
    const [notification, setNotification] = useState("");

    const user =
        localStorage.getItem("username") || "Student";

    // =====================================
    // FETCH TASKS
    // =====================================
    const fetchTasks = async () => {

        try {

            const token = localStorage.getItem("token");

            const response = await axios.get(
                "http://127.0.0.1:8000/api/submissions/",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            console.log("API DATA :", response.data);

            // CHECK EVALUATED TASK
            const evaluatedTask = response.data.find(
                (item) => item.status === "Evaluated"
            );

            if (evaluatedTask) {

                setNotification(
                    `Your assignment "${evaluatedTask.title}" has been evaluated`
                );

            }

            setTasks(response.data);

        }
        catch (error) {

            console.log(error);

            alert("Failed To Fetch Tasks");

        }

    };

    // =====================================
    // INITIAL FETCH
    // =====================================
    useEffect(() => {

        fetchTasks();

    }, []);

    // =====================================
    // AUTO REFRESH
    // =====================================
    useEffect(() => {

        const interval = setInterval(() => {

            fetchTasks();

        }, 3000);

        return () => clearInterval(interval);

    }, []);

    // =====================================
    // FILTERS
    // =====================================
    const assignedTasks = tasks.filter(
        (item) =>
            item.status === "Pending" ||
            item.status === "Assigned"
    );

    const completedTasks = tasks.filter(
        (item) =>
            item.status === "Submitted" ||
            item.status === "Evaluated"
    );

    // =====================================
    // CHECKBOX
    // =====================================
    const handleCheckbox = (item) => {

        const exists = selectedWorks.find(
            (work) => work.id === item.id
        );

        if (exists) {

            setSelectedWorks(
                selectedWorks.filter(
                    (work) => work.id !== item.id
                )
            );

        }
        else {

            setSelectedWorks([
                ...selectedWorks,
                item
            ]);

        }

    };

    // =====================================
    // GENERATE PORTFOLIO
    // =====================================
    const handleGeneratePortfolio = () => {

        localStorage.setItem(
            "portfolioData",
            JSON.stringify(selectedWorks)
        );

        alert("Portfolio Generated Successfully");

        navigate("/portfolio");

    };

    // =====================================
    // LOGOUT
    // =====================================
    const handleLogout = () => {

        localStorage.clear();

        navigate("/");

    };

    return (

        <div
            style={{
                minHeight: "100vh",
                background:
                    "linear-gradient(to right, #eef2ff, #f8fafc)",
                padding: "25px"
            }}
        >

            {/* ================= HEADER ================= */}

            <div
                style={{
                    background:
                        "linear-gradient(to right, #1e3a8a, #2563eb)",
                    color: "white",
                    padding: "30px",
                    borderRadius: "20px",
                    marginBottom: "25px",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.15)"
                }}
            >

                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        alignItems: "center"
                    }}
                >

                    <div>

                        <h1
                            style={{
                                fontWeight: "bold",
                                marginBottom: "10px"
                            }}
                        >
                            Student Dashboard
                        </h1>

                        <p
                            style={{
                                fontSize: "18px",
                                margin: 0
                            }}
                        >
                            Welcome Back,
                            {" "}
                            <b>{user}</b>
                        </p>

                    </div>

                    <button
                        onClick={handleLogout}
                        style={{
                            background: "white",
                            color: "#1e3a8a",
                            border: "none",
                            padding: "12px 25px",
                            borderRadius: "10px",
                            fontWeight: "bold",
                            cursor: "pointer"
                        }}
                    >
                        Logout
                    </button>

                </div>

            </div>

            {/* ================= STATS ================= */}

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns:
                        "repeat(auto-fit,minmax(250px,1fr))",
                    gap: "20px",
                    marginBottom: "30px"
                }}
            >

                <div style={cardStyle}>

                    <h5>Total Tasks</h5>

                    <h1 style={{ color: "#2563eb" }}>
                        {tasks.length}
                    </h1>

                </div>

                <div style={cardStyle}>

                    <h5>Pending Tasks</h5>

                    <h1 style={{ color: "#f59e0b" }}>
                        {assignedTasks.length}
                    </h1>

                </div>

                <div style={cardStyle}>

                    <h5>Completed Tasks</h5>

                    <h1 style={{ color: "#16a34a" }}>
                        {completedTasks.length}
                    </h1>

                </div>

            </div>

            {/* ================= NOTIFICATION ================= */}

            {notification && (

                <div
                    style={{
                        background: "#dcfce7",
                        borderLeft: "6px solid green",
                        padding: "20px",
                        borderRadius: "10px",
                        marginBottom: "25px",
                        boxShadow: "0 2px 10px rgba(0,0,0,0.08)"
                    }}
                >

                    <h4 style={{ color: "green" }}>
                        Teacher Evaluation Update
                    </h4>

                    <p
                        style={{
                            marginBottom: 0,
                            fontSize: "17px"
                        }}
                    >
                        {notification}
                    </p>

                </div>

            )}

            {/* ================= ASSIGNED TASKS ================= */}

            <div style={mainCard}>

                <h2
                    style={{
                        color: "#1e3a8a",
                        marginBottom: "25px"
                    }}
                >
                    Assigned Tasks
                </h2>

                {
                    assignedTasks.length === 0 ? (

                        <div style={emptyStyle}>
                            No Tasks Assigned
                        </div>

                    ) : (

                        assignedTasks.map((item) => (

                            <div
                                key={item.id}
                                style={taskCard}
                            >

                                <div
                                    style={{
                                        display: "grid",
                                        gridTemplateColumns:
                                            "repeat(auto-fit,minmax(220px,1fr))",
                                        gap: "15px"
                                    }}
                                >

                                    <div>
                                        <b>Title</b>
                                        <p>{item.title}</p>
                                    </div>

                                    <div>
                                        <b>Description</b>
                                        <p>{item.description}</p>
                                    </div>

                                    <div>
                                        <b>Tags</b>
                                        <p>{item.tags}</p>
                                    </div>

                                    <div>
                                        <b>Status</b>

                                        <p
                                            style={{
                                                color: "#f59e0b",
                                                fontWeight: "bold"
                                            }}
                                        >
                                            {item.status}
                                        </p>
                                    </div>

                                </div>

                            </div>

                        ))

                    )
                }

            </div>

            {/* ================= COMPLETED TASKS ================= */}

            <div style={mainCard}>

                <h2
                    style={{
                        color: "#1e3a8a",
                        marginBottom: "25px"
                    }}
                >
                    Completed Tasks
                </h2>

                {
                    completedTasks.length === 0 ? (

                        <div style={emptyStyle}>
                            No Completed Tasks
                        </div>

                    ) : (

                        completedTasks.map((item) => (

                            <div
                                key={item.id}
                                style={completedCard}
                            >

                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent:
                                            "space-between",
                                        flexWrap: "wrap",
                                        gap: "20px"
                                    }}
                                >

                                    <div
                                        style={{
                                            display: "flex",
                                            gap: "25px",
                                            flexWrap: "wrap",
                                            alignItems: "center"
                                        }}
                                    >

                                        {/* CHECKBOX */}
                                        <input
                                            type="checkbox"
                                            onChange={() =>
                                                handleCheckbox(item)
                                            }
                                        />

                                        <div>
                                            <b>Title</b>
                                            <p>{item.title}</p>
                                        </div>

                                        <div>
                                            <b>Status</b>

                                            <p
                                                style={{
                                                    color:
                                                        item.status ===
                                                        "Evaluated"
                                                            ? "green"
                                                            : "#2563eb",
                                                    fontWeight: "bold"
                                                }}
                                            >
                                                {item.status}
                                            </p>
                                        </div>

                                    </div>

                                    {/* FILE BUTTON */}
                                    <div>

                                        {
                                            item.file && (

                                                <a
                                                    href={item.file}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    style={{
                                                        background:
                                                            "#2563eb",
                                                        color: "white",
                                                        textDecoration:
                                                            "none",
                                                        padding:
                                                            "10px 18px",
                                                        borderRadius:
                                                            "8px",
                                                        fontWeight:
                                                            "bold"
                                                    }}
                                                >
                                                    View File
                                                </a>

                                            )
                                        }

                                    </div>

                                </div>

                                {/* ================= EVALUATION ================= */}

                                {
                                    item.status ===
                                        "Evaluated" && (

                                        <div
                                            style={{
                                                marginTop: "25px",
                                                background:
                                                    "#f8fafc",
                                                borderRadius:
                                                    "12px",
                                                padding: "20px",
                                                border:
                                                    "1px solid #ddd"
                                            }}
                                        >

                                            <h3
                                                style={{
                                                    color: "green",
                                                    marginBottom:
                                                        "20px"
                                                }}
                                            >
                                                Teacher Evaluation
                                            </h3>

                                            <div
                                                style={{
                                                    display: "grid",
                                                    gridTemplateColumns:
                                                        "repeat(auto-fit,minmax(180px,1fr))",
                                                    gap: "20px"
                                                }}
                                            >

                                                <div
                                                    style={
                                                        scoreCard
                                                    }
                                                >
                                                    <h5>
                                                        Code
                                                        Quality
                                                    </h5>

                                                    <h2>
                                                        {
                                                            item.code_quality ||
                                                            0
                                                        }
                                                    </h2>
                                                </div>

                                                <div
                                                    style={
                                                        scoreCard
                                                    }
                                                >
                                                    <h5>
                                                        Documentation
                                                    </h5>

                                                    <h2>
                                                        {
                                                            item.documentation ||
                                                            0
                                                        }
                                                    </h2>
                                                </div>

                                                <div
                                                    style={
                                                        scoreCard
                                                    }
                                                >
                                                    <h5>
                                                        Presentation
                                                    </h5>

                                                    <h2>
                                                        {
                                                            item.presentation ||
                                                            0
                                                        }
                                                    </h2>
                                                </div>

                                                <div
                                                    style={
                                                        scoreCard
                                                    }
                                                >
                                                    <h5>
                                                        Performance
                                                    </h5>

                                                    <h2>
                                                        {
                                                            item.performance ||
                                                            0
                                                        }
                                                    </h2>
                                                </div>

                                            </div>

                                            <hr />

                                            <h4>
                                                Total Marks :
                                                {" "}
                                                <span
                                                    style={{
                                                        color:
                                                            "#2563eb"
                                                    }}
                                                >
                                                    {
                                                        item.marks ||
                                                        0
                                                    }
                                                </span>
                                            </h4>

                                            <div
                                                style={{
                                                    marginTop:
                                                        "15px"
                                                }}
                                            >

                                                <b>
                                                    Teacher
                                                    Feedback
                                                </b>

                                                <div
                                                    style={{
                                                        marginTop:
                                                            "10px",
                                                        background:
                                                            "white",
                                                        padding:
                                                            "15px",
                                                        borderRadius:
                                                            "10px"
                                                    }}
                                                >
                                                    {
                                                        item.feedback ||
                                                        "No Feedback"
                                                    }
                                                </div>

                                            </div>

                                        </div>

                                    )
                                }

                            </div>

                        ))

                    )
                }

                {/* GENERATE BUTTON */}

                <button
                    onClick={handleGeneratePortfolio}
                    style={{
                        marginTop: "20px",
                        background:
                            "linear-gradient(to right,#16a34a,#22c55e)",
                        color: "white",
                        border: "none",
                        padding: "15px 25px",
                        borderRadius: "12px",
                        fontWeight: "bold",
                        fontSize: "17px",
                        cursor: "pointer"
                    }}
                >
                    Generate Portfolio
                </button>

            </div>

            {/* ================= PORTFOLIO ================= */}

            <div style={mainCard}>

                <h2
                    style={{
                        color: "#1e3a8a",
                        marginBottom: "20px"
                    }}
                >
                    Portfolio Preview
                </h2>

                <input
                    type="text"
                    readOnly
                    value={
                        window.location.origin +
                        "/preview"
                    }
                    style={{
                        width: "100%",
                        padding: "14px",
                        borderRadius: "10px",
                        border: "1px solid #ccc",
                        marginBottom: "20px"
                    }}
                />

                <div
                    style={{
                        display: "flex",
                        gap: "15px",
                        flexWrap: "wrap"
                    }}
                >

                    <button
                        onClick={handleGeneratePortfolio}
                        style={{
                            background: "#16a34a",
                            color: "white",
                            border: "none",
                            padding: "12px 22px",
                            borderRadius: "10px",
                            fontWeight: "bold",
                            cursor: "pointer"
                        }}
                    >
                        Generate Portfolio
                    </button>

                    <button
                        onClick={() =>
                            window.open(
                                "/preview",
                                "_blank"
                            )
                        }
                        style={{
                            background: "#111827",
                            color: "white",
                            border: "none",
                            padding: "12px 22px",
                            borderRadius: "10px",
                            fontWeight: "bold",
                            cursor: "pointer"
                        }}
                    >
                        Open Preview
                    </button>

                </div>

            </div>

        </div>

    );

}

// ====================== STYLES ======================

const cardStyle = {
    background: "white",
    padding: "25px",
    borderRadius: "18px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.08)"
};

const mainCard = {
    background: "white",
    padding: "30px",
    borderRadius: "20px",
    marginBottom: "30px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.08)"
};

const taskCard = {
    background: "#f8fafc",
    padding: "20px",
    borderRadius: "15px",
    marginBottom: "20px",
    border: "1px solid #e5e7eb"
};

const completedCard = {
    background: "#ffffff",
    padding: "25px",
    borderRadius: "15px",
    marginBottom: "25px",
    border: "1px solid #ddd",
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)"
};

const emptyStyle = {
    background: "#eff6ff",
    padding: "20px",
    borderRadius: "10px",
    color: "#2563eb",
    fontWeight: "bold"
};

const scoreCard = {
    background: "white",
    padding: "20px",
    borderRadius: "12px",
    textAlign: "center",
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)"
};