// import "./AdminClasses.css";

// import React, { useEffect, useState, useContext } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import * as classesService from "../../../services/classes.service";
// import { AuthContext } from "../../../App";
// import * as inscripcionesService from "../../../services/inscripciones.service";
// import { useQuery } from "react-query";

// Styles
import "./AdminClasses.css";
import "../css/AdminTable.css";

// React
import { Link } from "react-router-dom";
import { useQuery } from "react-query";
import React, { useContext, useEffect, useState } from "react";

// Services
import * as classesService from "../../../services/classes.service";

// Components
import Loader from "../../../components/basics/Loader";
import AdminClassRow from "../../../components/AdminClassRow/AdminClassRow";
import Paginator from "../../../components/Paginator/Paginator";

// External Libraries
import { Button, ButtonGroup, Dropdown, Form } from "react-bootstrap";
import CustomToast from "../../../components/basics/CustomToast/CustomToast";
import { AuthContext } from "../../../App";

export default function AdminClasses() {
  const value = useContext(AuthContext);

  const cols = [
    { field: 'actions', header: 'Acciones', type: 'actions' },
    { field: 'title', header: 'Título', type: 'string' },
    { field: 'description', header: 'Descripción', type: 'string' },
    { field: 'teacher', header: 'Docente', type: 'string' },
    { field: 'price', header: 'Precio', type: 'currency' },
    { field: 'min_age', header: 'Edad mínima', type: 'number' },
  ]

  const [showToast, setShowToast] = useState(null);
  // const [filterInput, setFilterInput] = useState(undefined)
  const [request, setRequest] = useState({
    page: 0,
    limit: 10,
    filter: JSON.stringify({ field: undefined, value: undefined }),
    sort: JSON.stringify({ field: undefined, direction: 1 }),
  });

  const fetchClasses = async (request) => {
    const result = await classesService.findQuery(request);
    return result[0];
  }

  const { data: classes, isLoading, isError, error, refetch } = useQuery(
    'classes',
    () => fetchClasses(request),
    {
      staleTime: Infinity,
      retry: 2,
    }
  );

  useEffect(() => {
    refetch();
  }, [request]);


  function handleFilter(field, value) {
    setRequest({ ...request, filter: JSON.stringify({ field, value }) });
  }

  function handleSort(field) {
    const parsedSort = JSON.parse(request.sort)
    if (parsedSort.field === field) {
      setRequest({ ...request, sort: JSON.stringify({ field, direction: parsedSort.direction === 1 ? -1 : 1 }) });
    } else {
      setRequest({ ...request, sort: JSON.stringify({ field, direction: 1 }) });
    }
  }

  function handleClear(page) {
    setRequest({ ...request, page: request.limit * page });
  }

  function handlePaginate(page) {
    setRequest({ ...request, page: request.limit * page });
  }

  function handlePaginatePrevious() {
    setRequest({ ...request, page: request.page - request.limit });
  }

  function handlePaginateNext() {
    setRequest({ ...request, page: request.page + request.limit });
  }

  const renderError = () => {
    return (
      <div className="alert alert-danger" role="alert">
        {error.message}
      </div>
    )
  }

  const renderCols = (col) => {
    switch (col.type) {
      case 'string':
        return (
          <th className="col-header" scope="col" key={col.field}>
            <Dropdown as={ButtonGroup}>
              <Button className="col-label" variant="link" onClick={(e) => { e.preventDefault(); handleSort(col.field) }}>
                <span>{col.header}</span>
                {JSON.parse(request.sort).field === col.field && <span className={"pi pi-sort-alpha" + (JSON.parse(request.sort).direction === 1 ? "-down" : "-down-alt")}></span>}
              </Button>

              <Dropdown.Toggle split as={JSON.parse(request.filter)?.field === col.field ? renderSelectedFilterMenu : renderFilterMenu} />


              <Dropdown.Menu className="cont-search">
                <Form onSubmit={(e) => { e.preventDefault(); handleFilter(col.field, e.target.filter.value) }}>
                  <Form.Control type="text" name="filter" autoFocus placeholder={"Buscar por " + col.header} />
                  <div className="d-flex mt-2 justify-content-end gap-2">
                    <Button variant="outline-secondary" onClick={(e) => { e.preventDefault(); handleFilter(undefined, undefined) }}>Limpiar</Button>
                    <Button variant="primary" type="submit">Aplicar</Button>
                  </div>
                </Form>
              </Dropdown.Menu>
            </Dropdown>
          </th>
        )
      case 'number':
      case 'currency':
        return (
          <th className="col-header" scope="col" key={col.field}>
            <Dropdown as={ButtonGroup}>
              <Button className="col-label" variant="link" onClick={(e) => { e.preventDefault(); handleSort(col.field) }}>
                <span>{col.header}</span>
                {JSON.parse(request.sort).field === col.field && <span className={"pi pi-sort-numeric" + (JSON.parse(request.sort).direction === 1 ? "-down" : "-down-alt")}></span>}
              </Button>
            </Dropdown>
          </th>
        )
      // case 'date':
      case 'created_by':
        return (
          value.currentUser?.role === 1 &&
          <th scope="col" key={col.field}>{col.header}</th>
        )
      default:
        return (
          <th scope="col" key={col.field}>{col.header}</th>
        )

    }
  }

  if (isLoading) {
    return <Loader></Loader>
  }

  const renderFilterMenu = React.forwardRef(({ onClick }, ref) => (
    <Button
      className="btn-filter"
      variant="secondary-outline"
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }
      }
    >
      <span className={"pi pi-filter"}></span>
    </Button>
  ));
  const renderSelectedFilterMenu = React.forwardRef(({ onClick }, ref) => (
    <Button
      className="btn-filter"
      variant="link"
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }
      }
    >
      <span className="pi pi-filter-fill"></span>
    </Button>
  ));

  return (
    <div className="cont-admin-classes admin-table">
      <div className="d-md-flex justify-content-between align-items-center mb-3">

        <h1>Administrar Clases</h1>
        <Link to="new" className="btn btn-primary btn-icon">
          <span className="pi pi-plus"></span>Crear una Clase
        </Link>
      </div>
      {isError ?
        renderError() :
        <div className="d-grid">

          <div className="table-responsive">
            <table className="table table-hover table-striped ">
              <thead>
                <tr>
                  {cols.map((col) => {
                    return renderCols(col);
                  })}
                </tr>
              </thead>
              <tbody>
                {classes?.data.length > 0 ?
                  classes?.data?.map((item) => {
                    return <AdminClassRow props={{ item: item, refetch: refetch, cols: cols, showEdit: true, showDelete: true, setShowToast: setShowToast }} key={item._id} />
                  })
                  :
                  <tr>
                    <td colSpan={cols.length}>No hay registros que coincidan con esa búsqueda. Intentá ampliar el criterio.</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      }
      {classes?.data.length > 0 &&
        <Paginator props={{ pages: classes?.pages ?? 0, count: classes?.count ?? 0, page: request.page, limit: request.limit, handlePaginate: handlePaginate, handlePaginateNext: handlePaginateNext, handlePaginatePrevious: handlePaginatePrevious }} />

      }
      <CustomToast props={{ data: showToast, setShowToast: setShowToast }} />

    </div>
  );
  //   const [cursos, setCursos] = useState([]);

  //   const value = useContext(AuthContext);

  //   let navigate = useNavigate();

  //   useEffect(() => {
  //     if (value.currentUser.role !== 1) {
  //       navigate("/", { replace: true });
  //     }
  //   }, []);

  //   useEffect(() => {
  //     classesService.find().then((data) => {
  //       setCursos(data);
  //     });
  //   }, []);

  //   function handleDeleteElement(item) {

  //     if (window.confirm("¿Esta seguro que quiere eliminar la clase?")) {
  //       classesService.remove(item._id).then((cursos) => {
  //         console.log(cursos);
  //         setCursos(cursos);
  //       });

  //     }


  //   }

  //   return (
  //     <div className="cont-admin-cursos">
  //       <h1>Administrar Clases</h1>
  //       <Link to="create" className="btn btn-primary mt-3 btn-icon">
  //         <span className="pi pi-plus"></span>Crear una Clase
  //       </Link>
  //       <ul>
  //         {cursos.map((curso) => {
  //           // return <p>{curso.horario}</p>
  //           return (
  //             <li className="card mb-3" key={curso._id}>
  //               <div className="row g-0">
  //                 <div className="card-body col-md-8">
  //                   <small className="text-body-secondary">Profesor: {curso.profesor}</small>
  //                   <h5 className="card-title">{curso.nombre}</h5>
  //                   <p className="card-text">{curso.descripcion}</p>
  //                   <p> ${curso.precio}</p>
  //                 </div>
  //                 <div className="col-md-4 d-flex gap-2 align-items-end justify-content-end">
  //                   <Link
  //                     to={"edit/id-" + curso._id}
  //                     className="btn btn-warning btn-icon">
  //                     <span className="pi pi-pen-to-square"></span>Editar
  //                   </Link>
  //                   <button
  //                     onClick={() => handleDeleteElement(curso)}
  //                     className="btn btn-danger btn-icon"
  //                     type="button"
  //                     data-toggle="tooltip"
  //                     data-placement="top"
  //                     title=""
  //                     data-original-title="Delete">
  //                     <span className="pi pi-trash"></span>Eliminar
  //                   </button>
  //                 </div>
  //               </div>
  //             </li>
  //             // <li key={curso._id}>
  //             //   <p>Clase: {curso.nombre}</p>
  //             //   <p>Descripción: {curso.descripcion}</p>
  //             //   <p>Profesor: {curso.profesor}</p>
  //             //   <p>Precio: ${curso.precio} </p>
  //             //   <Link
  //             //     to={"curso/id-" + curso._id}
  //             //     className="btn btn-warning btn-editar me-2">
  //             //     <span>Editar clase</span>
  //             //   </Link>
  //             //   <button
  //             //     onClick={() => handleDeleteElement(curso)}
  //             //     className="btn btn-danger btn-eliminar"
  //             //     type="button"
  //             //     data-toggle="tooltip"
  //             //     data-placement="top"
  //             //     title=""
  //             //     data-original-title="Delete">
  //             //     <span>Eliminar Clase</span>
  //             //   </button>
  //             // </li>
  //           );
  //         })}
  //       </ul>
  //     </div>
  //   );
}
