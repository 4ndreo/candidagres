import { useState } from "react";
import CustomToast from "../../components/basics/CustomToast/CustomToast";
import "./Auth.css";
import { Outlet, useNavigate } from "react-router-dom";

export default function AuthPage() {
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(null);
  const [token] = useState(localStorage.getItem("token"));

  function handleShowToast(msg) {
    setShowToast({ show: true, title: 'Error', message: msg ?? 'Inténtelo de nuevo más tarde', variant: 'danger', position: 'top-end' });
  }
  if (token) {
    navigate("/", { replace: true });
  }

  return (
    <main className="container main auth-cont">
      <div className="auth-card row">
        <div className="col-lg-6 auth-card-img">
        </div>
        <div className="col-lg-6 auth-card-body p-3">


          <span className="brand">
            Cándida Gres
          </span>
          <Outlet context={handleShowToast} />
        </div>
      </div>
      <CustomToast props={{ data: showToast, setShowToast: setShowToast }} />

    </main>
  );
}
