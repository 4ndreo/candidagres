import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";

import { Navbar, Container, Nav, NavDropdown, Dropdown, Offcanvas } from "react-bootstrap";
import { useContext } from "react";
import { AuthContext } from "../../App";


export default function Header() {
  const value = useContext(AuthContext);

  const [showOffcanvas, setShowOffcanvas] = useState(false);

  let navigate = useNavigate();

  function logOut() {
    localStorage.clear();
    value.setToken(null);
    value.setCurrentUser(null);
    navigate("/auth/login", { replace: true });
  }

  const offcanvasRef = useRef(null);

  if ((!value.token && !value.currentUser) || value.currentUser) {
    return (
      <header className="navbar-base">
        <Navbar className="w-100 navbar-dark" expand="lg">
          <Container>
            <Link className="brand" to="/">
              Cándida Gres
            </Link>
            <Navbar.Toggle aria-controls="menu-nav" onClick={() => setShowOffcanvas(prev => !prev)} />
            <Navbar.Offcanvas id="menu-nav" placement="end"  ref={offcanvasRef} show={showOffcanvas}>
              <Offcanvas.Header className="navbar-base-offcanvas" closeButton closeVariant="white" onHide={() => setShowOffcanvas(prev => !prev)}>
                <Offcanvas.Title className="brand">
                    Cándida Gres
                </Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body className="me-auto me-lg-0 ms-lg-auto">
                <Nav className="nav-menu align-items-start align-items-lg-center">
                  <Link to="/" onClick={() => setShowOffcanvas(false)}>Inicio</Link>
                  {!value.token ? (
                    <>
                      <Link to="/auth/login" onClick={() => setShowOffcanvas(false)}>Ingresar</Link>
                    </>
                  ) : (
                    <>
                      <Link to="/classes" onClick={() => setShowOffcanvas(false)}>Clases</Link>
                      <NavDropdown title="Tienda" className="panel-ddown">
                        <NavDropdown.Item as={Link} to="/store" onClick={() => setShowOffcanvas(false)} className="dropdown-item submenu-item"><span className="pi pi-box"></span>Productos</NavDropdown.Item>
                        <NavDropdown.Item as={Link} to={'/store/cart/' + value.currentUser._id} onClick={() => setShowOffcanvas(false)} className="dropdown-item submenu-item">
                          <span className="pi pi-shopping-cart"></span>Carrito
                        </NavDropdown.Item>
                        <NavDropdown.Item as={Link} to={'/store/purchases/' + value.currentUser._id} onClick={() => setShowOffcanvas(false)} className="dropdown-item submenu-item">
                          <span className="pi pi-history"></span>Historial
                        </NavDropdown.Item>
                      </NavDropdown>
                      {value.currentUser.role <= 2 && (
                        <NavDropdown title="Panel" className="panel-ddown">
                          {value.currentUser.role === 1 && (
                            <>
                              <NavDropdown.Item as={Link} to="/admin/classes" onClick={() => setShowOffcanvas(false)} className="dropdown-item submenu-item">
                                Clases
                              </NavDropdown.Item>
                              <NavDropdown.Item as={Link} to="/admin/shifts" onClick={() => setShowOffcanvas(false)} className="dropdown-item submenu-item">
                                Comisiones
                              </NavDropdown.Item>
                              <NavDropdown.Item as={Link} to="/admin/enrollments" onClick={() => setShowOffcanvas(false)} className="dropdown-item submenu-item">
                                Inscripciones
                              </NavDropdown.Item>
                              <NavDropdown.Item as={Link} to="/Dashboard" onClick={() => setShowOffcanvas(false)} className="dropdown-item submenu-item">
                                Dashboard
                              </NavDropdown.Item>
                            </>
                          )}
                          <NavDropdown.Item as={Link} to="/admin/products" onClick={() => setShowOffcanvas(false)} className="dropdown-item submenu-item">
                            Productos
                          </NavDropdown.Item>
                        </NavDropdown>
                      )}
                      <Dropdown align="end">
                        <Dropdown.Toggle variant="light" className="d-flex align-items-center gap-2" id="dropdown-basic">
                          <span className="pi pi-user"></span>{value.currentUser.first_name}
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                          <Dropdown.Item as={Link} to="/profile" onClick={() => setShowOffcanvas(false)} className="dropdown-item submenu-item">Perfil</Dropdown.Item>
                          <Dropdown.Item as={Link} to="/perfil/clases" onClick={() => setShowOffcanvas(false)} className="dropdown-item submenu-item">Mis clases</Dropdown.Item>
                          <Dropdown.Item variant="link" onClick={() => {logOut(); setShowOffcanvas(false)}} className="dropdown-item submenu-item">
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
