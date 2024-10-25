import "../css/Edit.css";
import React, { useEffect, useState, useContext } from "react";
import * as turnosService from "../../services/shifts.service";
import * as inscripcionesService from "../../services/enrollments.service";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../App";
import * as productosService from "../../services/productos.service";

export function EditTurno({ title }) {
  let navigate = useNavigate();

  const [hora, setHora] = useState(9);
  const [horaFinalizar, setHoraFinalizar] = useState(10);
  const [minutos, setMinutos] = useState("");
  const [minutosFinalizar, setMinutosFinalizar] = useState("");
  const [editandoHorario, setEditandoHorario] = useState(false);
  const [modificar, setModificar] = useState(false);
  const [dias, setDias] = useState([]);
  const [inscripciones, setInscripciones] = useState([]);
  const [horarioInicio, setHorarioInicio] = useState("");
  const [horarioFin, setHorarioFin] = useState("");
  const [nombre, setNombre] = useState();
  const [max_turnos, setMax_turnos] = useState();
  const [idTurno, setIdTurno] = useState("");
  const [mensajeError, setMensajeError] = useState('');
  const [icons, setIcons] = useState([]);
  const [error, setError] = useState("");
  const [checked, setChecked] = useState({});
  const [mostrarError, setMostrarError] = useState(false);
  const params = useParams();


  const value = useContext(AuthContext);

  useEffect(() => {

    loadProductos()

      if (value.currentUser.role !== 1) {
        navigate("/", { replace: true });
      }
  }, []);

  function loadProductos(){
    return new Promise((resolve, reject) => {
      findTurnosById().then(() => {
        getInscripciones().then().catch((err) => {
          console.log(err)
          reject(err);
        });
      })
    })
  }

  function findTurnosById(){

    return new Promise((resolve, reject) => {
      turnosService
          .findById(params?.idTurno)
          .then((turno) => {
            setDias(turno.dias);
            setHorarioInicio(turno.horarioInicio);
            setHorarioFin(turno.horarioFin);
            setNombre(turno.nombre);
            setMax_turnos(turno.max_turnos);
            setIdTurno(params?.idTurno);
            resolve();
            console.log(turno.max_turnos)
          }).catch((err) => {
        console.log(err)
        reject(err);
      });
    })

  }

  function getInscripciones(){

    return new Promise((resolve, reject) => {
      inscripcionesService.find().then((data) => {
        setInscripciones(data)
        // console.log(inscripciones)
        resolve();
      }).catch((err) => {
        console.log(err)
        reject(err);
      });
    })


  }


  function handleSubmit(e) {
    e.preventDefault();

    if (mostrarError === true){
      window.alert("No se pudo modificar porque hay un error")
    } else {
      if (editandoHorario){
        const horarioInicio = hora + ':' + minutos
        const horarioFin = horaFinalizar + ':' + minutosFinalizar

        if (hora >= horaFinalizar){
          // window.alert("El horario de comienzo no puede ser menor al de finalizar")
          setMensajeError("La hora de finalización no puede ser menor o igual a la de inicio");
        } else {
          setMensajeError("");
          turnosService.update(params?.idTurno, { dias, horarioInicio, horarioFin, max_turnos }).then((data) => {
            navigate("/panel/turnos", { replace: true });
          });
          console.log("entre")
          console.log(nombre, dias, horarioInicio, horarioFin)
        }
      } else {
        setMensajeError("");
        turnosService.update(params?.idTurno, { dias, horarioInicio, horarioFin, max_turnos }).then((data) => {
          navigate("/panel/turnos", { replace: true });
        });
        console.log(nombre, dias, horarioInicio, horarioFin)
      }
    }



  }

  function handleEditarDias(){
    setEditandoHorario(true);
  }
  function handleCancelarEdicion (){
    if(window.confirm("¿Esta seguro que desea cancelar la edición del horario?")){
      setEditandoHorario(false);
    }

  }

  function handleDia(dias){

    const diasMapping = {
      D1: 'Lunes',
      D2: 'Martes',
      D3: 'Miércoles',
      D4: 'Jueves',
      D5: 'Viernes',
      // Puedes agregar más abreviaturas y nombres según sea necesario
    };

    const nombresDias = dias.map(abreviatura => diasMapping[abreviatura]);

    return nombresDias
  }

  function handleDiasChange (e) {
    // Obtener las opciones seleccionadas

    // console.log(e)
    const opcionesSeleccionadas = Array.from(e.target.selectedOptions, (option) => option.value);

    // Actualizar el estado con las opciones seleccionadas
    setDias(opcionesSeleccionadas);
  }

  function handleHoraChange(hora){
    setHora(hora)
  }

  function handleMinutosChange(minutos){

    if (minutos < 10){
      const newMinutos = "0" + minutos
      console.log(newMinutos.toString())
      setMinutos(newMinutos.toString())
    } else {
      console.log(hora.toString())
      const newMinutos = minutos.toString()
      setMinutos(newMinutos)
    }
  }
  function handleHoraFinalizarChange(horaFinalizar){


    if (hora >= horaFinalizar){
      console.log(hora, horaFinalizar)
      // window.alert("el horario de finalizacion no puede ser menor al de inicio")
      setMensajeError("La hora de finalización no puede ser menor o igual a la de inicio");
      setModificar(false)
    } else {
      console.log(horaFinalizar.toString())
      const newHora = horaFinalizar.toString()
      setMensajeError('');
      setHoraFinalizar(newHora)
      setModificar(true)
    }

  }
  function handleMinutosFinalizarChange(minutos){

    if (minutos < 10){
      const newMinutos = "0" + minutos
      console.log(newMinutos.toString())
      setMinutosFinalizar(newMinutos.toString())
    } else {
      console.log(hora.toString())
      const newMinutos = minutos.toString()
      setMinutosFinalizar(newMinutos)
    }
  }

  function handleMaxTurnosChange(nuevo_max_turnos){
    console.log(nuevo_max_turnos, max_turnos)

    const repeticiones = inscripciones.filter(
        (inscripcion) => inscripcion.idTurno === idTurno && inscripcion.deleted === false
    ).length;

    // const repeticiones = inscripciones.filter((inscripcion) => {
    //   console.log(`Comparando: ${inscripcion.idTurno} === ${idTurno}`);
    //   return inscripcion.idTurno === idTurno;
    // }).length;

    // console.log(inscripciones)

    if(nuevo_max_turnos < repeticiones){
      setMostrarError(true);
      // window.alert("No pueden haber menos cupos comparado a la cantidad de alumnos anotados")
    } else {
      setMostrarError(false);
      setMax_turnos(parseInt(nuevo_max_turnos))
    }

  console.log(`El idTurno ${idTurno} se repite ${repeticiones} veces.`);


  }

  return (
    <main className="container edit-cont">
      <h1>Editar - {title}</h1>
      <form onSubmit={handleSubmit}>


        <div className="mb-3">
          <label className="form-label">Ingrese el nombre del Turno</label>
          <input
              type="text"
              defaultValue={nombre}
              required
              onChange={(e) => setNombre(e.target.value)}
              className="form-control"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Ingrese la cantidad de alumnos</label>
          <input
              type="number"
              required
              defaultValue={max_turnos}
              onChange={(e) =>handleMaxTurnosChange(e.target.value)}
              className="form-control"
          />
          {mostrarError && (
              <div className="alert alert-danger mt-2" role="alert">
                No pueden haber menos cupos comparado a la cantidad de alumnos anotados
              </div>
          )}
        </div>


        <div>
          <p>Dias del turno: {handleDia(dias).join(', ')}</p>

              <div className="mb-3">
                <label className="form-label">Ingrese el día del turno</label>
                <select
                    value={dias}
                    onChange={handleDiasChange}
                    className="form-control"
                    required
                    multiple
                >
                  <option value="D1">Lunes</option>
                  <option value="D2">Martes</option>
                  <option value="D3">Miércoles</option>
                  <option value="D4">Jueves</option>
                  <option value="D5">Viernes</option>
                </select>
              </div>

        </div>

        <div>

          <p>El turno comienza a las: {horarioInicio} hrs y termina a las {horarioFin} hrs</p>

          {editandoHorario ? (
        <div className="mb-3">
          <span className="form-label">El turno comenzará a las</span>
          <input
              type="number"
              defaultValue={hora}
              required
              min={9}
              max={23}
              onChange={(e) =>handleHoraChange(e.target.value)}
              className="form-control input-horario"
          />
          :
          <input
              type="number"
              defaultValue={minutos}
              required
              min={0}
              max={59}
              onChange={(e) =>handleMinutosChange(e.target.value)}
              className="form-control input-horario"
          />
          hs, y terminará a las
          <input
              type="number"
              defaultValue={horaFinalizar}
              required
              min={10}
              max={23}
              onChange={(e) =>handleHoraFinalizarChange(e.target.value)}
              className="form-control input-horario"
          />
          :
          <input
              type="number"
              defaultValue={minutosFinalizar}
              required
              min={0}
              max={59}
              onChange={(e) =>handleMinutosFinalizarChange(e.target.value)}
              className="form-control input-horario"
          />
          hs.
          {mensajeError && <p style={{ color: 'red' }}>{mensajeError}</p>}
          <div>
            <button className="mt-2 btn btn-danger" onClick={handleCancelarEdicion}>Cancelar Edición</button>
          </div>
        </div>
          ) : (
              <button className="mb-3 btn btn-success" onClick={handleEditarDias}>Editar Horario</button>
          )}
        </div>
        <button type="submit" className="btn btn-primary">
          Modificar
        </button>
      </form>
      {error && <p>{error}</p>}
    </main>
  );
}
