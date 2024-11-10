import "./EditProfileCard.css";

import UserImg from "../../../img/user.svg";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import * as usersService from "../../../services/users.service";
import * as mediaService from "../../../services/media.service";
import { AuthContext } from "../../../App";

const imageMimeType = /image\/(png|jpg|jpeg)/i;

export default function EditProfileCard({props}) {
    const SERVER_URL = process.env.REACT_APP_SERVER_URL;
    let navigate = useNavigate();
    const value = useContext(AuthContext);

    const [user, setUser] = useState({
        name: props.data.name,
        email: props.data.email,
        imagen: props.data.imagen
    });
    const [imageError, setImageError] = useState(null);
    const [file, setFile] = useState(null);
    const [fileDataURL, setFileDataURL] = useState(null);

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
        // usersService
        //     .update(params?.id, user)
        //     .then((data) => {
        //         navigate("/perfil", { replace: true });
        //     });
        usersService
            .updateProfile(props.data.id, { name: user.name, imagen: user.imagen })
            .then((data) => {
                console.log('user', value.currentUser)
                if (file) {
                    return mediaService.uploadImagen(file).then((nombreImg) => {
                        console.log("nombreImg", nombreImg);
                        usersService.update(props.data?.id, { imagen: nombreImg }).then((data) => {
                            console.log('nombreImg', nombreImg)
                            localStorage.setItem("user", JSON.stringify({ ...value.currentUser, name: user.name, imagen: nombreImg }));
                            value.setCurrentUser({ ...value.currentUser, name: user.name, imagen: nombreImg });
                            navigate("/perfil", { replace: true });

                        });
                    })
                } else {
                    localStorage.setItem("user", JSON.stringify({ ...value.currentUser, name: user.name }));
                    value.setCurrentUser({ ...value.currentUser, name: user.name });
                    navigate("/perfil", { replace: true });
                }
            });
    }

    function handleChange(e) {
        setUser({ ...user, [e.target.name]: e.target.value });
    }

    const changeHandler = (e) => {
        console.log(e.target.files[0])
        setImageError(null);
        const file = e.target.files[0];
        if (!file.type.match(imageMimeType)) {
            setImageError("El tipo de archivo no es válido");
            return;
        }
        setFile(file);
    }

    return (
        <div className="card card-editar-perfil-container">
            <Link to="/profile" className="btn btn-link back-btn btn-icon"><span className="pi pi-angle-left"></span>Volver</Link>
            <img className="avatar-img" src={fileDataURL ? fileDataURL : (user.imagen ? SERVER_URL + "uploads/" + user.imagen : UserImg)} alt="Imagen de perfil del usuario" />
            <form onSubmit={handleSubmit} className="form">
                <div className="mb-3">
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
                </div>
                <div className="mb-3">
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
                </div>
                <button type="submit" className="btn btn-primary">
                    Guardar cambios
                </button>
            </form>
        </div>
    );
}