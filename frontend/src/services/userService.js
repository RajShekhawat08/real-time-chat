import axios from "axios";

const http = axios.create({
    baseURL: "http://localhost:8080/api",
    headers: {
        "Content-Type": "application/json",
    },
});

const getUserInfo = async (accessToken) => { 
    return http.get("/users/me", 
        {headers: {"Authorization": `Bearer ${accessToken}`}}
    );
}

const getUserConversations = async (accessToken, id) => {
    return http.get(`/users/${id}/conversations`, 
        {headers: {"Authorization": `Bearer ${accessToken}`}}
    );
}


export {getUserInfo, getUserConversations};