// Styles
import "./AdminEnrollments.css";
import "../css/AdminTable.css";

// React
import { useQuery } from "react-query";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../App";

// Services
import * as enrollmentsService from "../../../services/enrollments.service";
import * as shiftsService from "../../../services/shifts.service";
import * as classesService from "../../../services/classes.service";
import * as usersService from "../../../services/users.service";

// Components
import Loader from "../../../components/basics/Loader";
import Paginator from "../../../components/Paginator/Paginator";
import CustomToast from "../../../components/basics/CustomToast/CustomToast";
import AdminEnrollmentRow from "../../../components/AdminEnrollmentRow/AdminEnrollmentRow";

// External Libraries
import { Button, ButtonGroup, Dropdown, Form } from "react-bootstrap";

export default function AdminEnrollments() {
  const value = useContext(AuthContext);

  const cols = [
    { field: 'actions', header: 'Acciones', type: 'actions' },
    { field: 'shift.class.title', header: 'Clase', type: 'relation', relationField: 'shift.id_class', relationTable: 'classes' },
    { field: 'shift.title', header: 'Comisión', type: 'relation', relationField: 'id_shift', relationTable: 'shifts' },
    { field: 'user.email', header: 'Usuario', type: 'relation', relationField: 'id_user', relationTable: 'users' },
  ]

  const [showToast, setShowToast] = useState(null);
  const [request, setRequest] = useState({
    page: 0,
    limit: 10,
    filter: [{ field: 'undefined', value: 'undefined' }],
    sort: { field: 'undefined', direction: 1 },
  });

  const fetchEnrollments = async (request, signal) => {
    const result = await enrollmentsService.findQuery(request, signal);
    return result[0];
  }

  const fetchShifts = async (request, signal) => {
    const result = await shiftsService.findQuery(request, signal);
    return result[0];
  }

  const fetchClasses = async (signal) => {
    const result = await classesService.find(signal);
    return result;
  }

  const fetchUsers = async (signal) => {
    const result = await usersService.find(signal);
    return result;
  }

  const { data: enrollments, isLoading, isError, error, refetch } = useQuery(
    'enrollments',
    async ({ signal }) => fetchEnrollments({ ...request, filter: JSON.stringify(request.filter), sort: JSON.stringify(request.sort) }, signal),
    {
      staleTime: Infinity,
      retry: 2,
    }
  );

  const { data: shifts, refetch: refetchShifts } = useQuery(
    'shifts',
    async ({ signal }) => fetchShifts(request.filter.filter(x => x.field === 'shift.id_class').length > 0 ? { filter: JSON.stringify([{ field: "id_class", value: request.filter.filter(x => x.field === 'shift.id_class')[0].value }]) } : { filter: JSON.stringify([{ "field": "undefined", "value": "undefined" }]) }, signal),
    {
      staleTime: Infinity,
      retry: 2,
    }
  );

  const { data: classes } = useQuery(
    'classesAll',
    async ({ signal }) => fetchClasses(signal),
    {
      staleTime: Infinity,
      retry: 2,
    }
  );

  const { data: users } = useQuery(
    'users',
    async ({ signal }) => fetchUsers(signal),
    {
      staleTime: Infinity,
      retry: 2,
    }
  );

  useEffect(() => {
    refetch();
    refetchShifts();
  }, [request, refetch, refetchShifts]);


  function handleFilter(field, value) {
    if (request.filter.some(x => x.field === field)) {
      request.filter[request.filter.findIndex(x => x.field === field)] = { field, value }
    } else {
      request.filter.push({ field, value })
    }

    setRequest({ ...request, page: 0 });
  }

  function handleSort(field) {
    const parsedSort = request.sort
    if (parsedSort.field === field) {
      setRequest({ ...request, page: 0, sort: { field, direction: parsedSort.direction === 1 ? -1 : 1 } });
    } else {
      setRequest({ ...request, page: 0, sort: { field, direction: 1 } });
    }
  }

  function handleClear(field) {
    request.filter[request.filter.findIndex(x => x.field === field)] = {}
    setRequest({ ...request });
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
          <th className="col-header" scope="col" key={col.relationTable}>
            <Dropdown as={ButtonGroup}>
              <Button className="col-label" variant="link" onClick={(e) => { e.preventDefault(); handleSort(col.field) }}>
                <span>{col.header}</span>
                {request.sort.field === col.field && <span className={"pi pi-sort-alpha" + (request.sort.direction === 1 ? "-down" : "-down-alt")}></span>}
              </Button>

              <Dropdown.Toggle split as={request.filter.some(x => x.field === col.field) ? renderSelectedFilterMenu : renderFilterMenu} />


              <Dropdown.Menu className="cont-search">
                <Form onSubmit={(e) => { e.preventDefault(); handleFilter(col.field, e.target.filter.value) }}>
                  <Form.Control type="text" name="filter" autoFocus placeholder={"Buscar por " + col.header} />
                  <div className="d-flex mt-2 justify-content-end gap-2">
                    <Button variant="outline-secondary" onClick={(e) => { e.preventDefault(); handleClear(col.field) }}>Limpiar</Button>
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
                {request.sort.field === col.field && <span className={"pi pi-sort-numeric" + (request.sort.direction === 1 ? "-down" : "-down-alt")}></span>}
              </Button>
            </Dropdown>
          </th>
        )
      case 'relation':
        return (
          <th className="col-header" scope="col" key={col.field}>
            <Dropdown as={ButtonGroup}>
              <span>{col.header}</span>
              <Dropdown.Toggle split as={request.filter.some(x => x.field === col.relationField) ? renderSelectedFilterMenu : renderFilterMenu} />
              <Dropdown.Menu className="cont-search">

                <Form onSubmit={(e) => { e.preventDefault(); handleFilter(col.relationField, e.target.filter.value) }}>
                  <Form.Select id={col.field} name="filter">
                    {col.relationTable === 'classes' && (
                      classes?.map((x) => (
                        <option key={x._id} value={x._id}>{x.title}</option>
                      )) ?? <option key={0} disabled>No hay clases...</option>
                    )}
                    {col.relationTable === 'shifts' && (
                      shifts?.data?.map((x) => (
                        <option key={x._id} value={x._id}>{x.title}</option>
                      )) ?? <option key={0} disabled>No hay comisiones...</option>
                    )}
                    {col.relationTable === 'users' && (
                      users?.map((x) => (
                        <option key={x._id} value={x._id}>{x.email}</option>
                      )) ?? <option key={0} disabled>No hay usuarios...</option>
                    )}
                    {/* {col.relationTable === 'classes' ? (
                      classes?.map((x) => (
                        <option key={x._id} value={x._id}>{x.title}</option>
                      )) ?? <option key={0} disabled>No hay clases...</option>
                    ) : col.relationTable === 'shifts' ? (
                      shifts?.data?.map((x) => (
                        <option key={x._id} value={x._id}>{x.title}</option>
                      )) ?? <option key={0} disabled>No hay comisiones...</option>
                    ) : null} */}
                  </Form.Select>
                  <div className="d-flex mt-2 justify-content-end gap-2">
                    <Button variant="outline-secondary" onClick={(e) => { e.preventDefault(); handleClear(col.relationField) }}>Limpiar</Button>
                    <Button variant="primary" type="submit">Aplicar</Button>
                  </div>
                </Form>
              </Dropdown.Menu>
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
    <div className="cont-admin-shifts admin-table">
      <div className="d-md-flex justify-content-between align-items-center mb-3">

        <h1>Administrar Inscripciones</h1>
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
                {enrollments?.data.length > 0 ?
                  enrollments?.data?.map((item) => {
                    return <AdminEnrollmentRow props={{ item: item, refetch: refetch, cols: cols, showEdit: false, showDelete: true, setShowToast: setShowToast }} key={item._id} />
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
      {enrollments?.data.length > 0 &&
        <Paginator props={{ pages: enrollments?.pages ?? 0, count: enrollments?.count ?? 0, page: request.page, limit: request.limit, handlePaginate: handlePaginate, handlePaginateNext: handlePaginateNext, handlePaginatePrevious: handlePaginatePrevious }} />

      }
      <CustomToast props={{ data: showToast, setShowToast: setShowToast }} />

    </div>
  );
}
