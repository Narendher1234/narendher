import { useEffect, useState } from "react";
import axios from "axios";

export default function TeacherPage() {

    const [submissions, setSubmissions] = useState([]);

    // STORE GRADES TEMPORARILY (FIXED APPROACH)
    const [grades, setGrades] = useState({});

    /* ================================
        FETCH DATA
    ================================ */

    useEffect(() => {
        fetchSubmissions();
    }, []);

    const fetchSubmissions = async () => {

        try {

            const res = await axios.get(
                "http://127.0.0.1:8000/api/submissions/"
            );

            setSubmissions(res.data);

        } catch (error) {
            console.log(error);
        }
    };

    /* ================================
        HANDLE INPUT CHANGE
    ================================ */

    const handleChange = (id, field, value) => {

        setGrades((prev) => ({
            ...prev,
            [id]: {
                ...prev[id],
                [field]: value
            }
        }));
    };

    /* ================================
        SUBMIT GRADE
    ================================ */

    const handleGrade = async (id) => {

        try {

            const data = grades[id];

            if (!data) {
                alert("Enter marks first");
                return;
            }

            await axios.patch(
                `http://127.0.0.1:8000/api/submissions/${id}/`,
                {
                    code_quality: data.code_quality || 0,
                    documentation: data.documentation || 0,
                    presentation: data.presentation || 0,
                    performance: data.performance || 0,
                    marks: data.marks || 0,
                    feedback: data.feedback || "",
                    status: "Graded"
                }
            );

            alert("Submission Graded Successfully");

            fetchSubmissions();

        } catch (error) {
            console.log(error);
            alert("Error grading submission");
        }
    };

    return (

        <div className="container mt-4">

            {/* HEADER */}
            <div className="card shadow p-3 mb-4 bg-dark text-white">

                <h3 className="m-0">Teacher Evaluation Panel</h3>

            </div>

            {/* SUBMISSIONS */}
            {submissions.length === 0 ? (

                <p className="text-center">No submissions found</p>

            ) : (

                submissions.map((item) => (

                    <div
                        key={item.id}
                        className="card shadow mb-4 p-3"
                    >

                        {/* TITLE */}
                        <h4>{item.title}</h4>

                        <p>{item.description}</p>

                        <p>
                            <b>Status:</b> {item.status}
                        </p>

                        {/* FILE */}
                        <a
                            href={item.file}
                            target="_blank"
                            rel="noreferrer"
                            className="btn btn-primary btn-sm mb-3"
                        >
                            View File
                        </a>

                        {/* RUBRIC MARKS */}
                        <div className="row">

                            <div className="col-md-3 mb-2">
                                <input
                                    type="number"
                                    className="form-control"
                                    placeholder="Code Quality"
                                    onChange={(e) =>
                                        handleChange(
                                            item.id,
                                            "code_quality",
                                            e.target.value
                                        )
                                    }
                                />
                            </div>

                            <div className="col-md-3 mb-2">
                                <input
                                    type="number"
                                    className="form-control"
                                    placeholder="Documentation"
                                    onChange={(e) =>
                                        handleChange(
                                            item.id,
                                            "documentation",
                                            e.target.value
                                        )
                                    }
                                />
                            </div>

                            <div className="col-md-3 mb-2">
                                <input
                                    type="number"
                                    className="form-control"
                                    placeholder="Presentation"
                                    onChange={(e) =>
                                        handleChange(
                                            item.id,
                                            "presentation",
                                            e.target.value
                                        )
                                    }
                                />
                            </div>

                            <div className="col-md-3 mb-2">
                                <input
                                    type="number"
                                    className="form-control"
                                    placeholder="Performance"
                                    onChange={(e) =>
                                        handleChange(
                                            item.id,
                                            "performance",
                                            e.target.value
                                        )
                                    }
                                />
                            </div>

                        </div>

                        {/* TOTAL MARKS */}
                        <input
                            type="number"
                            className="form-control mt-2"
                            placeholder="Total Marks"
                            onChange={(e) =>
                                handleChange(
                                    item.id,
                                    "marks",
                                    e.target.value
                                )
                            }
                        />

                        {/* FEEDBACK */}
                        <textarea
                            className="form-control mt-2"
                            rows="3"
                            placeholder="Feedback"
                            onChange={(e) =>
                                handleChange(
                                    item.id,
                                    "feedback",
                                    e.target.value
                                )
                            }
                        />

                        {/* SUBMIT BUTTON */}
                        <button
                            className="btn btn-success mt-3"
                            onClick={() => handleGrade(item.id)}
                        >
                            Grade Submission
                        </button>

                    </div>

                ))

            )}

        </div>

    );
}