import logo from "./logo.svg";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import React, { createContext, useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Header from "./components/basics/Header";
import Footer from "./components/basics/Footer";
import Home from "./pages/Home";
import Turnos from "./pages/Turnos";
import {CreateTurno} from "./components/turnos/CreateTurno";
import {EditTurno} from "./components/turnos/EditTurno";

export const AuthContext = createContext();

function App() {
  return (
    <>
      {/* <AuthContext.Provider value={{ token, currentUser, setToken, setCurrentUser }}> */}
      <Header></Header>

      <Routes>
        <Route path="*" element={<Home />} />
        <Route path="/turnos" element={<Turnos />} />
        <Route
          path="/turnos/turno"
          element={<CreateTurno 
          title={"Turno"} />}
        />
        <Route
          path="/turnos/turno/id-:idTurno"
          element={<EditTurno 
          title={"Turno"} />}
        />
      </Routes>

      <Footer></Footer>
      {/* </AuthContext.Provider> */}
    </>
  );
}

export default App;
