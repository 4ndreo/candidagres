import "./EditProfileCard.css";

import UserImg from "../../../img/user.svg";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import * as usersService from "../../../services/users.service";
import * as mediaService from "../../../services/media.service";
import { AuthContext } from "../../../App";
import { Cloudinary } from "@cloudinary/url-gen";
import { auto } from "@cloudinary/url-gen/actions/resize";
import { autoGravity } from "@cloudinary/url-gen/qualifiers/gravity";
import { AdvancedImage } from "@cloudinary/react";

const imageMimeType = /image\/(png|jpg|jpeg)/i;

export default function EditProfileCard({ props }) {
    const cld = new Cloudinary({ cloud: { cloudName: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME } });
    const img = cld
        .image(`profile/${props.data.image}`)
        .format('auto')
        .quality('auto')
        .resize(auto().gravity(autoGravity()));

    let navigate = useNavigate();
    const value = useContext(AuthContext);

    const [user, setUser] = useState({
        name: props.data.name,
        email: props.data.email,
        image: props.data.image
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
            .updateProfile(props.data._id, { name: user.name, image: user.image })
            .then((data) => {
                console.log('user', value.currentUser)
                if (file) {
                    return mediaService.uploadImagen(file).then((res) => {
                        usersService.update(props.data?.id, { image: res.result.display_name }).then((data) => {
                            localStorage.setItem("user", JSON.stringify({ ...value.currentUser, name: user.name, image: res.result.display_name }));
                            value.setCurrentUser({ ...value.currentUser, name: user.name, image: res.result.display_name });
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
            <AdvancedImage className="avatar-img" cldImg={img} alt="Imagen de perfil del usuario" />
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