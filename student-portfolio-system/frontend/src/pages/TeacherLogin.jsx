import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function TeacherLogin() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        const teacher = localStorage.getItem("teacher");
        if (teacher) navigate("/teacher-dashboard");
    }, [navigate]);

    const login = async () => {

        try {

            const res = await axios.post(
                "http://127.0.0.1:8000/api/teacher-login/",
                { username, password }
            );

            localStorage.setItem("teacher", JSON.stringify(res.data));
            localStorage.setItem("role", "teacher");

            navigate("/teacher-dashboard");

        } catch (err) {
            alert(err.response?.data?.error || "Login Failed");
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light">

            <motion.div
                className="card shadow-lg p-5 w-50"
                initial={{ opacity: 0, y: -50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
            >

                <h2 className="text-center text-primary mb-4">
                    Teacher Login
                </h2>

                <input
                    className="form-control mb-3"
                    placeholder="Username"
                    onChange={(e) => setUsername(e.target.value)}
                />

                <input
                    type="password"
                    className="form-control mb-3"
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button className="btn btn-primary w-100" onClick={login}>
                    Login
                </button>

            </motion.div>
        </div>
    );
}