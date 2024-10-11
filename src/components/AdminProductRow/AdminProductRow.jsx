import { useState } from 'react';
import './AdminProductRow.css';
import { Modal, Toast, ToastContainer } from "react-bootstrap";
import { Link } from 'react-router-dom';
import * as productosService from "../../services/productos.service";

export default function AdminProductRow({ props }) {
  const SERVER_URL = process.env.REACT_APP_SERVER_URL;
  const [productoEliminar, setProductoEliminar] = useState();
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = (productoSeleccionado) => { setShow(true); setProductoEliminar(productoSeleccionado) };

  function handleSelectedDelete(item) {
    setProductoEliminar(item);
  }

  function handleConfirmDelete(item) {
    productosService.remove(item._id).then((productos) => {
      props.refetch();
    });
  }

  return (
    <>
      <tr className="cont-admin-products-row">
        <td>
          <div className="d-flex gap-3 align-items-center justify-content-center">
            <Link to={"producto/id-" + props.item._id} aria-label="Editar">
              <span className="pi pi-pen-to-square text-primary"></span>
            </Link>
            <button
              onClick={() => { handleShow(); handleSelectedDelete(props.item); }}
              className="btn p-0"
              type="button"
              aria-label="Eliminar">
              <span className="pi pi-trash text-danger"></span>
            </button>
          </div>
        </td>
        <td><img src={SERVER_URL + "uploads/" + props.item.img} className="img-fluid rounded" alt={props.item.descripcion} /></td>
        <td>{props.item.title}</td>
        <td>{props.item.description}</td>
        <td>{props.item.material}</td>
        <td className="text-center">${props.item.price}</td>
        <td className="text-center">{props.item.estimated_delay}</td>
      </tr>
      <Modal show={show} onHide={handleClose} size="lg" variant="white" className="modal-delete">
        <Modal.Header className="modal-title" closeButton>
          <Modal.Title className="negritas">¿Seguro querés eliminar el producto "{productoEliminar?.nombre}"?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p><span className="negritas">Esta acción es irreversible</span></p>
        </Modal.Body>
        <Modal.Footer>
          <button
            onClick={() => { handleClose(); }}
            className="btn btn-link btn-close-link"
            type="button"
            data-toggle="tooltip"
            data-placement="top">
            <span>Cerrar</span>
          </button>
          <button
            onClick={() => { handleConfirmDelete(productoEliminar); handleClose(); }}
            className="btn btn-danger btn-eliminar"
            type="button"
            data-toggle="tooltip"
            data-placement="top">
            <span>Eliminar definitivamente</span>
          </button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

// export default Header;
