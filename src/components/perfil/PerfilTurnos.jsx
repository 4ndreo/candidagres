import React, { useEffect, useState } from "react";
import * as inscripcionesService from "../../services/inscripciones.service";
import * as cursosService from "../../services/cursos.service";
import * as turnosService from "../../services/turnos.service";

import { useNavigate, useParams } from "react-router-dom";


export function PerfilTurnos({ title }) {
    let navigate = useNavigate();
    const [inscripcionesUsuario, setInscripcionesUsuario] = useState([])
    const [turnos, setTurnos] = useState([])
    const [idInscripcion, setIdInscripcion] = useState("")
    const params = useParams();



    const fn = async (idTurno) => {
        const [turnos] = await Promise.all(
            [turnosService.find()]
        )

        console.log(idTurno)
        console.log('turnos: ',turnos)
        // const user = JSON.parse(window.localStorage.getItem('user'));
        // setNombre(user.email)
        // setIdUser(user._id)


        let inscripcionesDelUsuario = turnos.filter(turno => turno._id === idTurno)
            .map(turno => ({
                ...turno
            }))


        setInscripcionesUsuario(inscripcionesDelUsuario)
    }

        useEffect( () => {

            let turnoId = (params?.idTurno)
            setIdInscripcion(params?.idInscripcion)


            fn(turnoId)

        }, []);

    function handleDeleteElement(id) {
        window.confirm('¿Estas seguro que queres eliminar tu inscripción?')
        inscripcionesService.remove(id).then((inscripcion) => {
            console.log(inscripcion);
        });
        //console.log(id)
        navigate("/perfil", { replace: true });
    }


    return (
        <main className="container edit-cont">

            <h1>{title}</h1>

            {/*<pre>{JSON.stringify(inscripcionesUsuario,null,2)}</pre>*/}

            <ul>
                {inscripcionesUsuario.map((inscripcion) => {
                    return (
                        <li key={inscripcion._id}>
                            <div className="card">
                                <div className="card-header">
                                    Anotado/a
                                </div>
                                <div className="card-body">
                                    <h5 className="card-title">{inscripcion.dia}</h5>
                                    <p className="card-text">Horario: {inscripcion.horario}Hrs</p>

                                    <button
                                        onClick={() => handleDeleteElement(idInscripcion)}
                                        className="btn btn-danger btn-sm rounded-2"
                                        type="button"
                                        data-toggle="tooltip"
                                        data-placement="top"
                                        title=""
                                        data-original-title="Delete"
                                    >
                                        <i className="fa fa-trash-o" aria-hidden="true"></i>
                                        Eliminar Inscripción
                                    </button>
                                </div>
                            </div>
                        </li>
                    )
                })}

            </ul>


            <a href="/perfil" className="btn btn-primary">Volver</a>

        </main>
    );
}
