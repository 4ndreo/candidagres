import logo from './logo.svg';
import "bootstrap/dist/css/bootstrap.min.css";
import './App.css';
import React, { createContext, useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Header from "./components/basics/Header";
import Footer from "./components/basics/Footer";
import Home from "./pages/Home";
import Turnos from "./pages/Turnos";
import CreateTurnos from "./components/turnos/CreateTurnos"

export const AuthContext = createContext();

function App() {
  return (
    <>
      {/* <AuthContext.Provider value={{ token, currentUser, setToken, setCurrentUser }}> */}
        <Header></Header>
        
        <Routes>

          <Route path="*" element={<Home />} />
          <Route path="/turnos" element={<Turnos />} />
          <Route path="/turnos/turno" element={<CreateTurnos />} title={"Turnos"}/>

        </Routes>

        <Footer></Footer>
    {/* </AuthContext.Provider> */}
    </>
  );
}

export default App;
