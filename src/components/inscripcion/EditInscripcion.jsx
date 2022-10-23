import "../css/Edit.css";
import React, { useEffect, useState } from "react";
import * as inscripcionesService from "../../services/inscripciones.service";
import * as Constants from "../../Constants";
import { useNavigate, useParams } from "react-router-dom";

export function EditInscripcion({ title }) {
    let navigate = useNavigate();

    const [monto, setMonto] = useState();
    const [formaPago, setFormaPago] = useState("");
    const [nombre, setNombre] = useState("");
    const [icons, setIcons] = useState([]);
    const [error, setError] = useState("");
    const params = useParams();

    useEffect(() => {
        inscripcionesService
            .findById(params?.idInscripcion)
            .then((inscripcion) => {
                setMonto(inscripcion.monto);
                setFormaPago(inscripcion.formaPago);
                setNombre(inscripcion.nombre);
            })
            .catch((err) => setError(err.message));
    }, []);

    function handleSubmit(e) {
        e.preventDefault();
        console.log(monto)
        inscripcionesService.update(params?.idInscripcion, { monto, formaPago }).then((data) => {
            console.log(monto)
            navigate("/inscripciones", { replace: true });
        });
    }

    return (
        <main className="container edit-cont">
            <h1>Editar - {title}</h1>
            <h2>Alumno: {nombre}</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Ingrese la forma de pago (transferencia o efectivo)</label>
                    <input
                        type="text"
                        defaultValue={formaPago}
                        required
                        onChange={(e) => setFormaPago(e.target.value)}
                        className="form-control"
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Cuanto cuesta el taller</label>
                    <input
                        type="number"
                        defaultValue={monto}
                        required
                        onChange={(e) => setMonto(e.target.value)}
                        className="form-control"
                    />
                </div>
                <button type="submit" className="btn btn-primary">
                    Modificar
                </button>
            </form>
            {error && <p>{error}</p>}
        </main>
    );
}
