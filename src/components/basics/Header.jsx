import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";

import { Navbar, Container, Nav, NavDropdown, Button } from "react-bootstrap";
import { useEffect, useContext } from "react";
import { AuthContext } from "../../App";

import UserImg from "../../img/user.svg";

export default function Header() {
  const value = useContext(AuthContext);

  const [showProfile, setShowProfile] = useState(false);

  let navigate = useNavigate();
  useEffect(() => {
    console.log(JSON.stringify(value));
    value.setCurrentUser(JSON.parse(localStorage.getItem("user")));
    if (!value.token) {
      navigate("/login", { replace: true });
    }
  }, []);

  function logOut() {
    localStorage.clear();
    value.setToken(null);
    value.setCurrentUser(null);

    console.log('cerrar sesion')
    navigate("/login", { replace: true });
  }

  function handleShowProfile() {
    setShowProfile(!showProfile);
    console.log(showProfile);
  }

  if ((!value.token && !value.currentUser) || value.currentUser) {
    return (
      <header className="navbar-base">
        <Navbar className="w-100 navbar-dark" expand="lg">
          <Container>
            <Link className="brand" to="/">
              Candida Gres
            </Link>
            <Navbar.Toggle aria-controls="menu-nav" />
            <Navbar.Collapse id="menu-nav">
              <Nav className="nav-menu">
                <Link to="/">Home</Link>
                {!value.token ? (
                  <>
                    <Link to="/login">Login</Link>
                    <Link to="/register">Registrarse</Link>
                  </>
                ) : (
                  <>
                    <Link to="/cursos">Clases</Link>
                    <NavDropdown title="Tienda" className="panel-ddown">
                      <Link to="/tienda" className="dropdown-item btn-productos"><span>Productos</span></Link>
                      <Link to={'/tienda/carrito/id-' + value.currentUser._id} className="dropdown-item btn-carrito">
                        <span>Carrito</span>
                      </Link>
                      <Link to={'/tienda/historial/id-' + value.currentUser._id} className="dropdown-item btn-historial">
                        <span>Historial</span>
                      </Link>
                    </NavDropdown>
                    {value.currentUser.role === 1 && (
                      <NavDropdown title="Panel" className="panel-ddown">
                        <Link to="panel/cursos" className="dropdown-item">
                          Clases
                        </Link>
                        <Link to="panel/turnos" className="dropdown-item">
                          Turnos
                        </Link>
                        <Link to="/Productos" className="dropdown-item">
                          Productos
                        </Link>
                        <Link to="/Dashboard" className="dropdown-item">
                          Dashboard
                        </Link>
                      </NavDropdown>
                    )}
                    <span className="btn-profile" onClick={() => handleShowProfile()}>
                      <span>
                        <div className={!showProfile ? "d-none" : "profile-links panel-ddown"} onMouseLeave={() => handleShowProfile()}>
                          <Link to="/perfil" className="dropdown-item">Perfil</Link>
                          <Button variant="link" className="logout dropdown-item" onClick={logOut}>
                            Cerrar sesión
                          </Button>
                        </div>
                      </span>
                    </span>
                  </>
                )}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </header>
    );
  }
}

// export default Header;
