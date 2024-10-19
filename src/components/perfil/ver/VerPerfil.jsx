import "./VerPerfil.css";

import UserImg from "../../../img/user.svg";
import { Link } from "react-router-dom";

export function VerPerfil(data) {

    const SERVER_URL = process.env.REACT_APP_SERVER_URL;
    return (
        <div className="card card-ver-perfil-container">
            <Link to={"editar/" + data.data._id} className="btn btn-primary edit-btn"><span className="pi pi-pen-to-square"></span></Link>
            <div className="user-card">
                <img className="avatar-img" src={data.data.imagen ? (SERVER_URL + "uploads/" + data.data.imagen) : UserImg} alt="Imagen de perfil del usuario" />
                <div className="user-info">

                    <h1>{data.data.first_name} {data.data.last_name}</h1>
                    <p>{data.data.email}</p>
                    <p>{data.data.document_type}: {data.data.id_document}</p>
                </div>
            </div>
        </div>
    );
}