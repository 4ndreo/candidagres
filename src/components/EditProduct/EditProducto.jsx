import "../css/Edit.css";
import "./EditProducto.css";
import React, { useEffect, useState, useContext } from "react";
import * as productosService from "../../services/productos.service";
import * as mediaService from "../../services/media.service";
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

  const [product, setProducto] = useState({
    title: "",
    description: "",
    estimated_delay: 0,
    price: 0,
    material: "",
    img: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    productosService
      .findById(params?.idProducto)
      .then((producto) => {
        delete producto._id
        setProducto(producto);
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

  }, [file]);

  function handleSubmit(e) {
    e.preventDefault();
    productosService
      .update(params?.idProducto, product)
      .then((data) => {
        if (file) {
          return mediaService.uploadImagen(file).then((nombreImg) => {
            productosService.update(params?.idProducto, { img: nombreImg }).then((data) => {
              navigate("/admin/products", { replace: true });
            });
          })
        } else {
          navigate("/admin/products", { replace: true });
        }
      });
  }

  function handleChange(e) {
    setProducto({ ...product, [e.target.name]: !isNaN(parseInt(e.target.value)) ? parseInt(e.target.value) : e.target.value.trim() });
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

  if (product) {


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
              name="title"
              defaultValue={product.title}
              required
              onChange={(e) => handleChange(e)}
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Descripción</label>
            <input
              type="text"
              name="description"
              defaultValue={product.description}
              required
              onChange={(e) => handleChange(e)}
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Demora esperada (en días)</label>
            <input
              type="number"
              name="estimated_delay"
              defaultValue={product.estimated_delay}
              required
              onChange={(e) => handleChange(e)}
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Precio</label>
            <input
              type="number"
              name="price"
              defaultValue={product.price}
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
              defaultValue={product.material}
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
                  <img src={fileDataURL} className="product-image img-fluid rounded-3" alt={product.descripcion} />
                </>}
              </p> : <>
                <label className="form-label d-block">Imagen actual:</label>
                <img src={SERVER_URL + "uploads/" + product.img} className="product-image img-fluid rounded-3" alt={product.descripcion} />
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
