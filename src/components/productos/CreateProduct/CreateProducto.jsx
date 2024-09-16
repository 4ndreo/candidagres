import React, { useEffect, useState, useContext } from "react";
import * as productosService from "../../../services/productos.service";
import * as mediaService from "../../../services/media.service";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../../App";
import { uploadImagen } from "../../../services/productos.service";

const imageMimeType = /image\/(png|jpg|jpeg)/i;

export function CreateProducto({ title }) {
  const SERVER_URL = process.env.REACT_APP_SERVER_URL;
  const value = useContext(AuthContext);

  const [imageError, setImageError] = useState(null);
  const [file, setFile] = useState(null);
  const [fileDataURL, setFileDataURL] = useState(null);

  let navigate = useNavigate();

  const [producto, setProducto] = useState({
    nombre: "",
    descripcion: "",
    demora_producto: 0,
    precio: 0,
    material: "",
    imagen: "",
  });
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [demora_producto, setDemora] = useState(0);
  const [precio, setPrecio] = useState(0);
  const [material, setMaterial] = useState('');
  const [imagen, setImagen] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (value.currentUser.role !== 1) {
      navigate("/", { replace: true });
    }
    setMaterial("Gres")
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

  }, [file]);

  function handleSubmit(e) {
    e.preventDefault();
    productosService
      .create(producto)
      .then((producto) => {
        console.log(producto)
        if (file) {
          return mediaService.uploadImagen(file).then((nombreImg) => {
            productosService.update(producto._id, { img: nombreImg }).then((data) => {
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

  // const handleImagenChange = (event) => {
  //   const archivo = event.target.files[0];
  //   setImagen(archivo);
  //   console.log(archivo)
  // };

  return (
    <main className="container edit-cont">
      <h1>Crear - {title}</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Nombre del producto</label>
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
          <label className="form-label">Ingrese una breve descripción del producto</label>
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
          <label className="form-label">¿En cuantos dias estimas la entrega?</label>
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
          <label className="form-label">¿Cuanto cuesta el producto?</label>
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
          <label className="form-label">¿De que material esta hecho?</label>
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
            </p> : null}
        </div>
        <button type="submit" className="btn btn-primary">
          Guardar producto
        </button>
      </form>
    </main>
  );
}
