import "./ViewProfileCard.css";

import UserImg from "../../../img/user.svg";
import { Link } from "react-router-dom";
import { Cloudinary } from "@cloudinary/url-gen";
import { auto } from "@cloudinary/url-gen/actions/resize";
import { autoGravity } from "@cloudinary/url-gen/qualifiers/gravity";
import { AdvancedImage } from "@cloudinary/react";

export default function ViewProfileCard({ props }) {
    const cld = new Cloudinary({ cloud: { cloudName: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME } });
    const img = cld
        .image(`profile/${props.data.image}`)
        .format('auto')
        .quality('auto')
        .resize(auto().gravity(autoGravity()));
    return (
        <div className="card card-ver-perfil-container">
            <Link to={"edit"} className="btn btn-primary edit-btn"><span className="pi pi-pen-to-square"></span></Link>
            <div className="user-card">
                <AdvancedImage className="avatar-img" cldImg={img} alt="Imagen de perfil del usuario" />
                <div className="user-info">

                    <h1>{props.data.first_name} {props.data.last_name}</h1>
                    <p>{props.data.email}</p>
                    <p>{props.data.document_type}: {props.data.id_document}</p>
                </div>
            </div>
        </div>
    );
}