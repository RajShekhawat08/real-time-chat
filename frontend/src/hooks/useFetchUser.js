import { useState, useEffect, useContext} from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import { getUserInfo, getUserConversations } from "../services/userService";
import { initSocket, disconnectSocket } from "../services/socket";


/*
The hook ensures:
The user is authenticated (valid access token in react state, if not -> refresh).
Socket connection setup if valid token
User info is loaded into context
Fetch user conversations 
*/
export function useFetchUser() {
    const { accessToken, setUser, setChats, logout, refreshAccessToken} =
        useContext(AuthContext);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // console.log("useFetchUser is executed;")
        async function fetchUserData() {
            try {
                if (!accessToken) {
                    await refreshAccessToken();
                } else {
                    // Establish socket connection on login--------------------------------
                    initSocket(accessToken);
                    // Get user details
                    const res = await getUserInfo(accessToken);
                    const user = res.data.User;
                    setUser(user);

                    // Get user conversations
                    const res2 = await getUserConversations(accessToken, user.id);
                    setChats(res2.data.allConversations);
                    // console.log(res2.data.allConversations);
                    
                }
            } catch (error) {
                console.log(error);
                logout();
            } finally {
                setLoading(false);
            }
        }

        fetchUserData();
    }, []);

    return loading;
}
