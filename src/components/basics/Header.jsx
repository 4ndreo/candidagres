import React, { Component } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";

import { Navbar, Container, Nav } from "react-bootstrap";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../App";

export default function Header() {
  const [authUser, setAuthUser] = useState({});
  const [error, setError] = useState("");


  const value = useContext(AuthContext);

  let navigate = useNavigate();

  function logOut() {
    localStorage.clear();
    value.setToken(null);
    value.setCurrentUser(null);

    navigate("/login", { replace: true });
  }

  // if ((!value.token && !value.currentUser) || value.currentUser) {
  return (
    <header className="navbar-base">
      <Navbar className="w-100" expand="lg">
        <Container>
          <Link className="brand" to="/">
            Candida Gres
          </Link>
          <Navbar.Toggle aria-controls="menu-nav" />
          <Navbar.Collapse id="menu-nav">
            <Nav className="nav-menu">
              <Link to="/login">Login</Link>
              <Link to="/register">Registrarse</Link>
              <Link to="/">Home</Link>
              <Link to="/cursos">Cursos</Link>
              <Link to="/turnos">Turnos</Link>
              <Link to="/Inscripciones">Inscripciones</Link>
              <Link to="/panel">Panel</Link>
              <button className="logout nav-menu navbar-nav" onClick={logOut}>
                Logout
              </button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
}
// }

// export default Header;
