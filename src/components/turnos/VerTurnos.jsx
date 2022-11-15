import "../../pages/css/Turnos.css"

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as turnosService from "../../services/turnos.service";

export function VerTurnos() {
    const [turnos, setTurnos] = useState([]);
    const params = useParams();

    useEffect(() => {
        turnosService.find().then((data) => {
            setTurnos(data);
            // console.log(data)
            // console.log(params?.idCurso)
        })}, []);


    return (
        <main className="container main">
            <div className=" cont-home">
                <h1>Turnos disponibles</h1>
                <ul>
                    {turnos.map((turno) => {
                         if (turno.idCurso === params?.idCurso){
                        // console.log(params)
                        return (
                            <li key={turno._id}>
                                <p>
                                    Turno: {turno.dia} / Horario: {turno.horario}
                                </p>
                                <a href={`/id-${turno._id}/curso/id-${turno.idCurso}`}>Inscribirse</a>
                            </li>
                        );}
                    })}
                </ul>
            </div>
        </main>
    );
}
