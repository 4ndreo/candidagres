import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import React, { createContext, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

// Basics
import Header from "./components/basics/Header";
import Home from "./pages/Home";
import Footer from "./components/basics/Footer";

// Auth
import AuthPage from "./pages/Auth/Auth";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";

// Admin
import Admin from "./pages/admin/Admin";
import AdminProducts from "./pages/admin/AdminProducts/AdminProducts";
import FormProduct from "./components/FormProduct/FormProduct";
import AdminClasses from "./pages/admin/AdminClasses/AdminClasses";
import FormClass from "./components/FormClass/FormClass";
import AdminShifts from "./pages/admin/AdminShifts/AdminShifts";
import FormShift from "./components/FormShift/FormShift";
import AdminEnrollments from "./pages/admin/AdminEnrollments/AdminEnrollments";

// Store
import ViewProducts from "./pages/Store/ViewProducts/ViewProducts";
import ViewProduct from "./pages/Store/ViewProduct/ViewProduct";
import StorePage from "./pages/Store";
import Cart from "./pages/Store/Cart/Cart";
import Purchases from "./pages/Store/Purchases/Purchases"

// Classes
import ClassesPage from "./pages/Classes/Classes";
import { ShiftsPage } from "./pages/Shifts/Shifts";

// Profile
import ProfilePage from "./pages/Profile/Profile";
import { PerfilTurnos } from "./components/Profile/PerfilTurnos";
import ViewProfileCard from "./components/Profile/ViewProfileCard/ViewProfileCard";
import EditProfileCard from "./components/Profile/EditProfileCard/EditProfileCard";


import { Dashboard } from "./components/dashboard/Dashboard"
import MisClases from "./pages/MisClases";

export const AuthContext = createContext();

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  );

  // useEffect(() => {
  //   if (!token) {
  //     navigate("auth/login", { replace: true });
  //   }
  // }, []);



  return (
    <>
      <AuthContext.Provider
        value={{ token, currentUser, setToken, setCurrentUser }}
      >
        <Header></Header>

        <Routes>
          <Route path="/auth" element={<AuthPage />}>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>

          <Route path="*" element={<Home />} />





          {/* Rutas de Inscripciones */}
          {/* <Route path="/inscripciones" element={<Inscripciones />} /> */}
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
          <Route path="classes/:id/shifts" element={<ShiftsPage />} />
          {/* <Route path="classes/shifts/:id" element={<ShiftsPage title={"Comisiones"} />} /> */}


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

            {/* Rutas de comisiones */}

            <Route path="shifts" element={<AdminShifts />} />
            <Route
              path="shifts/new"
              element={<FormShift props={{ title: "Comisión" }} />}
            />
            <Route
              path="shifts/:id"
              element={<FormShift props={{ title: "Comisión" }} />}
            />

            {/* Rutas de inscripciones */}

            <Route path="enrollments" element={<AdminEnrollments />} />
            {/* <Route
              path="shifts/new"
              element={<FormShift props={{ title: "Comisión" }} />}
            />
            <Route
              path="shifts/:id"
              element={<FormShift props={{ title: "Comisión" }} />}
            /> */}
          </Route>

          {/* Rutas de Tienda */}
          <Route path="/store" element={<StorePage />}>

            <Route path="" element={<ViewProducts />} title={"Tienda"} />
            <Route path="item/:id" element={<ViewProduct />} />
            {/* Rutas de Carrito de Compras */}

            <Route path="cart/:idUsuario" element={<Cart />} title={"Compras"} />

            <Route path="purchases/:idUsuario" element={<Purchases />} title={"Historial"} />
          </Route>

          {/* Rutas Perfil */}
          <Route path="profile" element={<ProfilePage />}>
            <Route path="" element={<ViewProfileCard props={{ data: currentUser }} />} />
            <Route path="edit" element={<EditProfileCard props={{ data: currentUser }} />} />
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
