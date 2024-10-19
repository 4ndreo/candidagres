import "./FormProduct.css";
import React, { useEffect, useState } from "react";
import * as productosService from "../../services/productos.service";
import * as mediaService from "../../services/media.service";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../basics/Loader";
import CustomToast from "../basics/CustomToast/CustomToast";

const imageMimeType = /image\/(png|jpg|jpeg)/i;

export function FormProduct({ props }) {
  const SERVER_URL = process.env.REACT_APP_SERVER_URL;
  const [imageError, setImageError] = useState(null);
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
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
  const [showToast, setShowToast] = useState(null);
  const [error, setError] = useState(null);

  async function fetchProduct(id) {
    setIsLoading(true);

    productosService
      .findById(id)
      .then((producto) => {
        delete producto._id
        setProducto(producto);
      })
      .catch((err) => setError(err))
      .finally(() => setIsLoading(false));
  }

  useEffect(() => {
    if (params?.id) {
      fetchProduct(params?.id);
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
    if (params?.id) {
      productosService
        .update(params?.id, {
          title: product.title,
          description: product.description,
          estimated_delay: parseInt(product.estimated_delay),
          price: parseInt(product.price),
          material: product.material,
        })
        .then(() => {
          if (file) {
            return mediaService.uploadImagen(file).then((imgName) => {
              productosService.update(params?.id, { img: imgName }).then(() => {
                navigate("/admin/products", { replace: true });
              });
            })
          } else {
            navigate("/admin/products", { replace: true });
          }
        }).catch((err) => setShowToast({ show: true, title: 'Error al modificar el producto', message: 'Inténtelo de nuevo más tarde', variant: 'danger', position: 'top-end' }));

    } else {
      productosService
        .create({
          title: product.title,
          description: product.description,
          estimated_delay: parseInt(product.estimated_delay),
          price: parseInt(product.price),
          material: product.material,
        })
        .then((producto) => {
          if (file) {
            return mediaService.uploadImagen(file).then((nombreImg) => {
              productosService.update(producto._id, { img: nombreImg }).then((data) => {
                navigate("/admin/products", { replace: true });
              });
            })
          } else {
            navigate("/admin/products", { replace: true });
          }
        }).catch((err) => setShowToast({ show: true, title: 'Error al crear el producto', message: 'Inténtelo de nuevo más tarde', variant: 'danger', position: 'top-end' }));
    }
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

  const renderError = () => {
    return (
      <div className="alert alert-danger" role="alert">
        {error.message}
      </div>
    )
  }
  if (isLoading) {
    return <Loader></Loader>
  }

  // if (product) {
  return (
    <main className="container edit-cont">
      <h1>{params?.id ? 'Editar' : 'Crear'} - {props.title}</h1>
      {error ? renderError() :
        <form onSubmit={handleSubmit} className="form">
          <div className="mb-3">
          </div>
          <div className="mb-3">
            <label htmlFor="title" className="form-label">Nombre</label>
            <input
              type="text"
              id="title"
              name="title"
              placeholder="Elegí un título llamativo"
              defaultValue={product.title}
              required
              onChange={(e) => handleChange(e)}
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="description" className="form-label">Descripción</label>
            <textarea
              rows={4}
              id="description"
              type="text"
              name="description"
              placeholder="Redactá una descricpión detallada sobre tu producto. Podés incluir detalles de uso, materiales, etc."
              defaultValue={product.description}
              required
              onChange={(e) => handleChange(e)}
              className="form-control"
            ></textarea>
          </div>
          <div className="d-flex flex-column flex-md-row gap-3">

            <div className="mb-3 w-100">
              <label htmlFor="estimated_delay" className="form-label">Demora esperada</label>
              <div className="input-group mb-3">

                <input
                  id="estimated_delay"
                  type="number"
                  name="estimated_delay"
                  value={parseInt(product.estimated_delay)}
                  required
                  onChange={(e) => handleChange(e)}
                  className="form-control"
                />
                <div className="input-group-append">
                  <span className="input-group-text">días</span>
                </div>
              </div>

            </div>
            <div className="mb-3 w-100">
              <label htmlFor="price" className="form-label">Precio</label>
              <div className="input-group mb-3">
                <div className="input-group-prepend">
                  <span className="input-group-text">$</span>
                </div>
                <input
                  id="price"
                  type="number"
                  name="price"
                  value={parseInt(product.price)}
                  required
                  onChange={(e) => handleChange(e)}
                  className="form-control"
                />
                <div className="input-group-append">
                  <span className="input-group-text">.00</span>
                </div>
              </div>
            </div>
            <div className="mb-3 w-100">
              <label htmlFor="material" className="form-label">Material</label>
              <input
                id="material"
                type="text"
                name="material"
                defaultValue={product.material}
                required
                onChange={(e) => handleChange(e)}
                className="form-control"
              />
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="productImage" className="form-label">Subir Imagen:</label>
            <input
              id="productImage"
              type="file"
              name="productImage"
              accept='.png, .jpg, .jpeg'
              onChange={changeHandler}
              // onChange={handleImagenChange}
              className="form-control"
            />
            {imageError && <p>{imageError}</p>}
          </div>
          <div className="mb-3">
            <div className="img-preview-wrapper">
              {fileDataURL ?
                <>
                  <label className="form-label d-block">Nueva imagen:</label>
                  <img src={fileDataURL} className="product-image img-fluid rounded-3" alt={product.descripcion} />
                </>
                :

                params?.id &&
                <>
                  <label className="form-label d-block">Imagen actual:</label>
                  <img src={SERVER_URL + "uploads/" + product.img} className="product-image img-fluid rounded-3" alt={product.descripcion} />
                </>

              }
            </div>
          </div>

          <button type="submit" className="btn btn-primary">
            Guardar producto
          </button>
        </form>
      }
      <CustomToast props={{ data: showToast, setShowToast: setShowToast }} />

    </main>
  );
  // }
}
