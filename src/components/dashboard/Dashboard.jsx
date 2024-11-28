// import './Dashboard.css';

// import React, { useContext, useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// import Loader from '../basics/Loader';

// import * as classesService from '../../services/classes.service';
// import * as userService from '../../services/users.service';
// import * as turnosService from '../../services/shifts.service';
// import * as inscripcionesService from '../../services/enrollments.service';
// import { AuthContext } from '../../App';
// import { Swiper, SwiperSlide } from 'swiper/react';
// import { FreeMode, Pagination } from 'swiper';

// export function Dashboard() {
// 	let navigate = useNavigate();

// 	let inscripciones = [];
// 	let cursos = [];
// 	let turnos = [];
// 	let users = [];

// 	// const [cursos, setCursos] = useState([]);
// 	// const [users, setUsers] = useState([]);
// 	// const [turnos, setTurnos] = useState([]);
// 	// const [inscripciones, setInscripciones] = useState([]);
// 	const [informacion, setInformacion] = useState({});
// 	const [loading, setLoading] = useState(false);

// 	const value = useContext(AuthContext);

// 	useEffect(() => {
// 		loadData();

// 		if (value.currentUser.role !== 1) {
// 			navigate('/', { replace: true });
// 		}
// 	}, []);

// 	useEffect(() => {
// 		console.log(informacion);
// 	}, []);

// 	function getCursos() {
// 		return new Promise((resolve, reject) => {
// 			classesService
// 				.find()
// 				.then((data) => {
// 					cursos = data;
// 					resolve(data);
// 				})
// 				.catch((err) => {
// 					console.log(err);
// 					reject(err);
// 				});
// 		});
// 	}

// 	function getTurnos() {
// 		return new Promise((resolve, reject) => {
// 			turnosService
// 				.find()
// 				.then((data) => {
// 					turnos = data;
// 					resolve(data);
// 				})
// 				.catch((err) => {
// 					console.log(err);
// 					reject(err);
// 				});
// 		});
// 	}

// 	function getUsers() {
// 		return new Promise((resolve, reject) => {
// 			userService
// 				.find()
// 				.then((data) => {
// 					users = data;
// 					resolve(data);
// 				})
// 				.catch((err) => {
// 					console.log(err);
// 					reject(err);
// 				});
// 		});
// 	}

// 	function getInscripcionesByUser() {
// 		return new Promise((resolve, reject) => {
// 			inscripcionesService
// 				.find()
// 				.then((data) => {
// 					inscripciones = data;
// 					resolve(data);
// 				})
// 				.catch((err) => {
// 					console.log(err);
// 					reject(err);
// 				});
// 		});
// 	}

// 	function loadData() {
// 		return new Promise((resolve, reject) => {
// 			setLoading(true);
// 			getCursos().then(() => {
// 				getTurnos().then(() => {
// 					getUsers().then(() => {
// 						getInscripcionesByUser().then(() => {
// 							// console.log(turnos, cursos, users, inscripciones)
// 							agruparInformacion(cursos, inscripciones, turnos, users);
// 							// agruparInformacionTurnos(turnos, inscripciones)
// 							resolve();
// 							setLoading(false);
// 						});
// 					});
// 				});
// 			});
// 		});
// 	}

// 	function agruparInformacion(cursos, inscripciones, turnos, users) {
// 		const informacionAgrupada = {};

// 		inscripciones.forEach((inscripcion) => {
// 			const idCurso = inscripcion.idCurso;
// 			const idUser = inscripcion.idUser;
// 			const idTurno = inscripcion.idTurno;

// 			// Verifica si ya hay información agrupada para este curso
// 			if (!informacionAgrupada[idCurso]) {
// 				informacionAgrupada[idCurso] = {
// 					turnos: {}, // Usamos un objeto para agrupar por idTurno
// 					curso: null,
// 					users: [],
// 				};
// 			}

// 			// Agrega el turno si no está presente
// 			if (!informacionAgrupada[idCurso].turnos[idTurno]) {
// 				const turnoInscripto = turnos.find((turno) => turno._id === idTurno);
// 				informacionAgrupada[idCurso].turnos[idTurno] = {
// 					turno: turnoInscripto,
// 					users: [],
// 				};
// 			}

