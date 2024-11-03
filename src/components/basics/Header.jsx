import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";

import { Navbar, Container, Nav, NavDropdown, Button, OverlayTrigger, Popover, Dropdown, Offcanvas } from "react-bootstrap";
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
              Cándida Gres
            </Link>
            <Navbar.Toggle aria-controls="menu-nav" />
            <Navbar.Offcanvas id="menu-nav" placement="end">
              <Offcanvas.Header className="navbar-base-offcanvas" closeButton closeVariant="white">
                <Offcanvas.Title>
                    Cándida Gres
                </Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body className="me-auto me-lg-0 ms-lg-auto">
                <Nav className="nav-menu align-items-start align-items-lg-center">
                  <Link to="/">Inicio</Link>
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
                              <NavDropdown.Item href="/admin/shifts">
                                Comisiones
                              </NavDropdown.Item>
                              <NavDropdown.Item href="/admin/enrollments">
                                Inscripciones
                              </NavDropdown.Item>
                              <NavDropdown.Item href="/Dashboard">
                                Dashboard
                              </NavDropdown.Item>
                            </>
                          )}
                          <NavDropdown.Item href="/admin/products">
                            Productos
                          </NavDropdown.Item>
                        </NavDropdown>
                      )}
                      <Dropdown align="end">
                        <Dropdown.Toggle variant="light" className="d-flex align-items-center gap-2" id="dropdown-basic">
                          <span className="pi pi-user"></span>{value.currentUser.first_name}
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                          <Dropdown.Item href="/profile" className="">Perfil</Dropdown.Item>
                          <Dropdown.Item href="/perfil/clases" className="">Mis clases</Dropdown.Item>
                          <Dropdown.Item variant="link" className="" onClick={logOut}>
                            Cerrar sesión
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </>
                  )}
                </Nav>
              </Offcanvas.Body>
            </Navbar.Offcanvas>
          </Container>
        </Navbar>
      </header>
    );
  }
}

// export default Header;
