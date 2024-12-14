import "./BackBtn.css";
import { Link } from "react-router-dom";

export default function BackBtn({ props }) {
    return (
        <div className="mb-4">
            <Link to={props.url} className={"btn-link back-btn btn-icon " + props.customClass}><span className="pi pi-angle-left"></span>Volver</Link>
        </div>)
}