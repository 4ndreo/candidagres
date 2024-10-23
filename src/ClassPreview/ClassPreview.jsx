import "./ClassPreview.css";

import { Link } from "react-router-dom";

export default function ClassPreview({ props }) {
    return (
        <div className="card-body card-class-preview-cont">
            <h2 className="card-title text-truncate">{props.item.title}</h2>
            <p className="card-text card-description">{props.item.description}</p>
            <Link to={"shifts/" + props.item._id} className="btn btn-primary btn-icon"><span className="pi pi-clock"></span>Ver horarios</Link>
        </div>
    );
}