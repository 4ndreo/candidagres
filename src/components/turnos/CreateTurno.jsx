import React, { useEffect, useState } from "react";
import * as turnosService from "../../services/turnos.service";

export function CreateTurno({title}){

    const [dia, setDia] = useState("");
    const [horario, setHorario] = useState(9);
    const [error, setError] = useState("");

    useEffect(() => {

    }, [])

    function handleSubmit(e){
        e.preventDefault()
        setHorario(Number(horario))
        turnosService.create({dia, horario})
            .then(data => {
            }).catch(err => setError(err.message))
    }

    return (
        <main className="container edit-cont">
            <h1>Crear - {title}</h1>
            <form onSubmit={handleSubmit}>
                <label>Ingrese el dia del turno</label>
                <input type="text" value={dia} required onChange={e => setDia(e.target.value)}/>

                <label>A que hora comienza el turno</label>
                <input type="number" value={horario} required max={18} min={9} onChange={e=>setHorario(e.target.value)}/>


                <button>Crear</button>
            </form>

            <p>{dia}</p>
            <p>{horario}</p>
            {error && <p>{error}</p>}
        </main>
    )
}