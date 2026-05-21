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

    // ================= LOGIN CHECK =================

    useEffect(() => {

        // CHECK LOGIN
        const teacher = localStorage.getItem("teacher");

        // IF NOT LOGIN
        if (
            teacher === null ||
            teacher === undefined ||
            teacher === ""
        ) {

            alert("Please Login First");

            // REDIRECT LOGIN PAGE
            navigate("/teacher-login");

            return;
        }

        // FETCH SUBMISSIONS
        fetchData();

    }, [navigate]);

    // ================= FETCH SUBMISSIONS =================

    const fetchData = async () => {

        try {

            setLoading(true);

            const response = await axios.get(
                "/api/submissions/"
            );

            console.log(response.data);

            setData(response.data);

        } catch (error) {

            console.log(error);

            setErrorMsg("Unable To Fetch Submissions");

        } finally {

            setLoading(false);

        }

    };

    // ================= AUTO REFRESH =================

    useEffect(() => {

        const teacher = localStorage.getItem("teacher");

        if (!teacher) return;

        const interval = setInterval(() => {

            fetchData();

        }, 5000);

        return () => clearInterval(interval);

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

            setErrorMsg("Select Submission");

            return;
        }

        try {

            const response = await axios.patch(
                `/api/submissions/${selected.id}/`,
                {
                    code_quality: Number(codeQuality),
                    documentation: Number(documentation),
                    presentation: Number(presentation),
                    performance: Number(performance),
                    marks: calculateTotal(),
                    feedback: feedback,
                    status: "Evaluated"
                }
            );

            console.log(response.data);

            setSuccessMsg("Evaluation Saved Successfully");

            fetchData();

        } catch (error) {

            console.log(error);

            setErrorMsg("Error Saving Evaluation");

        }

    };

    // ================= LOGOUT =================

    const logout = () => {

        localStorage.removeItem("teacher");

        alert("Logout Successful");

        navigate("/teacher-login");
    };

    // ================= UI =================

    return (

        <div className="container mt-4">

            {/* HEADER */}

            <div className="d-flex justify-content-between align-items-center mb-4">

                <h2>Teacher Evaluation Panel</h2>

                <button
                    className="btn btn-danger"
                    onClick={logout}
                >
                    Logout
                </button>

            </div>

            {/* SUCCESS */}

            {
                successMsg &&
                <div className="alert alert-success">
                    {successMsg}
                </div>
            }

            {/* ERROR */}

            {
                errorMsg &&
                <div className="alert alert-danger">
                    {errorMsg}
                </div>
            }

            <div className="row">

                {/* LEFT SIDE */}

                <div className="col-md-5">

                    {
                        loading &&
                        <div className="alert alert-info">
                            Loading...
                        </div>
                    }

                    {
                        !loading && data.length === 0 &&
                        <div className="alert alert-warning">
                            No Submissions Found
                        </div>
                    }

                    {
                        data.map((item) => (

                            <div
                                key={item.id}
                                className="card p-3 mb-3 shadow-sm"
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

                                }}
                            >

                                <h5>{item.title}</h5>

                                <p>
                                    <b>Student:</b> {item.student_name}
                                </p>

                                <p>
                                    <b>Status:</b> {item.status}
                                </p>

                                <p>
                                    <b>Marks:</b> {item.marks || 0}
                                </p>

                            </div>

                        ))
                    }

                </div>

                {/* RIGHT SIDE */}

                <div className="col-md-7">

                    {
                        !selected ? (

                            <div className="alert alert-secondary">
                                Select Submission
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
                                    value={performance}
                                    onChange={(e) =>
                                        setPerformance(e.target.value)
                                    }
                                />

                                {/* TOTAL */}

                                <div className="alert alert-primary">

                                    <h5>
                                        Total Marks :
                                        {calculateTotal()}
                                    </h5>

                                </div>

                                {/* FEEDBACK */}

                                <label className="mb-1">
                                    Feedback
                                </label>

                                <textarea
                                    className="form-control mb-3"
                                    rows="4"
                                    value={feedback}
                                    onChange={(e) =>
                                        setFeedback(e.target.value)
                                    }
                                />

                                {/* BUTTON */}

                                <button
                                    className="btn btn-success w-100"
                                    onClick={save}
                                >
                                    Save Evaluation
                                </button>

                            </div>

                        )
                    }

                </div>

            </div>

        </div>

    );

}