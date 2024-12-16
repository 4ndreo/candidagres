import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import React, { createContext, useState } from "react";
import { Routes, Route } from "react-router-dom";

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
import StorePage from "./pages/Store/Store";
import ViewProducts from "./pages/Store/ViewProducts/ViewProducts";
import ViewProduct from "./pages/Store/ViewProduct/ViewProduct";
import Cart from "./pages/Store/Cart/Cart";
import Purchases from "./pages/Store/Purchases/Purchases"

// Classes
import ClassesPage from "./pages/Classes/Classes";
import ShiftsPage from "./pages/Shifts/Shifts";

// Profile
import ProfilePage from "./pages/Profile/Profile";
import ViewProfileCard from "./components/Profile/ViewProfileCard/ViewProfileCard";
import EditProfileCard from "./components/Profile/EditProfileCard/EditProfileCard";


// import { Dashboard } from "./components/dashboard/Dashboard"
import CustomToast from "./components/basics/CustomToast/CustomToast";
import ForgotPassword from "./components/ForgotPassword/ForgotPassword";
import VerifyEmail from "./components/VerifyEmail/VerifyEmail";
import ChangePassword from "./components/ChangePassword/ChangePassword";
import AdminUsers from "./pages/admin/AdminUsers/AdminUsers";
import FormUser from "./components/FormUser/FormUser";
import AdminPurchases from "./pages/admin/AdminPurchases/AdminPurchases";

export const AuthContext = createContext();

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [verifyEmailCode, setVerifyEmailCode] = useState(null);
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  );

  const [showToast, setShowToast] = useState(null);

  return (
    <>
      <AuthContext.Provider
        value={{ token, currentUser, setToken, setCurrentUser, verifyEmailCode, setVerifyEmailCode }}
      >
        <Header></Header>

        <Routes>
          <Route path="/auth" element={<AuthPage />}>
            <Route path="login" element={<Login props={{ setShowToast }} />} />
            <Route path="register" element={<Register props={{ setShowToast }} />} />
            <Route path="forgot-password" element={<ForgotPassword props={{ setShowToast }} />} />
            <Route path="verify-email/:id" element={<VerifyEmail props={{ setShowToast }} />} />
            <Route path="change-password/:id" element={<ChangePassword props={{ setShowToast }} />} />
          </Route>

          <Route path="*" element={<Home props={{ setShowToast }} />} />

          {/* Classes */}
          <Route path="classes" element={<ClassesPage />} />
          <Route path="classes/:id/shifts" element={<ShiftsPage props={{ setShowToast }} />} />

          {/* Admin */}
          <Route path="/admin" element={<Admin />}>

            {/* Purchases */}
            <Route path="purchases" element={<AdminPurchases props={{ setShowToast }} />} />

            {/* Products */}
            <Route path="products" element={<AdminProducts props={{ setShowToast }} />} />
            <Route
              path="products/new"
              element={<FormProduct props={{ title: "Producto", setShowToast }} />}
            />
            <Route
              path="products/:id"
              element={<FormProduct props={{ title: "Producto", setShowToast }} />}
            />

            {/* User */}
            <Route path="users" element={<AdminUsers props={{ setShowToast }} />} />
            <Route
              path="users/new"
              element={<FormUser props={{ title: "Usuario", setShowToast }} />}
            />
            <Route
              path="users/:id"
              element={<FormUser props={{ title: "Usuario", setShowToast }} />}
            />

            {/* Classes */}
            <Route path="classes" element={<AdminClasses props={{ setShowToast }} />} />
            <Route
              path="classes/new"
              element={<FormClass props={{ title: "Clase", setShowToast }} />}
            />
            <Route
              path="classes/:id"
              element={<FormClass props={{ title: "Clase", setShowToast }} />}
            />

            {/* Shifts */}
            <Route path="shifts" element={<AdminShifts props={{ setShowToast }} />} />
            <Route
              path="shifts/new"
              element={<FormShift props={{ title: "Comisión", setShowToast }} />}
            />
            <Route
              path="shifts/:id"
              element={<FormShift props={{ title: "Comisión", setShowToast }} />}
            />

            {/* Enrollments */}
            <Route path="enrollments" element={<AdminEnrollments props={{ setShowToast }} />} />

          </Route>


          {/* Store */}
          <Route path="/store" element={<StorePage />}>
            <Route path="" element={<ViewProducts />} title={"Tienda"} />
            <Route path="item/:id" element={<ViewProduct />} />
            <Route path="cart/:idUsuario" element={<Cart />} title={"Compras"} />
            <Route path="purchases/:idUsuario" element={<Purchases />} title={"Historial"} />
          </Route>


          {/* Profile */}
          <Route path="profile" element={<ProfilePage props={{ data: currentUser, setShowToast }} />}>
            <Route path="" element={<ViewProfileCard props={{ data: currentUser }} />} />
            <Route path="edit" element={<EditProfileCard props={{ data: currentUser }} />} />
          </Route>

          {/* Rutas Dashboard */}

          {/* <Route path="/Dashboard" element={<Dashboard />} title={"Dashboard"} /> */}

        </Routes>

        <Footer></Footer>
        <CustomToast props={{ data: showToast, setShowToast: setShowToast }} />

      </AuthContext.Provider>
    </>
  );
}

export default App;
