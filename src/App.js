import logo from "./logo.svg";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import React, { createContext, useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Header from "./components/basics/Header";
import Footer from "./components/basics/Footer";
import Home from "./pages/Home";

import PageLogin from "./pages/Login";
import PageRegister from "./pages/Register";

import Turnos from "./pages/admin/Turnos";
import { CreateTurno } from "./components/turnos/CreateTurno";
import { EditTurno } from "./components/turnos/EditTurno";
import { VerTurnos } from "./components/turnos/VerTurnos";

import Cursos from "./pages/Cursos";
import AdminCursos from "./pages/admin/Cursos";
import { CreateCurso } from "./components/cursos/CreateCurso";
import { EditCurso } from "./components/cursos/EditCurso";

import Inscripciones from "./pages/admin/Inscripciones";
import { CreateInscripcion } from "./components/inscripcion/CreateInscripcion";
import { CreateInscripcionUser } from "./components/inscripcion/CreateInscripcionUser";
import { EditInscripcion } from "./components/inscripcion/EditInscripcion";

import Productos from "./pages/admin/Productos";
import { CreateProducto } from "./components/productos/CreateProducto";
import { EditProducto } from "./components/productos/EditProducto";

import Tienda from "./pages/Tienda";
import VerProductoId from "./pages/VerProducto"

import Perfil from "./pages/Perfil";
import { PerfilTurnos } from "./components/perfil/PerfilTurnos";

import {VerCarrito} from "./components/carrito/VerCarrito"
import {HistorialCompras} from "./components/carrito/HistorialCompras"

import {Dashboard} from "./components/dashboard/Dashboard"

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

          <Route path="/panel/turnos" element={<Turnos />} />
          <Route
            path="/panel/turnos/turno"
            element={<CreateTurno title={"Turno"} />}
          />
          <Route
            path="/panel/turnos/turno/id-:idTurno"
            element={<EditTurno title={"Turno"} />}
          />
          <Route
            path="/turnos/turno/ver-:idCurso"
            element={<VerTurnos title={"Turnos"} />}
          />

          {/* Rutas de cursos */}
          <Route path="/cursos" element={<Cursos />} />
          <Route path="/panel/cursos" element={<AdminCursos />} />
          <Route
            path="/panel/cursos/curso"
            element={<CreateCurso title={"Clase"} />}
          />
          <Route
            path="/panel/cursos/curso/id-:idCurso"
            element={<EditCurso title={"Clase"} />}
          />

          {/* Rutas de Inscripciones */}
          {/*<Route path="/inscripciones" element={<Inscripciones />} />*/}
          {/*<Route*/}
          {/*  path="/inscripciones/inscripcion"*/}
          {/*  element={<CreateInscripcion title={"Inscripción"} />}*/}
          {/*/>*/}
          {/*<Route*/}
          {/*  path="/inscripciones/inscripcion/id-:idInscripcion"*/}
          {/*  element={<EditInscripcion title={"Inscripción"} />}*/}
          {/*/>*/}

          {/*<Route*/}
          {/*  path="/id-:idTurnos/curso/id-:idCurso"*/}
          {/*  element={<CreateInscripcionUser title={"Inscripción"} />}*/}
          {/*/>*/}

          {/* --------------- / ---------------- */}

          {/* Rutas de Productos */}
          <Route path="/productos" element={<Productos />} />
          <Route
            path="/productos/producto"
            element={<CreateProducto title={"Producto"} />}
          />
          <Route
            path="/productos/producto/id-:idProducto"
            element={<EditProducto title={"Producto"} />}
          />

          {/* Rutas de Tienda */}
          <Route path="/tienda" element={<Tienda />} />

          <Route path="/tienda/producto/id-:idProducto" element={<VerProductoId />} />

          {/* Rutas Perfil */}
          <Route path="/perfil" element={<Perfil />} />

          <Route
            path="perfil/turno/id-:idTurno/inscripcion/id-:idInscripcion"
            element={<PerfilTurnos title={"Turnos"} />}
          />


          {/* Rutas de Carrito de Compras */}

          <Route path="/carrito/id-:idCarrito" element={<VerCarrito />} title={"Compras"} />

          <Route path="/carrito/historial/id-:idUsuario" element={<HistorialCompras />} title={"Historial"} />

          {/* Rutas Dashboard */}

          <Route path="/Dashboard" element={<Dashboard />} title={"Dashboard"} />

        </Routes>




        <Footer></Footer>
        <script src="https://cdn.lordicon.com/qjzruarw.js"></script>
      </AuthContext.Provider>
    </>
  );
}

export default App;
