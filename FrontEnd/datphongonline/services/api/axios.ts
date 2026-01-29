import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5071",
  withCredentials: true,
});

export default api;
