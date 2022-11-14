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
        <Navbar className="w-100" expand="lg">
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
                    <Link to="/perfil">Perfil</Link>
                  {value.currentUser.role === 1 ? (
                    <NavDropdown title="Panel" className="panel-ddown">
                      <Link to="/cursos" className="dropdown-item">
                        Cursos
                      </Link>
                      <Link to="/turnos" className="dropdown-item">
                        Turnos
                      </Link>
                      <Link to="/Inscripciones" className="dropdown-item">
                        Inscripciones
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
