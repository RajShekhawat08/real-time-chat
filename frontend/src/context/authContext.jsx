import { createContext, useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {disconnectSocket} from "../services/socket"


const http = axios.create({
    baseURL: "http://localhost:8080/api",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [accessToken, setAccessToken] = useState(null);
    const [user, setUser] = useState(null);
    const [chats, setChats] = useState(null);
    const isAuthenticated = !!accessToken;

    const navigate = useNavigate();


    // Logout function  --> Discards access token and send to login page
    const logout = async () => {
        // remove access token and disconnect 
        setAccessToken(null);
        disconnectSocket();

        try {
            await http.post("/auth/logout");
            navigate("/login", {state: {message: "Session expired! Please login again"}});
        } catch (error) {
            console.error(error);
        }
    };

    // Refresh Access token function --> renew access token; If some error -> logout
    const refreshAccessToken = async () => {
        try {
            const response = await http.post("/auth/refresh");

            if (response.data.accessToken) {
                setAccessToken(response.data.accessToken);
            }
        } catch (error) {
            console.error(error);
            logout();
        }
    };

    //  Auto refresh logic --------------------------------- Need fix: cookie not getting saved in browser over http 

    //     const intervalRef = useRef(null);

    //     useEffect(() => {
        
    // //  If no access token or a timer exist already => return
    //         if(!accessToken || intervalRef.current ) return;
    // // setting a timer to auto refresh accesstoken every 14 minutes
    //         intervalRef.current = setInterval(() => {
    //             refreshAccessToken();
    //         }, 14 * 60 * 1000);

    //         console.log("Timer is set!")

    //         return () => {
    //             // Clean up function -----------
    //             console.log("Timer is cleared!");
    //             clearInterval(intervalRef.current);
    //             intervalRef.current = null;
    //         }

    //     }, [accessToken])

    return (
        <AuthContext.Provider
            value={{ accessToken, setAccessToken, user, setUser, chats, setChats, isAuthenticated, logout, refreshAccessToken }}
        >
            {children}
        </AuthContext.Provider>
    );
}
