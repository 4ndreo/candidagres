import "./ConfirmDeleteModal.css";
import Modal from 'react-bootstrap/Modal';

export function ConfirmDeleteModal({show, onHide, handleClose, handleConfirmDelete, title, message, cancelButton, confirmButton}) {

    return (
        <Modal show={show} onHide={onHide} size="lg" variant="white" className="modal-delete">
            <Modal.Header className="modal-title" closeButton>
                <Modal.Title className="negritas">{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p><span className="negritas">{message}</span></p>
            </Modal.Body>
            <Modal.Footer>
                <button
                    onClick={() => handleClose()}
                    className="btn btn-link btn-close-link"
                    type="button"
                    data-toggle="tooltip"
                    data-placement="top">
                    <span>{cancelButton}</span>
                </button>
                <button
                    onClick={() => { handleConfirmDelete(); handleClose(); }}
                    className="btn btn-danger btn-eliminar"
                    type="button"
                    data-toggle="tooltip"
                    data-placement="top">
                    <span>{confirmButton}</span>
                </button>
            </Modal.Footer>
        </Modal>
    );
}