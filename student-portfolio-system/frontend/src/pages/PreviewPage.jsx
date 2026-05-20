import { useEffect, useState } from "react";
import axios from "axios";

export default function PreviewPage() {

    const [projects, setProjects] = useState([]);

    const [portfolio, setPortfolio] = useState({});

    useEffect(() => {

        getProjects();
        getPortfolio();

    }, []);

    // ================= GET PROJECTS =================
    const getProjects = async () => {

        try {

            const response = await axios.get(
                "http://127.0.0.1:8000/api/submissions/"
            );

            setProjects(response.data);

        } catch (error) {

            console.log(error);

        }

    };

    // ================= GET PORTFOLIO =================
    const getPortfolio = async () => {

        try {

            const response = await axios.get(
                "http://127.0.0.1:8000/api/portfolio/"
            );

            setPortfolio(response.data[0]);

        } catch (error) {

            console.log(error);

        }

    };

    // ================= DOWNLOAD PDF =================
    const downloadPDF = () => {

        window.print();

    };

    // ================= COPY LINK =================
    const copyLink = (id) => {

        const link =
            `${window.location.origin}/preview/${id}`;

        navigator.clipboard.writeText(link);

        alert("Link Copied Successfully");

    };

    return (

        <div className="container mt-4">

            {/* HEADER */}
            <div className="card shadow-lg border-0 mb-4">

                <div className="card-body bg-dark text-white text-center p-5">

                    <h1 className="fw-bold">
                        Student Portfolio
                    </h1>

                    <h5>
                        Full Stack Developer
                    </h5>

                    <p>
                        React | Django | Python | MySQL
                    </p>

                </div>

            </div>

            {/* SUMMARY */}
            <div className="card shadow border-0 mb-4">

                <div className="card-body">

                    <h3 className="mb-3">
                        Professional Summary
                    </h3>

                    <p>
                        {
                            portfolio?.summary ||
                            "Portfolio summary not available"
                        }
                    </p>

                </div>

            </div>

            {/* SKILLS */}
            <div className="card shadow border-0 mb-4">

                <div className="card-body">

                    <h3 className="mb-3">
                        Skills
                    </h3>

                    <div className="d-flex flex-wrap gap-3">

                        <span className="badge bg-primary p-3">
                            Python
                        </span>

                        <span className="badge bg-success p-3">
                            Django
                        </span>

                        <span className="badge bg-warning text-dark p-3">
                            React
                        </span>

                        <span className="badge bg-danger p-3">
                            MySQL
                        </span>

                        <span className="badge bg-info p-3">
                            REST API
                        </span>

                        <span className="badge bg-secondary p-3">
                            Bootstrap
                        </span>

                    </div>

                </div>

            </div>

            {/* PROJECTS */}
            <h2 className="mb-4">
                Projects
            </h2>

            <div className="row">

                {
                    projects.map((project) => (

                        <div
                            className="col-md-6 mb-4"
                            key={project.id}
                        >

                            <div className="card shadow h-100 border-0">

                                <div className="card-body">

                                    <h4 className="fw-bold">
                                        {project.title}
                                    </h4>

                                    <p>
                                        {project.description}
                                    </p>

                                    <p>
                                        <strong>Status:</strong>
                                        {" "}
                                        {project.status}
                                    </p>

                                    <p>
                                        <strong>Marks:</strong>
                                        {" "}
                                        {project.marks || "Not Graded"}
                                    </p>

                                    {/* SHAREABLE LINK */}
                                    <div className="mb-3">

                                        <label className="fw-bold">
                                            Share Link
                                        </label>

                                        <input
                                            type="text"
                                            className="form-control"
                                            value={
                                                `${window.location.origin}/preview/${project.id}`
                                            }
                                            readOnly
                                        />

                                    </div>

                                    <div className="d-flex gap-2 flex-wrap">

                                        <a
                                            href="https://github.com/"
                                            target="_blank"
                                            rel="noreferrer"
                                            className="btn btn-dark"
                                        >
                                            GitHub
                                        </a>

                                        <a
                                            href={project.file}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="btn btn-primary"
                                        >
                                            View File
                                        </a>

                                        <button
                                            className="btn btn-success"
                                            onClick={() =>
                                                copyLink(project.id)
                                            }
                                        >
                                            Copy Link
                                        </button>

                                    </div>

                                </div>

                            </div>

                        </div>

                    ))
                }

            </div>

            {/* DOWNLOAD PDF */}
            <div className="text-center mt-5 mb-5">

                <button
                    className="btn btn-success btn-lg"
                    onClick={downloadPDF}
                >
                    Download Resume PDF
                </button>

            </div>

        </div>

    );
}