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
import AdminClasses from "./pages/admin/AdminClasses/AdminClasses";
import { CreateClass } from "./pages/admin/CreateClass/CreateClass";
import { EditClass } from "./pages/admin/EditClass/EditClass";

import Inscripciones from "./pages/admin/Inscripciones";
import { CreateInscripcion } from "./components/inscripcion/CreateInscripcion";
import { CreateInscripcionUser } from "./components/inscripcion/CreateInscripcionUser";
import { EditInscripcion } from "./components/inscripcion/EditInscripcion";

import AdminProducts from "./pages/admin/AdminProducts/AdminProducts";

import Store from "./pages/Store";
import VerProductoId from "./pages/VerProducto"

import Perfil from "./pages/Perfil";
import { PerfilTurnos } from "./components/perfil/PerfilTurnos";

import { Purchases } from "./pages/Store/Purchases/Purchases"

import { Dashboard } from "./components/dashboard/Dashboard"
import { VerTienda } from "./pages/Store/VerTienda";
import MisClases from "./pages/MisClases";
import { VerPerfil } from "./components/perfil/ver/VerPerfil";
import { EditarPerfil } from "./components/perfil/editar/EditarPerfil";
import Admin from "./pages/admin/Admin";
import { ViewProduct } from "./pages/Store/ViewProducto/ViewProduct";
import { Cart } from "./pages/Store/Cart/Cart";
import { FormProduct } from "./components/FormProduct/FormProduct";

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



          {/* Rutas de Inscripciones */}
          <Route path="/inscripciones" element={<Inscripciones />} />
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
          <Route path="cursos" element={<Cursos />} />


          <Route path="/admin" element={<Admin />}>

            {/* Rutas de Productos */}
            <Route path="products" element={<AdminProducts />} />
            <Route
              path="products/new"
              element={<FormProduct props={{title: "Producto"}} />}
            />
            <Route
              path="products/:id"
              element={<FormProduct props={{title: "Producto"}} />}
            />

            {/* Rutas de cursos */}
            <Route path="classes" element={<AdminClasses />} />
            <Route
              path="classes/create"
              element={<CreateClass title={"Clase"} />}
            />
            <Route
              path="classes/edit/id-:idCurso"
              element={<EditClass title={"Clase"} />}
            />
          </Route>

          {/* Rutas de Tienda */}
          <Route path="/store" element={<Store />}>

            <Route path="" element={<VerTienda />} title={"Tienda"} />
            <Route path="item/:id" element={<ViewProduct />} />
            {/* Rutas de Carrito de Compras */}

            <Route path="cart/:idUsuario" element={<Cart />} title={"Compras"} />

            <Route path="purchases/:idUsuario" element={<Purchases />} title={"Historial"} />
          </Route>

          {/* Rutas Perfil */}
          <Route path="perfil" element={<Perfil />} >
            <Route path="" element={<VerPerfil data={currentUser} />} title={"Tienda"} />
            <Route path="editar/:id" element={<EditarPerfil data={currentUser} />} title={"Tienda"} />
          </Route>
          <Route path="/perfil/clases" element={<MisClases />} />

          <Route
            path="perfil/turno/id-:idTurno/inscripcion/id-:idInscripcion"
            element={<PerfilTurnos title={"Turnos"} />}
          />



          {/* Rutas Dashboard */}

          <Route path="/Dashboard" element={<Dashboard />} title={"Dashboard"} />

        </Routes>




        <Footer></Footer>
      </AuthContext.Provider>
    </>
  );
}

export default App;
