import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";

import { Navbar, Container, Nav, NavDropdown, Button, OverlayTrigger, Popover, Dropdown } from "react-bootstrap";
import { useEffect, useContext } from "react";
import { AuthContext } from "../../App";

import UserImg from "../../img/user.svg";

export default function Header() {
  const value = useContext(AuthContext);

  const [showProfile, setShowProfile] = useState(false);

  let navigate = useNavigate();
  useEffect(() => {
    value.setCurrentUser(JSON.parse(localStorage.getItem("user")));
    if (!value.token) {
      navigate("/login", { replace: true });
    }
    console.log(value.currentUser)
  }, []);

  function logOut() {
    localStorage.clear();
    value.setToken(null);
    value.setCurrentUser(null);
    navigate("/auth/login", { replace: true });
  }

  function handleShowProfile() {
    setShowProfile(!showProfile);
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
                    <Link to="/auth/login">Ingresar</Link>
                  </>
                ) : (
                  <>
                    <Link to="/classes">Clases</Link>
                    <NavDropdown title="Tienda" className="panel-ddown">
                      <NavDropdown.Item href="/store" className="dropdown-item"><span className="pi pi-box"></span>Productos</NavDropdown.Item>
                      <NavDropdown.Item href={'/store/cart/' + value.currentUser._id} className="dropdown-item">
                        <span className="pi pi-shopping-cart"></span>Carrito
                      </NavDropdown.Item>
                      <NavDropdown.Item href={'/store/purchases/' + value.currentUser._id} className="dropdown-item">
                        <span className="pi pi-history"></span>Historial
                      </NavDropdown.Item>
                    </NavDropdown>
                    {value.currentUser.role <= 2 && (
                      <NavDropdown title="Panel" className="panel-ddown">
                        {value.currentUser.role === 1 && (
                          <>
                            <NavDropdown.Item href="/admin/classes">
                              Clases
                            </NavDropdown.Item>
                            <NavDropdown.Item href="/panel/turnos">
                              Turnos
                            </NavDropdown.Item>
                          </>
                        )}
                        <NavDropdown.Item href="/admin/products">
                          Productos
                        </NavDropdown.Item>
                        {value.currentUser.role === 1 && (
                          <>
                            <NavDropdown.Item href="/Inscripciones">
                              Inscripciones
                            </NavDropdown.Item>
                            <NavDropdown.Item href="/Dashboard">
                              Dashboard
                            </NavDropdown.Item>
                          </>
                        )}
                      </NavDropdown>
                    )}
                    <Dropdown align="end">
                      <Dropdown.Toggle variant="light" className="d-flex align-items-center gap-2" id="dropdown-basic">
                        <span className="pi pi-user"></span>{value.currentUser.first_name}
                      </Dropdown.Toggle>

                      <Dropdown.Menu>
                        <Dropdown.Item href="/perfil" className="">Perfil</Dropdown.Item>
                        <Dropdown.Item href="/perfil/clases" className="">Mis clases</Dropdown.Item>
                        <Dropdown.Item variant="link" className="" onClick={logOut}>
                          Cerrar sesión
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
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
