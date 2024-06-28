import "./ClaseDisponible.css";

import UserImg from "../../../img/user.svg";
import { Link } from "react-router-dom";

export function ClaseDisponible(data) {
    return (
        <div class="card-body card-clase-disponible-container">
            <h2 class="card-title">{data.data.nombre}</h2>
            <p class="card-subtitle mb-2 text-body-secondary negritas">Precio: ${data.data.precio}</p>
            <p class="card-text">{data.data.descripcion}</p>
            <Link to={"/turnos/turno/ver-" + data.data._id} className="btn btn-primary btn-icon"><span className="pi pi-eye"></span>Ver turnos disponibles</Link>
        </div>
    );
}