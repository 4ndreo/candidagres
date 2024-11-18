import "./EditProfileCard.css";

import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import * as usersService from "../../../services/users.service";
import { AuthContext } from "../../../App";

// Cloudinary
import { Cloudinary } from "@cloudinary/url-gen";
import { auto } from "@cloudinary/url-gen/actions/resize";
import { autoGravity } from "@cloudinary/url-gen/qualifiers/gravity";
import { AdvancedImage } from "@cloudinary/react";

export default function EditProfileCard({ props }) {
    const cld = new Cloudinary({ cloud: { cloudName: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME } });
    const img = cld
        .image(`profile/${props.data.image}`)
        .format('auto')
        .quality('auto')
        .resize(auto().gravity(autoGravity()));

    let navigate = useNavigate();
    const value = useContext(AuthContext);

    const [file, setFile] = useState(null);
    const [fileDataURL, setFileDataURL] = useState(null);

    const [form, setForm] = useState({});
    const [errors, setErrors] = useState({});

    useEffect(() => {
        let fileReader, isCancel = false;
        if (file) {
            fileReader = new FileReader();
            fileReader.onload = (e) => {
                const { result } = e.target;
                if (result && !isCancel) {
                    setFileDataURL(result)
                }
            }
            fileReader.readAsDataURL(file);
        }
        return () => {
            isCancel = true;
            if (fileReader && fileReader.readyState === 1) {
                fileReader.abort();
            }
        }

    }, [file]);

    function handleSubmit(e) {
        e.preventDefault();
        let body = new FormData();
        Object.entries(form).forEach(([key, value]) => {
            body.append(key, value);
        });
        if (file) body.append('file', file);
        usersService
            .updateProfile(props.data._id, body)
            .then((resp) => {
                if (!resp.err) {
                    localStorage.setItem("user", JSON.stringify(resp[0]));
                    value.setCurrentUser(resp[0]);
                    navigate("/profile", { replace: true });
                } else {
                    setErrors(resp.err);
                }
            });
    }

    function handleChange(e) {
        const { name, value } = e.target;
        setForm({
            ...form,
            [name]: value,
        });
        setErrors({
            ...errors,
            [name]: '',
        });
    }

    const changeHandler = (e) => {
        const { name } = e.target;

        setErrors({
            ...errors,
            [name]: '',
        });
        const file = e.target.files[0];
        setFile(file);
    }

    return (
        <div className="card cont-edit-profile-card">
            <Link to="/profile" className="btn btn-link back-btn btn-icon"><span className="pi pi-angle-left"></span>Volver</Link>
            <AdvancedImage className="avatar-img" cldImg={img} alt="Imagen de perfil del usuario" />
            <form onSubmit={handleSubmit} noValidate>
                <div className="d-flex flex-column flex-sm-row justify-content-between gap-3">

                    <div className="d-flex flex-column w-100">
                        <label htmlFor="first_name">Nombre</label>
                        <input
                            className={"form-control w-100 " + (errors.first_name ? 'is-invalid' : '')}
                            id="first_name"
                            name="first_name"
                            type="text"
                            defaultValue={props.data.first_name}
                            onChange={(e) => handleChange(e)}
                            required
                        />
                        <small className="form-text text-danger">
                            {errors.first_name}
                        </small>
                    </div>
                    <div className="d-flex flex-column w-100">
                        <label htmlFor="last_name">Apellido</label>
                        <input
                            className={"form-control w-100 " + (errors.last_name ? 'is-invalid' : '')}
                            id="last_name"
                            name="last_name"
                            type="text"
                            defaultValue={props.data.last_name}
                            onChange={(e) => handleChange(e)}
                            required
                        />
                        <small className="form-text text-danger">
                            {errors.last_name}
                        </small>
                    </div>
                </div>
                <div className="d-flex flex-sm-row justify-content-between gap-3">

                    <div className="d-flex flex-column w-25">
                        <label htmlFor="document_type">Tipo</label>
                        <select
                            className={"form-control w-100 " + (errors.document_type ? 'is-invalid' : '')}
                            id="document_type"
                            name="document_type"
                            defaultValue={props.data.document_type}
                            onChange={(e) => handleChange(e)}
                            required
                        >
                            <option disabled value="0">Elegir...</option>
                            <option>DNI</option>
                            <option>CUIL</option>
                            <option>Pasaporte</option>
                        </select>
                        <small className="form-text text-danger">
                            {errors.document_type}
                        </small>
                    </div>
                    <div className="d-flex flex-column w-100">
                        <label htmlFor="id_document">Documento</label>
                        <input
                            className={"form-control w-100 " + (errors.id_document ? 'is-invalid' : '')}
                            id="id_document"
                            name="id_document"
                            type="text"
                            defaultValue={props.data.id_document}
                            onChange={(e) => handleChange(e)}
                            required
                        />
                        {errors.id_document ?
                            <small className="form-text text-danger">
                                {errors.id_document}
                            </small>
                            :
                            ((form.document_type === "DNI" &&
                                <small className="form-text text-muted">
                                    Puede tener 7 u 8 números.
                                </small>) ||
                                (form.document_type === "CUIL" &&
                                    <small className="form-text text-muted">
                                        Debe tener el formato XX-XXXXXXXX-X.
                                    </small>))
                        }

                    </div>

                </div>
                <div className="d-flex flex-column">
                    <label htmlFor="birth_date">Fecha de nacimiento</label>
                    <input
                        className={"form-control w-100 " + (errors.birth_date ? 'is-invalid' : '')}
                        id="birth_date"
                        name="birth_date"
                        type="date"
                        defaultValue={props.data.birth_date}
                        onChange={(e) => handleChange(e)}
                        required
                    />
                    <small className="form-text text-danger">
                        {errors.birth_date}
                    </small>
                </div>
                {/* <div className="mb-3">
                    <label className="form-label">Nombre y apellido</label>
                    <input
                        type="text"
                        name="name"
                        value={user.name}
                        onChange={(e) => handleChange(e)}
                        required
                        className="form-control"
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={user.email}
                        onChange={(e) => handleChange(e)}
                        disabled
                        className="form-control"
                    />
                </div> */}
                {/* <div className="mb-3">
                    <label className="form-label">Subir Imagen:</label>
                    <input
                        type="file"
                        accept='.png, .jpg, .jpeg'
                        onChange={changeHandler}
                        // onChange={handleImagenChange}
                        className="form-control"
                        name="imagenProducto"
                        id="imagenProducto"
                    />
                    {imageError && <p>{imageError}</p>}
                </div> */}
                <div>
                    <label htmlFor="img" className="form-label">Cambiar Imagen:</label>
                    <input
                        className={"form-control w-100 " + (errors.img ? 'is-invalid' : '')}
                        id="img"
                        type="file"
                        name="img"
                        accept='.png, .jpg, .jpeg'
                        onChange={changeHandler}
                    />
                    <small className="form-text text-danger">
                        {errors.img}
                    </small>
                </div>
                <div>
                    <div className="img-preview-wrapper">
                        {fileDataURL && file ?
                            <>
                                <label className="form-label d-block">Nueva imagen:</label>
                                <img src={fileDataURL} className="preview-image img-fluid rounded-3" alt={form.description} />
                            </>
                            :

                            null

                        }
                    </div>
                </div>
                <button type="submit" className="btn btn-primary">
                    Guardar cambios
                </button>
            </form>
        </div>
    );
}