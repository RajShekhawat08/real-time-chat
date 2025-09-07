import { Routes, Route } from "react-router-dom";
import { useState } from "react";

import "./App.css";
import Register from "./pages/Register";
import Login from "./pages/login";
import Home from "./pages/Home";
import { AuthProvider } from "./context/authContext";


function App() {
    return (
       
      <AuthProvider>
        <Routes>  
          <Route path="/register" element={<Register/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/" element={<Home/>} />
        </Routes>
      </AuthProvider>

    );
}

export default App;
