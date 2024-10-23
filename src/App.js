import logo from "./logo.svg";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import React, { createContext, useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Header from "./components/basics/Header";
import Footer from "./components/basics/Footer";
import Home from "./pages/Home";


import Turnos from "./pages/admin/Turnos";
import { CreateTurno } from "./components/turnos/CreateTurno";
import { EditTurno } from "./components/turnos/EditTurno";

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
import StorePage from "./pages/Store";
import AuthPage from "./pages/Auth/Auth";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import { FormClass } from "./components/FormClass/FormClass";
import ClassesPage from "./pages/Classes/Classes";
import { ShiftsPage } from "./pages/Shifts/Shifts";

export const AuthContext = createContext();

function App() {
  let navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  );

  useEffect(() => {
    if (!token) {
      navigate("auth/login", { replace: true });
    }
  }, []);



  return (
    <>
      <AuthContext.Provider
        value={{ token, currentUser, setToken, setCurrentUser }}
      >
        <Header></Header>

        <Routes>
          <Route path="/auth" element={<AuthPage />}>
            <Route path="login" element={<Login />} />
            <Route
              path="register"
              element={<Register />}
            />
          </Route>
          {/* <Route path="/login" element={<LoginPage onLogin={onLogin} />} />
          <Route
            path="/register"
            element={<RegisterPage onLogin={onLogin} />}
          /> */}

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
          <Route path="classes" element={<ClassesPage />} />
          <Route path="classes/shifts/:id" element={<ShiftsPage title={"Comisiones"} />} />


          <Route path="/admin" element={<Admin />}>

            {/* Rutas de Productos */}
            <Route path="products" element={<AdminProducts />} />
            <Route
              path="products/new"
              element={<FormProduct props={{ title: "Producto" }} />}
            />
            <Route
              path="products/:id"
              element={<FormProduct props={{ title: "Producto" }} />}
            />

            {/* Rutas de cursos */}
            <Route path="classes" element={<AdminClasses />} />
            <Route
              path="classes/new"
              element={<FormClass props={{ title: "Clase" }} />}
            />
            <Route
              path="classes/:id"
              element={<FormClass props={{ title: "Clase" }} />}
            />
          </Route>

          {/* Rutas de Tienda */}
          <Route path="/store" element={<StorePage />}>

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
