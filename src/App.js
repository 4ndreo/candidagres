import logo from './logo.svg';
import './App.css';
import React, { createContext, useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Header from "./components/basics/Header";
import Footer from "./components/basics/Footer";
import Home from "./pages/Home";

export const AuthContext = createContext();

function App() {
  return (
    <>
      {/* <AuthContext.Provider value={{ token, currentUser, setToken, setCurrentUser }}> */}
        <Header></Header>
        
        <Routes>

          <Route path="*" element={<Home />} />
          
        </Routes>

        <Footer></Footer>
    {/* </AuthContext.Provider> */}
    </>
  );
}

export default App;
