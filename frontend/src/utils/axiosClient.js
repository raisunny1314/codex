import axios from "axios";



const axiosClient = axios.create({
  baseURL: "https://codex-mulj.onrender.com",
  withCredentials: true
});




export default axiosClient;
