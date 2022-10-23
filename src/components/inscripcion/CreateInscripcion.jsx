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


}
