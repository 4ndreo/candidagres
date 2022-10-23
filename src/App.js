import logo from "./logo.svg";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import React, { createContext, useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Header from "./components/basics/Header";
import Footer from "./components/basics/Footer";
import Home from "./pages/Home";

import PageLogin from "./pages/Login"
import PageRegister from "./pages/Register";

import Turnos from "./pages/Turnos";
import { CreateTurno } from "./components/turnos/CreateTurno";
import { EditTurno } from "./components/turnos/EditTurno";
import { VerTurnos } from "./components/turnos/VerTurnos";

import Cursos from "./pages/Cursos";
import { CreateCurso } from "./components/cursos/CreateCurso";
import { EditCurso } from "./components/cursos/EditCurso";

import Inscripciones from "./pages/Inscripciones";
import { CreateInscripcion } from "./components/inscripcion/CreateInscripcion";
import { EditInscripcion } from "./components/inscripcion/EditInscripcion";


export const AuthContext = createContext();

function App() {
  let navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  );

  useEffect(() => {
    if (!token) {
      navigate("/login", { replace: true });
    }
  }, []);

  async function onLogin(user, tokenInc) {
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", tokenInc);

    setCurrentUser(JSON.parse(localStorage.getItem("user")));
    navigate("/", { replace: true });
  }

  return (
    <>
      <AuthContext.Provider
        value={{ token, currentUser, setToken, setCurrentUser }}
      >
        <Header></Header>

        <Routes>
          <Route path="/login" element={<PageLogin onLogin={onLogin} />} />
          <Route
            path="/register"
            element={<PageRegister onLogin={onLogin} />}
          />

          <Route path="*" element={<Home />} />

          {/* Rutas de turnos */}
          <Route path="/turnos" element={<Turnos />} />
          <Route
            path="/turnos/turno"
            element={<CreateTurno title={"Turno"} />}
          />
          <Route
            path="/turnos/turno/id-:idTurno"
            element={<EditTurno title={"Turno"} />}
          />
          <Route
              path="/turnos/turno/ver-:idCurso"
              element={<VerTurnos title={"Turnos"} />}
          />

          {/* Rutas de cursos */}
          <Route path="/cursos" element={<Cursos />} />
          <Route
            path="/cursos/curso"
            element={<CreateCurso title={"Curso"} />}
          />
          <Route
            path="/cursos/curso/id-:idCurso"
            element={<EditCurso title={"Curso"} />}
          />

           Rutas de Inscripciones
         <Route path="/inscripciones" element={<Inscripciones />} />
          <Route
              path="/inscripciones/inscripcion"
              element={<CreateInscripcion title={"Inscripcion"} />}
          />
          <Route
              path="/inscripciones/inscripcion/id-:idInscripcion"
              element={<EditInscripcion title={"Inscripcion"} />}
          />

        </Routes>

        <Footer></Footer>
      </AuthContext.Provider>
    </>
  );
}

export default App;
