import "./Profile.css";

import React, { useEffect, useState, useContext } from "react";
import { Outlet } from "react-router-dom";
import { AuthContext } from "../../App";


export default function ProfilePage() {
  const [loading] = useState(true);

  const value = useContext(AuthContext);

  value.setCurrentUser(JSON.parse(localStorage.getItem("user")));


  if ((value.currentUser.email.length === 0 && loading) || value.currentUser.email.length > 0) {
    return (
      <main className="container main">
        <div className="grid">
          <div className="col-lg-6 m-auto">
            <Outlet />
          </div>
        </div>
      </main>
    );
  } else {
    return (
      <main className="container main">
        <p>Ocurrió un error</p>
      </main>
    );
  }
}
