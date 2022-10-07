import { Link, useNavigate } from "react-router-dom";
import "./Header.css";

import { Navbar, Container, Nav } from "react-bootstrap";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../App";
import Notifications from "../Petitions/Notifications"

import SocketIo from 'socket.io-client'

export default function Header() {
  const [authUser, setAuthUser] = useState({});
  const [error, setError] = useState("");

  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = SocketIo('http://localhost:2025', {
      transports: ['websocket']
    })
    setSocket(newSocket)

  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('getNotifications', (locationsList) => {
      })
    }
  }, [socket]);

  const value = useContext(AuthContext);

  let navigate = useNavigate();
  useEffect(() => {
    value.setCurrentUser(JSON.parse(localStorage.getItem("user")))
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
              EmergenciApp
            </Link>
            <Navbar.Toggle aria-controls="menu-nav" />
            <Navbar.Collapse id="menu-nav">
              <Nav className="nav-menu">
                {!value.token ? (
                  <>
                    <Link to="/login">Login</Link>
                    <Link to="/register">Registrarse</Link>
                  </>
                ) : (
                  <>
                    <Link to="/">Home</Link>
                    {value.currentUser?.role === 1 ? (
                      <>
                        <Link to="/panel">Panel</Link>
                        <Notifications socket={socket}></Notifications>
                      </>
                    ) : (
                      <>
                        <Link to="/myRequests">Mis Sugerencias</Link>
                      </>
                    )}
                    <button className="logout nav-menu navbar-nav" onClick={logOut}>
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
