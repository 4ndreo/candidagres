import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";

import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";
import { useEffect, useContext } from "react";
import { AuthContext } from "../../App";

export default function Header() {
  const value = useContext(AuthContext);

  let navigate = useNavigate();
  useEffect(() => {
    console.log(value);
    value.setCurrentUser(JSON.parse(localStorage.getItem("user")));
    if (!value.token) {
      navigate("/login", { replace: true });
    }
  }, []);

  function logOut() {
    localStorage.clear();
    value.setToken(null);
    value.setCurrentUser(null);

    navigate("/login", { replace: true });
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
                {/* {{


              }} */}
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
                      {/*<Link to="/Inscripciones" className="dropdown-item">*/}
                      {/*  Inscripciones*/}
                      {/*</Link>*/}
                      <Link to={'/tienda/historial/id-' + value.currentUser._id} className="dropdown-item btn-historial">
                        <span>Historial</span>
                      </Link>
                    </NavDropdown>
                    <Link to="/perfil">Perfil</Link>
                    {value.currentUser.role === 1 ? (
                      <NavDropdown title="Panel" className="panel-ddown">
                        <Link to="panel/cursos" className="dropdown-item">
                          Clases
                        </Link>
                        <Link to="panel/turnos" className="dropdown-item">
                          Turnos
                        </Link>
                        {/*<Link to="/Inscripciones" className="dropdown-item">*/}
                        {/*  Inscripciones*/}
                        {/*</Link>*/}
                        <Link to="/Productos" className="dropdown-item">
                          Productos
                        </Link>
                        <Link to="/Dashboard" className="dropdown-item">
                          Dashboard
                        </Link>
                      </NavDropdown>
                    ) : (
                      ''
                    )}
                    <button className="logout" onClick={logOut}>
                      Logout
                    </button>
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
