import "./css/Turnos.css";

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as inscripcionesService from "../services/inscripciones.service";
import * as turnosService from "../services/turnos.service";
import * as cursosService from "../services/cursos.service";

export default function Inscripciones() {
    const [inscripciones, setInscripciones] = useState([]);
    const [turnos, setTurnos] = useState([]);
    // const [cursos, setCursos] = useState([]);

    useEffect(() => {
        inscripcionesService.find().then((data) => {
            setInscripciones(data);
        });

        turnosService.find().then((data) => {
            setTurnos(data);
        });
        // cursosService.find().then((data) => {
        //     setCursos(data);
        // });


    }, []);
    useEffect(() => {

        // cursosService.find().then((data) => {
        //     setCursos(data);
        // });

    }, []);

    function handleDeleteElement(item) {
        inscripcionesService.remove(item._id).then((inscripciones) => {
            console.log(inscripciones);
            setInscripciones(inscripciones);
        });
    }

    function handleTurno(data){

        // console.log(data.idTurno)
       //  console.log(turnos)
       const result = turnos.filter(turno => turno._id === data.idTurno)
       console.log([result[0].dia, result[0].horario])
        return result[0].dia
         // return "lunes"
    }

    return (
        <main className="container main m-0">
            <div className=" cont-home">
                <h1 className="mt-4">Administrar Inscripciones</h1>
                <a href={"inscripciones/inscripcion"} className="btn btn-primary mt-3">Crear una inscripcion</a>
                <ul>
                    {inscripciones.map((inscripcion) => {
                        // return <p>{turno.horario}</p>
                        return (
                            <li key={inscripcion._id}>
                                <p>Alumno: {inscripcion.nombre}</p>
                                <p>Dia: {handleTurno(inscripcion)}</p>
                                <p>
                                    Monto: ${inscripcion.monto} / Metodo de Pago: {inscripcion.formaPago}
                                </p>
                                <a
                                    href={`inscripciones/inscripcion/id-${inscripcion._id}`}
                                    className="btn btn-warning btn-sm rounded-2 me-2"
                                >
                                    Editar inscripcion
                                </a>
                                <button
                                    onClick={() => handleDeleteElement(inscripcion)}
                                    className="btn btn-danger btn-sm rounded-2"
                                    type="button"
                                    data-toggle="tooltip"
                                    data-placement="top"
                                    title=""
                                    data-original-title="Delete"
                                >
                                    <i className="fa fa-trash-o" aria-hidden="true"></i>
                                    Eliminar inscripcion
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </main>
    );
}
