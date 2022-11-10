import "./css/Turnos.css";

import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as inscripcionesService from "../services/inscripciones.service";
import * as cursosService from "../services/cursos.service";
import * as turnosService from "../services/turnos.service";
import { AuthContext } from "../App";

export default function Turnos() {
    const [nombre, setNombre] = useState("");
    const [idUser, setIdUser] = useState("");
    const [turnos, setTurnos] = useState([])
    const [inscripcionesUsuario, setInscripcionesUsuario] = useState([])

    const value = useContext(AuthContext);

    let navigate = useNavigate();

    useEffect(() => {
        value.setCurrentUser(JSON.parse(localStorage.getItem("user")));
        if (!value.token) {
            navigate("/login", { replace: true });
        }

        // turnosService.find()
        //     .then((turnos) =>{
        //         setTurnos(turnos)
        //     })

    }, []);

    const fn = async () => {
        const [cursos, inscripciones] = await Promise.all(
            [cursosService.find(), inscripcionesService.find()]
        )


        console.log(cursos, inscripciones)
        const user = JSON.parse(window.localStorage.getItem('user'));
        setNombre(user.email)
        setIdUser(user._id)


        let inscripcionesDelUsuario = inscripciones.filter(inscripcion => inscripcion.idUser === user._id)
            .map(inscripcion => ({
                ...inscripcion,
                curso: cursos.find(curso => curso._id === inscripcion.idCurso)
            }))



        setInscripcionesUsuario(inscripcionesDelUsuario)

        // inscripcionesDelUsuario = inscripciones.filter(inscripcion => inscripcion.idUser === user._id)
        //     .map(inscripcion => ({
        //         ...inscripcion,
        //         turno: turnos.find(turno => turno._id === inscripcion.idCurso)
        //     }))
        //
        // setInscripcionesUsuario(inscripcionesDelUsuario)

        //console.log(inscripcionesDelUsuario)
        //console.log(JSON.stringify(inscripcionesUsuario))



    }

    useEffect( () => {

        fn();

    }, []);






    return (
        <main className="container main m-0">
            <div className=" cont-home">
                <h1 className="mt-4">Perfil - {nombre}</h1>
                <h2>Cursos anotados</h2>
                {/*<pre>{JSON.stringify(inscripcionesUsuario,null,2)}</pre>*/}

                <ul className="col-6">
                    {inscripcionesUsuario.map((inscripcion) => {


                        return(
                            <li key={inscripcion._id}>
                                <div className="card">

                                    <div className="card-body">
                                        <h5 className="card-title">{inscripcion.curso.nombre}</h5>
                                        <p className="card-text">{inscripcion.curso.descripcion}</p>
                                        <p className="card-text">Duración: {inscripcion.curso.duracion}Hrs</p>
                                        <a  href={`perfil/turno/id-${inscripcion.idTurno}/inscripcion/id-${inscripcion._id}`} className="btn btn-primary">Ver Turno</a>
                                    </div>
                                </div>

                            </li>
                        )
                    })}


                </ul>


            </div>
        </main>
    );
}
