import React, { useEffect, useState } from "react";
import * as inscripcionesService from "../../services/inscripciones.service";
import { useNavigate, useParams } from "react-router-dom";

export function CreateInscripcion({ title }) {
    let navigate = useNavigate();

    const [monto, setMonto] = useState();
    const [formaPago, setFormaPago] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {}, []);

    function handleSubmit(e) {
        e.preventDefault();
        inscripcionesService
            .create({ monto, formaPago })
            .then((data) => {
                navigate("/home", { replace: true });
            })
            .catch((err) => setError(err.message));
    }

    return (
        <main className="container edit-cont">
            <h1>Crear - {title}</h1>
            <form onSubmit={handleSubmit}>
                <div class="mb-3">
                    <label className="form-label">Ingrese el nombre del curso</label>
                    <input
                        type="text"
                        required
                        onChange={(e) => setNombre(e.target.value)}
                        className="form-control"
                    />
                </div>
                <div class="mb-3">
                    <label className="form-label">Ingrese la descripción del curso</label>
                    <input
                        type="text"
                        required
                        onChange={(e) => setDescripcion(e.target.value)}
                        className="form-control"
                    />
                </div>
                <div class="mb-3">
                    <label className="form-label">A que hora comienza el curso</label>
                    <input
                        type="number"
                        defaultValue={0}
                        required
                        onChange={(e) => setDuracion(parseInt(e.target.value))}
                        className="form-control"
                    />
                </div>
                <button type="submit" className="btn btn-primary">
                    Crear
                </button>
            </form>

            <p>{nombre}</p>
            <p>{duracion}</p>
            {error && <p>{error}</p>}
        </main>
    );
}
