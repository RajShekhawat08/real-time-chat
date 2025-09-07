import { io } from "socket.io-client";

let socket = null;

export const initSocket = (token) => {
    if (!socket) {
        socket = io("http://localhost:8080", {
            auth: { token },
            withCredentials: true,
            transports: ["websocket"], //only use Websocket avoid long-polling
        });

        socket.on("connect", () => {
            console.log("Connection Established");
        });

        socket.onAny((event, ...args) => {
            console.log(event, args);
        });

        socket.on("connect_error", (err) => {
            console.log(err.message);
        });

        socket.on("eventError", (err) =>{
            console.log("An error occured in: ", err.errorEvent + "\n" + err.message)
        })

        socket.on("disconnect", () => {
            console.log("Disconnected");
        });
    }
    return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};
