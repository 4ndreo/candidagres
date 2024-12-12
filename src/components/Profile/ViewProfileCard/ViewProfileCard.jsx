import "./ViewProfileCard.css";

import { Link } from "react-router-dom";
import { Cloudinary } from "@cloudinary/url-gen";
import { auto } from "@cloudinary/url-gen/actions/resize";
import { autoGravity } from "@cloudinary/url-gen/qualifiers/gravity";
import { AdvancedImage } from "@cloudinary/react";
import { DateTime } from "luxon";
import { defaultImage } from "@cloudinary/url-gen/actions/delivery";

export default function ViewProfileCard({ props }) {
    const cld = new Cloudinary({ cloud: { cloudName: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME } });
    const img = cld
        .image(props?.data?.image ? `profile/${props.data.image}` : 'placeholder-image')
        .format('auto')
        .quality('auto')
        .resize(auto().gravity(autoGravity()))
        .delivery(defaultImage("placeholder-image.jpg"));
    return (
        <div className="card card-view-profile-container">
            <Link to={"edit"} className="btn btn-primary edit-btn"><span className="pi pi-pen-to-square"></span></Link>
            <div className="user-card">
                <AdvancedImage className="avatar-img" cldImg={img} alt="Imagen de perfil del usuario" />
                <div className="user-info">

                    <h1>{props.data.first_name} {props.data.last_name}</h1>
                    <p>{props.data.email}</p>
                    <p>{props.data.document_type}: {props.data.id_document}</p>
                    <p>Fecha de nacimiento: {DateTime.fromISO(props.data.birth_date).toFormat('dd-MM-yyyy')}</p>
                </div>
            </div>
        </div>
    );
}