import "./EnrollmentsProfileItem.css";

import { Link } from "react-router-dom";
import { weekdays } from "../../../../data/shifts";
import * as enrollmentsService from "../../../../services/enrollments.service";
import { useState } from "react";
import { Modal } from "react-bootstrap";

export default function EnrollmentsProfileItem({ props }) {
    const [deleting, setDeleting] = useState();
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = (selected) => { setShow(true); setDeleting(selected) };

    function handleSelectedDelete(item) {
        setDeleting(item);
    }

    async function handleConfirmDelete(item) {
        try {
            await enrollmentsService.remove(item._id)
            props.setShowToast({ show: true, title: 'Éxito', message: 'La inscripción se ha eliminado', variant: 'success', position: 'top-end' });
            props.resetPagination();
        } catch (err) {
            props.setShowToast({ show: true, title: 'Error al eliminar la inscripción', message: 'Inténtelo de nuevo más tarde', variant: 'danger', position: 'top-end' });

        }
    }
    return (
        <>
            <div className="enrollment-profile-item-cont card d-flex flex-row justify-content-between">
                <div className="d-flex flex-column">

                    <Link to={`/classes/${props.enrollment.shift.class._id}/shifts`} className="class-title" >{props.enrollment.shift.class.title}</Link>
                    <span>{weekdays.filter(day => props.enrollment.shift.days.includes(day.id)).map(day => day.name).join(', ')}</span>
                    <span>{props.enrollment.shift.start_time}hs a {props.enrollment.shift.end_time}hs</span>
                    <span><span className="negritas">Cuota mensual:</span> ${props.enrollment.shift.class.price}</span>
                </div>
                <button
                    onClick={() => { handleShow(); handleSelectedDelete(props.enrollment); }}
                    className="btn p-0"
                    type="button"
                    aria-label="Eliminar">
                    <span className="pi pi-trash text-danger"></span>
                </button>
            </div>
            <Modal show={show} onHide={handleClose} size="lg" variant="white" className="modal-delete">
                <Modal.Header className="modal-title" closeButton>
                    <Modal.Title className="negritas">¿Seguro querés eliminar tu inscripción a la clase "{deleting?.shift.class.title}"?</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Vas a eliminar la inscripción para los días {weekdays.filter(day => props.enrollment.shift.days.includes(day.id)).map(day => day.name).join(', ')} en el horario de {props.enrollment.shift.start_time}hs a {props.enrollment.shift.end_time}hs</p>
                </Modal.Body>
                <Modal.Footer>
                    <button
                        onClick={() => { handleClose(); }}
                        className="btn btn-link btn-close-link"
                        type="button"
                        data-toggle="tooltip"
                        data-placement="top">
                        <span>Cancelar</span>
                    </button>
                    <button
                        onClick={() => { handleConfirmDelete(deleting); handleClose(); }}
                        className="btn btn-danger btn-eliminar"
                        type="button"
                        data-toggle="tooltip"
                        data-placement="top">
                        <span>Eliminar inscripción</span>
                    </button>
                </Modal.Footer>
            </Modal>
        </>
    );
}