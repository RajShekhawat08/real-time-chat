import axios from "axios";

const http = axios.create({
    baseURL: "http://localhost:8080/api",
    headers: {
        "Content-Type": "application/json",
    },
});

const register = (userData) => {
    return http.post("/auth/register", userData);
};

const login = (userData) => {
    return http.post("/auth/login", userData);
};

export default { register, login };
