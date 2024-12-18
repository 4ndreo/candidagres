import { Link } from "react-router-dom";
import "./Footer.css"
import { HashLink } from "react-router-hash-link";
import { useContext } from "react";
import { AuthContext } from "../../App";

export default function Footer() {
  const context = useContext(AuthContext);

  return (
    <footer className="footer d-flex py-5">
      <div className="container d-flex flex-column flex-lg-row justify-content-between gap-4 footer-cont">
        <div className="contact">
          <ul className="p-0 d-flex flex-column gap-2 w-75">
            <li className="d-flex align-items-center gap-2"><span className="pi pi-map-marker"></span><span><span className="negritas">Taller:</span> Av del Puerto 215, Piso 6 Of. 619, Bahía Grande, Nordelta Tigre</span></li>
            <li className="d-flex align-items-center gap-2"><span className="pi pi-whatsapp"></span><span><span className="negritas">Whatsapp:</span> 11 6826-5868</span></li>
            <li className="d-flex align-items-center gap-2"> <span className="pi pi-instagram"></span><span><span className="negritas">Instagram:</span> <a className="decoration-none" href='https://www.instagram.com/candidagres/' target="_blank" rel="noreferrer">candidagres</a></span></li>
          </ul>
        </div>
        <div className="navigation">
          <ul className="">
            {/* <ul className="d-flex gap-5 flex-wrap justify-content-between"> */}
            <li><span className="negritas">Inicio</span>
              <ul>

                <li><HashLink to="/#workshop">Taller</HashLink></li>
                <li><HashLink to="/#classes">Clases</HashLink></li>
                <li><HashLink to="/#students">Alumnos</HashLink></li>
                <li><HashLink to="/#contact">Contacto</HashLink></li>
              </ul>
            </li>
            {context.token ? (
              <>
                <li><span className="negritas">Clases</span>
                  <ul>
                    <li><Link to="/classes">Todas las clases</Link></li>
                    <li><Link to="/profile#myEnrollmentsList">Mis inscripciones</Link></li>
                  </ul>
                </li>
                <li><span className="negritas">Tienda</span>
                  <ul>
                    <li><Link to="/store">Productos</Link></li>
                    <li><Link to="/store/cart/">Carrito</Link></li>
                    <li><Link to={"/store/purchases/" + context.currentUser._id}>Historial</Link></li>
                  </ul>
                </li>
                <li><span className="negritas">Perfil</span>
                  <ul>
                    <li><Link to="/profile">Ver</Link></li>
                    <li><Link to="/profile/edit">Editar</Link></li>
                  </ul>
                </li>
              </>
            ) :
              <li><span className="negritas">Ingresar</span>
                <ul>
                  <li><Link to="/auth/login">Iniciar sesión</Link></li>
                  <li><Link to="/auth/register">Registrarse</Link></li>
                </ul>
              </li>

            }
          </ul>
        </div>

      </div>
    </footer>
  );
}

// export default Header;
