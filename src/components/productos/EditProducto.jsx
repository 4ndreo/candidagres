import "../css/Edit.css";
import "./EditProducto.css";
import React, { useEffect, useState, useContext } from "react";
import * as productosService from "../../services/productos.service";
import * as mediaService from "../../services/media.service";
import * as Constants from "../../Constants";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../App";

const imageMimeType = /image\/(png|jpg|jpeg)/i;

export function EditProducto({ title }) {
  const SERVER_URL = process.env.REACT_APP_SERVER_URL;
  const value = useContext(AuthContext);
  const [imageError, setImageError] = useState(null);
  const [file, setFile] = useState(null);
  const [fileDataURL, setFileDataURL] = useState(null);

  let navigate = useNavigate();
  const params = useParams();

  const [producto, setProducto] = useState({
    nombre: "",
    descripcion: "",
    demora_producto: 0,
    precio: 0,
    material: "",
    imagen: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    productosService
      .findById(params?.idProducto)
      .then((producto) => {
        setProducto(
          {
            nombre: producto.nombre,
            descripcion: producto.descripcion,
            demora_producto: producto.demora_producto,
            precio: producto.precio,
            material: producto.material,
            img: producto.img,
          }
        );
      })
      .catch((err) => setError(err.message));

    if (value.currentUser.role !== 1) {
      navigate("/", { replace: true });
    }
  }, []);

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
    console.log('imagen nueva')

  }, [file]);

  function handleSubmit(e) {
    e.preventDefault();
    productosService
      .update(params?.idProducto, producto)
      .then((data) => {
        if (file) {
          return mediaService.uploadImagen(file).then((nombreImg) => {
            productosService.update(params?.idProducto, { img: nombreImg }).then((data) => {
              navigate("/productos", { replace: true });
            });
          })
        } else {
          navigate("/productos", { replace: true });
        }
      });
  }

  function handleChange(e) {
    setProducto({ ...producto, [e.target.name]: e.target.value });
  }

  const changeHandler = (e) => {
    setImageError(null);
    const file = e.target.files[0];
    if (!file.type.match(imageMimeType)) {
      setImageError("El tipo de archivo no es válido");
      return;
    }
    setFile(file);
  }

  if (producto) {


    return (
      <main className="container edit-cont">
        <h1>Editar - {title}</h1>
        <form onSubmit={handleSubmit} className="form">
          <div className="mb-3">
          </div>
          <div className="mb-3">
            <label className="form-label">Nombre</label>
            <input
              type="text"
              name="nombre"
              value={producto.nombre}
              required
              onChange={(e) => handleChange(e)}
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Descripción</label>
            <input
              type="text"
              name="descripcion"
              value={producto.descripcion}
              required
              onChange={(e) => handleChange(e)}
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Demora esperada (en días)</label>
            <input
              type="number"
              name="demora_producto"
              value={producto.demora_producto}
              required
              onChange={(e) => handleChange(e)}
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Precio</label>
            <input
              type="number"
              name="precio"
              value={producto.precio}
              required
              onChange={(e) => handleChange(e)}
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Material</label>
            <input
              type="text"
              name="material"
              value={producto.material}
              required
              onChange={(e) => handleChange(e)}
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
          <div className="mb-3">
            {fileDataURL ?
              <p className="img-preview-wrapper">
                {<>
                  <label className="form-label d-block">Nueva imagen:</label>
                  <img src={fileDataURL} className="product-image img-fluid rounded-3" alt={producto.descripcion} />
                </>}
              </p> : <>
                <label className="form-label d-block">Imagen actual:</label>
                <img src={SERVER_URL + "uploads/" + producto.img} className="product-image img-fluid rounded-3" alt={producto.descripcion} />
              </>}
          </div>

          <button type="submit" className="btn btn-primary">
            Guardar producto
          </button>
        </form>
        {error && <p>{error}</p>}
      </main>
    );
  }
}
