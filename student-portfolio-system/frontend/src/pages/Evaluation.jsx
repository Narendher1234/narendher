import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Evaluation() {

    const navigate = useNavigate();

    // ================= STATES =================
    const [data, setData] = useState([]);
    const [selected, setSelected] = useState(null);
    const [loading, setLoading] = useState(true);

    const [codeQuality, setCodeQuality] = useState("");
    const [documentation, setDocumentation] = useState("");
    const [presentation, setPresentation] = useState("");
    const [performance, setPerformance] = useState("");
    const [feedback, setFeedback] = useState("");

    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    // ================= AUTH =================
    useEffect(() => {

        const teacher = localStorage.getItem("teacher");

        if (!teacher) {
            alert("Login required");
            navigate("/");
        }

    }, []);

    // ================= FETCH DATA =================
    const fetchData = async () => {

        try {

            setLoading(true);

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

        } catch (err) {

            console.log("FETCH ERROR:", err);

        } finally {

            setLoading(false);

        }
    };

    // ================= INITIAL FETCH =================
    useEffect(() => {
        fetchData();
    }, []);

    // ================= AUTO REFRESH =================
    useEffect(() => {

        const interval = setInterval(() => {
            fetchData();
        }, 3000);

        return () => clearInterval(interval);

    }, []);

    // ================= INSTANT UPDATE EVENT =================
    useEffect(() => {

        const handler = () => {
            fetchData();
        };

        window.addEventListener("evaluationUpdated", handler);

        return () => {
            window.removeEventListener("evaluationUpdated", handler);
        };

    }, []);

    // ================= TOTAL =================
    const calculateTotal = () => {

        return (
            Number(codeQuality || 0) +
            Number(documentation || 0) +
            Number(presentation || 0) +
            Number(performance || 0)
        );
    };

    // ================= SAVE EVALUATION =================
    const save = async () => {

        setErrorMsg("");
        setSuccessMsg("");

        if (!selected) {

            setErrorMsg("No submission selected");
            return;
        }

        try {

            const token = localStorage.getItem("token");

            const response = await axios.patch(
                `http://127.0.0.1:8000/api/submissions/${selected.id}/`,
                {
                    code_quality: Number(codeQuality),
                    documentation: Number(documentation),
                    presentation: Number(presentation),
                    performance: Number(performance),
                    marks: calculateTotal(),
                    feedback: feedback,
                    status: "Evaluated"
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            console.log("SUCCESS:", response.data);

            // ================= SUCCESS MESSAGE =================
            setSuccessMsg("Evaluation Saved Successfully");

            // ================= UPDATE LOCAL DATA IMMEDIATELY =================
            const updatedData = data.map((item) => {

                if (item.id === selected.id) {

                    return {
                        ...item,
                        code_quality: Number(codeQuality),
                        documentation: Number(documentation),
                        presentation: Number(presentation),
                        performance: Number(performance),
                        marks: calculateTotal(),
                        feedback: feedback,
                        status: "Evaluated"
                    };
                }

                return item;
            });

            setData(updatedData);

            // ================= UPDATE SELECTED =================
            setSelected({
                ...selected,
                code_quality: Number(codeQuality),
                documentation: Number(documentation),
                presentation: Number(presentation),
                performance: Number(performance),
                marks: calculateTotal(),
                feedback: feedback,
                status: "Evaluated"
            });

            // ================= GLOBAL EVENT =================
            // admin dashboard + student dashboard refresh
            window.dispatchEvent(new Event("evaluationUpdated"));

            // ================= REFRESH FROM DATABASE =================
            fetchData();

        } catch (err) {

            console.log("FULL ERROR:", err);

            if (err.response) {

                setErrorMsg(
                    JSON.stringify(err.response.data, null, 2)
                );

            } else {

                setErrorMsg("Server not responding");

            }
        }
    };

    return (

        <div className="container mt-4">

            {/* HEADER */}
            <div className="d-flex justify-content-between mb-3">

                <h2>Evaluation Panel</h2>

                <button
                    className="btn btn-dark"
                    onClick={() => navigate("/dashboard")}
                >
                    Back
                </button>

            </div>

            {/* SUCCESS MESSAGE */}
            {successMsg && (
                <div className="alert alert-success">
                    {successMsg}
                </div>
            )}

            {/* ERROR MESSAGE */}
            {errorMsg && (
                <div className="alert alert-danger">
                    <b>Error:</b>

                    <pre>{errorMsg}</pre>
                </div>
            )}

            <div className="row">

                {/* LEFT SIDE */}
                <div className="col-md-5">

                    {loading && (
                        <div className="alert alert-info">
                            Loading...
                        </div>
                    )}

                    {!loading && data.length === 0 && (
                        <div className="alert alert-warning">
                            No submissions found
                        </div>
                    )}

                    {data.map((item) => (

                        <div
                            key={item.id}
                            className="card p-3 mb-2 shadow-sm"
                            style={{
                                cursor: "pointer",
                                border:
                                    selected?.id === item.id
                                        ? "2px solid green"
                                        : "1px solid #ddd"
                            }}
                            onClick={() => {

                                setSelected(item);

                                setCodeQuality(item.code_quality || "");
                                setDocumentation(item.documentation || "");
                                setPresentation(item.presentation || "");
                                setPerformance(item.performance || "");
                                setFeedback(item.feedback || "");

                                setErrorMsg("");
                                setSuccessMsg("");
                            }}
                        >

                            <h5>{item.title}</h5>

                            <div>
                                <b>Student:</b> {item.student_name}
                            </div>

                            <div>
                                <b>Status:</b> {item.status}
                            </div>

                            <div>
                                <b>Marks:</b> {item.marks || 0}
                            </div>

                        </div>
                    ))}

                </div>

                {/* RIGHT SIDE */}
                <div className="col-md-7">

                    {!selected ? (

                        <div className="alert alert-secondary">
                            Select a submission
                        </div>

                    ) : (

                        <div className="card p-4 shadow">

                            <h3>{selected.title}</h3>

                            <hr />

                            {/* CODE QUALITY */}
                            <label className="mb-1">
                                Code Quality
                            </label>

                            <input
                                type="number"
                                className="form-control mb-3"
                                placeholder="Enter marks"
                                value={codeQuality}
                                onChange={(e) =>
                                    setCodeQuality(e.target.value)
                                }
                            />

                            {/* DOCUMENTATION */}
                            <label className="mb-1">
                                Documentation
                            </label>

                            <input
                                type="number"
                                className="form-control mb-3"
                                placeholder="Enter marks"
                                value={documentation}
                                onChange={(e) =>
                                    setDocumentation(e.target.value)
                                }
                            />

                            {/* PRESENTATION */}
                            <label className="mb-1">
                                Presentation
                            </label>

                            <input
                                type="number"
                                className="form-control mb-3"
                                placeholder="Enter marks"
                                value={presentation}
                                onChange={(e) =>
                                    setPresentation(e.target.value)
                                }
                            />

                            {/* PERFORMANCE */}
                            <label className="mb-1">
                                Performance
                            </label>

                            <input
                                type="number"
                                className="form-control mb-3"
                                placeholder="Enter marks"
                                value={performance}
                                onChange={(e) =>
                                    setPerformance(e.target.value)
                                }
                            />

                            {/* TOTAL */}
                            <div className="alert alert-primary">

                                <h5>
                                    Total Marks : {calculateTotal()}
                                </h5>

                            </div>

                            {/* FEEDBACK */}
                            <label className="mb-1">
                                Feedback
                            </label>

                            <textarea
                                className="form-control mb-3"
                                rows="4"
                                placeholder="Enter feedback"
                                value={feedback}
                                onChange={(e) =>
                                    setFeedback(e.target.value)
                                }
                            />

                            {/* SAVE BUTTON */}
                            <button
                                className="btn btn-success w-100"
                                onClick={save}
                            >
                                Save Evaluation
                            </button>

                        </div>
                    )}

                </div>

            </div>

        </div>
    );
}