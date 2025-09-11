import { Routes, Route } from "react-router-dom";

import "./App.css";
import Register from "./pages/Register";
import Login from "./pages/login";
import Home from "./pages/Home";


function App() {
    return (
        <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Home />} />
        </Routes>
    );
}

export default App;
