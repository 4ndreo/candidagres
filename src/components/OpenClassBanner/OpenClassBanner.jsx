import { useRef, useState } from "react";
import "./OpenClassBanner.css";
import * as openClassEnrollmentsService from "../../services/openClassEnrollments.service";
import LoaderMini from "../basics/LoaderMini";
import { weekenddays } from "../../data/shifts";
import ReCAPTCHA from "react-google-recaptcha";


export default function OpenClassBanner({ props }) {
    const availableHours = [
        "11:00",
        "13:00",
        "15:00",
    ];

    const [enrolled, setEnrolled] = useState(JSON.parse(localStorage.getItem("openClass")));

    const [form, setForm] = useState({
        email: "",
        recaptcha: "",
        day: "",
        shift_start_time: "",
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const recaptchaRef = useRef(null);
    function handleRecaptchaChange(e) {
        if (e) {
            setForm({
                ...form,
                recaptcha: e,
            });
            setErrors({
                ...errors,
                recaptcha: '',
            });
        }
    }

    function handleChange(e) {
        const { name, value } = e.target;
        setForm({
            ...form,
            [name]: value,
        });
        setErrors({
            ...errors,
            [name]: '',
        });
    }

    async function handleSubmit(e) {
        setLoading(true);
        e.preventDefault();
        await openClassEnrollmentsService
            .create(form)
            .then((resp) => {
                if (!resp.err) {
                    localStorage.setItem("openClass", JSON.stringify(resp))
                    setEnrolled(resp);
                } else {
                    if (resp.enrolled) {
                        localStorage.setItem("openClass", JSON.stringify(resp.enrollmentData))
                        setEnrolled(resp.enrollmentData);
                    } else {
                        props.setShowToast({ show: true, title: 'Error', message: Object.values(resp.err)[0], variant: 'danger', position: 'top-end' });
                        setErrors(resp.err);
                        recaptchaRef.current.reset();
                    }
                }
            })
            .finally(() => {
                setLoading(false);
            });
    }

    const renderInfo = (showLocation, showDays, showTime) => {
        return (
            <div className="open-class-info mt-4">
                <h3>¿Dónde nos vemos?</h3>
                <ul>
                    {showLocation && <li><span className="negritas">Ubicación:</span> Local 164, Puerto de Frutos, Tigre, Buenos Aires</li>}
                    {showDays && <li><span className="negritas">Días:</span> Sábado 11 y Domingo 12 de enero</li>}
                    {showTime && <li><span className="negritas">Horario:</span> 10:00 hs a 18:00 hs</li>}
                </ul>
            </div>
        )
    }

    if (enrolled) return (
        <div className="open-class-banner-cont enrolled bg-success" >
            <h2 className="open-class-title">
                Estás inscripto a la clase abierta
            </h2>
            <p className="open-class-description">Tenés que acercarte al stand el día <span className="negritas">{enrolled?.day} {enrolled?.day === "Sábado" ? '11' : '12'} de enero a las {enrolled?.shift_start_time} hs</span>. ¡Te esperamos!</p>
            {renderInfo(true)}
        </div >
    )
    return (
        <div className="open-class-banner-cont" >
            <h2 className="open-class-title">
                Anotate a la clase abierta
            </h2>
            <p className="open-class-description">Este <span className="negritas">sábado 11 y domingo 12 de enero</span> estaremos compartiendo un taller de cerámica abierto y gratuito, donde podrás conocer la técnica y participar de un sorteo con grandes premios. </p>

            <label htmlFor="email" className="mb-2">Ingresá tu email y el horario en el que querés participar:</label>
            <form onSubmit={handleSubmit} noValidate className="d-flex flex-column flex-md-row gap-3 align-items-center">
                <div className="d-flex flex-column w-100">

                    <input
                        className={"form-control w-100 " + (errors.email ? 'is-invalid' : '')}
                        id="email"
                        name="email"
                        type="email"
                        placeholder="tunombre@email.com"
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="d-flex flex-row gap-3 align-items-center w-100">
                    <div className="d-flex flex-column w-100">
                        <select
                            className={"form-control w-100 " + (errors.day ? 'is-invalid' : '')}
                            id="day"
                            name="day"
                            type="text"
                            defaultValue={form.day ?? ""}
                            onChange={handleChange}
                            required>
                            <option value={""} disabled>Día...</option>
                            {weekenddays?.map((x) => (
                                <option key={x.id} value={x.name}>{x.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="d-flex flex-column w-100">
                        <select
                            className={"form-control w-100 " + (errors.shift_start_time ? 'is-invalid' : '')}
                            id="shift_start_time"
                            name="shift_start_time"
                            type="text"
                            defaultValue={form.shift_start_time ?? ""}
                            onChange={handleChange}
                            required>
                            <option value={""} disabled>Horario...</option>
                            {availableHours?.map((x) => (
                                <option key={x} value={x}>{x}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <button className="btn btn-warning submit-btn d-flex justify-content-center negritas" type="submit" disabled={Object.values(form).length === 0 || loading}>{loading ? <span className='mini-loader-cont'>
                    <LoaderMini></LoaderMini>
                </span> : 'Inscribirse'}</button>
            </form>
            <ReCAPTCHA
                ref={recaptchaRef}
                name="recaptcha"
                sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
                onChange={handleRecaptchaChange}
                className="mt-3"
            />

            {renderInfo(true, true, true)}

        </div >
    )
}