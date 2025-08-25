import axios from "axios";

const axiosClient = axios.create({
  baseURL: "https://codex-mulj.onrender.com", // <-- your Render backend URL
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosClient;
