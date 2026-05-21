import axios from "axios";

const base = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL.replace(/\/$/, '')}/api/` : "http://127.0.0.1:8000/api/";

const API = axios.create({
    baseURL: base
});

export default API;