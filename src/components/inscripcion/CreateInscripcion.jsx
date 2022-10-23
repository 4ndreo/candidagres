import React, { useEffect, useState } from "react";
import * as turnosService from "../../services/turnos.service";
import * as inscripcionesService from "../../services/inscripciones.service";

import { useNavigate, useParams } from "react-router-dom";

export function CreateInscripcion({ title }) {
    let navigate = useNavigate();

    const [nombre, setNombre] = useState("")
    const [monto, setMonto] = useState();
    const [formaPago, setFormaPago] = useState("");
    const [turnos, setTurnos] = useState([]);
    const [idTurno, setIdTurno] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        turnosService.find().then((data) => {
            setTurnos(data);
            console.log(data)
        });
    }, []);

    function handleSubmit(e) {
        e.preventDefault();
        inscripcionesService
            .create({ nombre, monto, formaPago,idTurno })
            .then((data) => {
                navigate("/inscripciones", { replace: true });
            })
            .catch((err) => setError(err.message));
    }

    function handleOption(idTurno){
        console.log(idTurno)
        if(idTurno !== "error"){
            let result = turnos.filter(turno => turno._id === idTurno)
            setIdTurno(result[0]._id)
            console.log(result[0]._id)
        } else {
        }
    }

    return (
        <main className="container edit-cont">
            <h1>Crear - {title}</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Ingrese el Nombre del Alumno</label>
                    <input
                        type="text"
                        required
                        onChange={(e) => setNombre(e.target.value)}
                        className="form-control"
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Ingrese la forma de pago (efectivo o transferencia)</label>
                    <input
                        type="text"
                        required
                        onChange={(e) => setFormaPago(e.target.value)}
                        className="form-control"
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Cual es el valor de la clase</label>
                    <input
                        type="number"
                        defaultValue={0}
                        required
                        onChange={(e) => setMonto(parseInt(e.target.value))}
                        className="form-control"
                    />
                </div>

                <div>
                    <label htmlFor="cursos">A que turno pertenece</label>
                    <select
                        name="cursos"
                        id="cursos"
                        form="cursosForm"
                        onChange={e => handleOption(e.target.value)}
                    >
                        <option value="error"> Selecciona el turno...-</option>
                        {turnos.map((turno) => {
                            return (
                                <option
                                    key={turno._id}
                                    value={turno._id}
                                > {turno.dia} - {turno.horario}Hrs </option>
                            );
                        })}

                    </select>
                </div>

                <button type="submit" className="btn btn-primary">
                    Crear
                </button>
            </form>

            <p>{nombre}</p>
            <p>{formaPago}</p>
            <p>{monto}</p>
            {error && <p>{error}</p>}
        </main>
    );
}
