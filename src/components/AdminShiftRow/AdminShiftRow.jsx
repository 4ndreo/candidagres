import { useState } from 'react';
import './AdminShiftRow.css';
import { Modal } from "react-bootstrap";
import { Link } from 'react-router-dom';
import * as shiftsService from "../../services/shifts.service";
import * as mediaService from "../../services/media.service";
import { weekdays } from '../../utils/utils';

export default function AdminShiftRow({ props }) {
  const SERVER_URL = process.env.REACT_APP_SERVER_URL;

  const [deleting, setDeleting] = useState();
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = (selected) => { setShow(true); setDeleting(selected) };

  function handleSelectedDelete(item) {
    console.log(item)
    setDeleting(item);
  }

  async function handleConfirmDelete(item) {
    try {
      await shiftsService.remove(item._id)
      props.setShowToast({ show: true, title: 'Éxito', message: 'La comisión se ha eliminado', variant: 'success', position: 'top-end' });
      props.refetch();
    } catch (err) {
      props.setShowToast({ show: true, title: 'Error al eliminar la comisión', message: 'Inténtelo de nuevo más tarde', variant: 'danger', position: 'top-end' });

    }
  }

  return (
    <>
      <tr className="cont-admin-shifts-row">
        {props.cols.map((col, index) => {
          switch (col.type) {
            case 'actions':
              return (
                <td key={index}>
                  <div className="d-flex gap-3 align-items-center justify-content-center">
                    {props.showEdit && <Link to={props.item._id} aria-label="Editar">
                      <span className="pi pi-pen-to-square text-primary"></span>
                    </Link>}
                    {props.showDelete && <button
                      onClick={() => { handleShow(); handleSelectedDelete(props.item); }}
                      className="btn p-0"
                      type="button"
                      aria-label="Eliminar">
                      <span className="pi pi-trash text-danger"></span>
                    </button>}
                  </div>
                </td>
              )
            case 'string':
              return <td key={index} className="text-left"><span className="d-flex justify-content-center">{props.item[col.field]}</span></td>
            case 'number':
              return <td key={index} className="text-center">{parseInt(props.item[col.field])}</td>
            case 'currency':
              return <td key={index} className="text-center">${parseInt(props.item[col.field])}</td>
            case 'days':
              return (
                <td key={index} className="text-center">{weekdays.filter(day => props.item[col.field].includes(day.id)).map(day => day.name).join(', ')}</td>
              )
            case 'image':
              return (<td key={index} className="text-center"><img src={SERVER_URL + "uploads/" + props.item[col.field]} className="img-fluid rounded" alt={props.item.descripcion} /></td>)
            case 'relation':
              // return JSON.stringify(props.item[col.field])
              return (props.item[col.field].length > 0 ? <td key={index} className="text-center">{props.item[col.field][0][[col.relationField]]}</td> : <td key={index} className="text-center"></td>)
            // case 'date':
            default:
              return (<td key={index} className="text-center">{props.item[col.field]}</td>)
          }
        }
        )}
      </tr>
      <Modal show={show} onHide={handleClose} size="lg" variant="white" className="modal-delete">
        <Modal.Header className="modal-title" closeButton>
          <Modal.Title className="negritas">¿Seguro querés eliminar "{deleting?.title}"?</Modal.Title>
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
            onClick={() => { handleConfirmDelete(deleting); handleClose(); }}
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
