import ChatListItem from "./ChatItems";
import { useRef, useEffect, useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../context/authContext";
import axios from "axios";


export default function Sidebar({ activeChat, setActiveChat }) {
    const [searchInput, setSearchInput] = useState("");
    const [searhRes, setSearchRes] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const { accessToken, chats, setChats } = useContext(AuthContext);

    const dropdownRef = useRef(null);
    const searchTimerRef = useRef(null);
    const controllerRef = useRef(null);

    const searchUsers = async (query) => {
        if (controllerRef.current) {
            controllerRef.current.abort();   // cancel previous request if any
            console.log("A request is cancelled!");
        }
        controllerRef.current = new AbortController();

        console.log(query);
        return axios.get(
            `http://localhost:8080/api/users/search?username=${query}`,
            {
                headers: { Authorization: `Bearer ${accessToken}` },
                signal: controllerRef.current.signal,
            }
        );
    };
    //  handle change search bar
    const handleChange = (e) => {
        const query = e.target.value;
        setSearchInput(e.target.value);

        if (!query.trim()) {
            setShowDropdown(false);
            return;
        }

        //  Debounced search mechanism-------------
        if (searchTimerRef.current) clearTimeout(searchTimerRef.current);

        searchTimerRef.current = setTimeout(async () => {
            try {
                const res = await searchUsers(query);
                console.log(res);
                setSearchRes(res.data.users);
                setShowDropdown(true);
            } catch (error) {
                if (
                    axios.isCancel(error) ||
                    error.name === "CanceledError"
                ) {
                    console.log("Request Aborted: ", error);
                } else {
                    console.error(error);
                }
            }
        }, 400);
    };

    // handle click on user in result list-----------------
    const handleUserClick = (user) => {
        // console.log("user clicked: ", user);
        setSearchInput('');
        const isExistingChat = chats.find( chat => chat.receiver_id === user.id);

        if(isExistingChat){
            setActiveChat(isExistingChat);
        } else {
            const newUser = {
                receiver_id: user.id, 
                receiver_username: user.username, 
                conversation_id: null
            };
            setChats( prev => [newUser, ...prev]);
            setActiveChat(newUser);
        }
        setShowDropdown(false);
    };

    // clear timer on unmount ---------------
    useEffect(() => {
        return () => clearTimeout(searchTimerRef.current);
    }, []);

    // close dropdown on outside click----------
    useEffect(() => {
        const handleMouseDown = (event) => {
            if(dropdownRef.current && !dropdownRef.current.contains(event.target)){
                setShowDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleMouseDown);
        return () => {
            document.removeEventListener("mousedown", handleMouseDown);
        };
    }, []);


    return (
        <div className="w-1/4 bg-base-200 p-4 flex flex-col">
            <div className="relative">
                {/* Search */}
                <label className="input mb-1">
                    <svg
                        className="h-[1em] opacity-50"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                    >
                        <g
                            strokeLinejoin="round"
                            strokeLinecap="round"
                            strokeWidth="2.5"
                            fill="none"
                            stroke="currentColor"
                        >
                            <circle cx="11" cy="11" r="8"></circle>
                            <path d="m21 21-4.3-4.3"></path>
                        </g>
                    </svg>
                    <input
                        type="search"
                        value={searchInput}
                        onChange={handleChange}
                        required
                        placeholder="Search"
                    />
                </label>

                {/* Search result in dropdown */}
                {showDropdown && (
                    <ul ref={dropdownRef} className="dropdown-content absolute menu bg-base-100 rounded-box z-10 p-2 shadow-lg w-full">
                        {searhRes.length > 0 ? (
                            searhRes.map((user) => (
                                <li
                                    key={user.id}
                                    onClick={() => handleUserClick(user)}
                                >
                                   <a>{user.username}</a>
                                </li>
                            ))
                        ) : (
                            <li>
                                <a>user not found</a>
                            </li>
                        )}
                    </ul>
                )}
            </div>

            {/* Chat List & set new chat logic*/}
            <ul className="flex-1 overflow-y-auto">
                {chats.map((chat) => (
                    <ChatListItem
                        key={chat?.conversation_id || chat.receiver_id}
                        chat={chat}
                        active={activeChat?.receiver_id === chat.receiver_id}
                        onClick={() => {
                            setActiveChat(chat);
                            console.log(chat);
                        }}
                    />
                ))}
            </ul>
        </div>
    );
}