// 			// Asigna el curso si no está asignado
// 			if (!informacionAgrupada[idCurso].curso) {
// 				const cursoInscripto = cursos.find((curso) => curso._id === idCurso);
// 				informacionAgrupada[idCurso].curso = cursoInscripto;
// 			}

// 			// Agrega el usuario si no está presente en el turno específico
// 			if (
// 				!informacionAgrupada[idCurso].turnos[idTurno].users.find(
// 					(user) => user._id === idUser
// 				)
// 			) {
// 				const userInscripto = users.find((user) => user._id === idUser);
// 				informacionAgrupada[idCurso].turnos[idTurno].users.push(userInscripto);
// 			}

// 			// Agrega el usuario a la lista general si no está presente
// 			if (
// 				!informacionAgrupada[idCurso].users.find((user) => user._id === idUser)
// 			) {
// 				const userInscripto = users.find((user) => user._id === idUser);
// 				informacionAgrupada[idCurso].users.push(userInscripto);
// 			}
// 		});

// 		// return informacionAgrupada;
// 		setInformacion(informacionAgrupada);
// 		//return informacionAgrupada;
// 	}

// 	// if (productosComprar.length > 0) {

// 	if (!loading) {
// 		return (
// 			<main className='container main'>
// 				<div className='cont-admin-cursos'>
// 					<h1>Dashboard</h1>

// 					<p>Información de Usuarios anotados a las Clases</p>
// 					{Object.keys(informacion).map((idCurso) => {
// 						const { curso, turnos, users } = informacion[idCurso];

// 						return (
// 							<div key={idCurso} className='cont-curso'>
// 								<h2>{curso.nombre}</h2>
// 								<Swiper
// 									slidesPerView={2.5}
// 									spaceBetween={30}
// 									freeMode={true}
// 									// pagination={{
// 									//   clickable: true,
// 									// }}
// 									modules={[FreeMode, Pagination]}
// 									className='mySwiper'>
// 									{Object.keys(turnos).map((idTurno) => {
// 										const { turno, users: usersPorTurno } = turnos[idTurno];

// 										return (
// 											<SwiperSlide key={idTurno}>
// 												<div className='cont-turno'>
// 													<h3>{turno.nombre}</h3>

// 													<ul>
// 														{usersPorTurno.map((user) => (
// 															<li key={user._id}>
// 																<p>{user.email}</p>
// 															</li>
// 														))}
// 													</ul>
// 												</div>
// 											</SwiperSlide>
// 										);
// 									})}
// 								</Swiper>
// 							</div>
// 						);
// 					})}
// 				</div>
// 			</main>
// 		);
// 	} else {
// 		return (
// 			<main className='container'>
// 				<Loader></Loader>
// 			</main>
// 		);
// 	}

// 	// }   else
// 	// {
// 	//     return (
// 	//         <main>
// 	//
// 	//             <Container fluid>
// 	//                 <Row>
// 	//
// 	//                     <Col md={2} className="d-none d-md-block bg-light sidebar">
// 	//                         <div className="sidebar-sticky">
// 	//                             <Nav className="flex-column">
// 	//                                 <Nav.Link href="/tienda" className="nav-link active">Tienda</Nav.Link>
// 	//                                 <Nav.Link href={`/carrito/id-${id_user}`} className="nav-link">Carrito de Compras</Nav.Link>
// 	//                                 <Nav.Link href={`/carrito/historial/id-${id_user}`} className="nav-link">Historial</Nav.Link>
// 	//                             </Nav>
// 	//                         </div>
// 	//                     </Col>
// 	//
// 	//                     <Col md={10} className="ml-md-auto px-md-4">
// 	//                         <div>
// 	//                             <h1>Productos seleccionados de {nombre}</h1>
// 	//                             <p><b>Total:</b> ${total}</p>
// 	//                         </div>
// 	//
// 	//                         <div>
// 	//                             <p>No tenes productos en el carrito. Hace <a href="/tienda">click aqui</a> para ver los
// 	//                                 productos disponibles.</p>
// 	//                         </div>
// 	//
// 	//                     </Col>
// 	//                 </Row>
// 	//             </Container>
// 	//
// 	//         </main>
// 	//     )
// 	// }
// }
