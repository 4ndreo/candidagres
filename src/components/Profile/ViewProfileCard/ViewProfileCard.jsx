import "./ViewProfileCard.css";

import UserImg from "../../../img/user.svg";
import { Link } from "react-router-dom";

export default function ViewProfileCard({ props }) {
    const SERVER_URL = process.env.REACT_APP_SERVER_URL;
    return (
        <div className="card card-ver-perfil-container">
            <Link to={"edit"} className="btn btn-primary edit-btn"><span className="pi pi-pen-to-square"></span></Link>
            <div className="user-card">
                <img className="avatar-img" src={props.data.imagen ? (SERVER_URL + "uploads/" + props.data.imagen) : UserImg} alt="Imagen de perfil del usuario" />
                <div className="user-info">

                    <h1>{props.data.first_name} {props.data.last_name}</h1>
                    <p>{props.data.email}</p>
                    <p>{props.data.document_type}: {props.data.id_document}</p>
                </div>
            </div>
        </div>
    );
}