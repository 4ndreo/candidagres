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
import AdminEnrollmentRow from "../../../components/AdminEnrollmentRow/AdminEnrollmentRow";

// External Libraries
import { Button, ButtonGroup, Dropdown, Form } from "react-bootstrap";
import * as ExcelJS from 'exceljs';
import * as FileSaver from 'file-saver';
import { DateTime } from "luxon";

export default function AdminEnrollments({ props }) {
  const value = useContext(AuthContext);

  const cols = [
    { field: 'actions', header: 'Acciones', type: 'actions' },
    { field: 'shift.class.title', header: 'Clase', type: 'relation', relationField: 'shift.id_class', relationTable: 'classes' },
    { field: 'shift.title', header: 'Comisión', type: 'relation', relationField: 'id_shift', relationTable: 'shifts' },
    { field: 'user.email', header: 'Usuario', type: 'relation', relationField: 'id_user', relationTable: 'users' },
  ]

  const [exporting, setExporting] = useState(false)
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
    'classesEnrollments',
    async ({ signal }) => fetchClasses(signal),
    {
      staleTime: Infinity,
      retry: 2,
    }
  );

  const { data: users } = useQuery(
    'usersEnrollments',
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

  async function fetchEnrollmentsExcel() {
    const result = await enrollmentsService.findQuery(
      {
        page: 0,
        limit: 999999,
        filter: JSON.stringify(request.filter),
        sort: JSON.stringify(request.sort)
      }
    )
    return result[0];

  }

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
          <th className="col-header align-middle" scope="col" key={col.relationTable}>
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
          <th className="col-header align-middle" scope="col" key={col.field}>
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
          <th className="col-header align-middle" scope="col" key={col.field}>
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
          <th scope="col" className="col-header align-middle" key={col.field}>{col.header}</th>
        )
      default:
        return (
          <th scope="col" className="col-header align-middle" key={col.field}>{col.header}</th>
        )

    }
  }

  const renderTotalCost = () => {
    return <p className="mb-0 text-start"><span className="negritas">Total de cuotas mensuales:</span> ${enrollments?.totalAmount}</p>
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

  async function exportToExcel() {
    setExporting(true);
    const tabs = [
      { label: 'Inscriptos', column: 'N° Documento' },
    ]

    const workbook = new ExcelJS.Workbook();

    const promises = tabs.map(async tab => {
      const enrollmentsExcel = await fetchEnrollmentsExcel();
      let key = '';
      let total = 0;
      let subtotalRow = {};
      const subtotalData = [];
      const subtotalRowsIndex = [];

      // Orders array by user
      const items = enrollmentsExcel.data.sort(function (a, b) {
        if (a.user.id_document < b.user.id_document) {
          return -1;
        }
        return 1
      });

      items.forEach(row => {

        // Verifies if it's watching a new user and pushes and resets the subtotalRow if so
        if (key !== row.user.id_document) {

          if (Object.keys(subtotalRow).length !== 0) {

            subtotalData.push(subtotalRow);
            subtotalRowsIndex.push(subtotalData.length + 1);
            // subtotalRowsIndex.push(subtotalData.length);

          }

          key = row.user.id_document;
          total = 0;
          subtotalRow = {};
        }
        total = !isNaN(row.shift.class.price) ? total + Number(row.shift.class.price) : total;

        subtotalRow = {
          Clase: '',
          Comisión: '',
          [tab.column]: '',
          Nombre: '',
          Apellido: '',
          'Cuota': total,
          Pagado: '',
        }

        Object.entries(row).forEach(([key, value]) => {
          if (key !== tab.column && key !== 'Cuota') {
            subtotalRow.Clase = '';
            subtotalRow.Comisión = '';
            subtotalRow.Nombre = row.user.first_name;
            subtotalRow.Apellido = row.user.last_name;
            subtotalRow.Pagado = '';
          }
        });

        // Pushes the non subtotal rows into the array.
        subtotalData.push(
          {
            Clase: row.shift.class.title,
            Comisión: row.shift.title,
            [tab.column]: row.user.id_document,
            Nombre: row.user.first_name,
            Apellido: row.user.last_name,
            Cuota: row.shift.class.price,
            Pagado: ''
          }
        );
      });
      // Pushes the last subtotal row into the array.
      subtotalData.push(subtotalRow);
      subtotalRowsIndex.push(subtotalData.length + 1);

      if (items && items?.length > 0) {
        const worksheet = workbook.addWorksheet(tab.label);
        worksheet.addTable({
          name: `${tab.label}Table`,
          ref: 'A1',
          headerRow: true,
          totalsRow: false,
          style: {
            theme: 'TableStyleMedium2',
            showRowStripes: true,
          },
          columns: Object.keys(subtotalData[0]).map(key => ({ name: key, filterButton: true })),
          rows: subtotalData.map(row => Object.values(row)),
        });

        worksheet.eachRow((row, rowNumber) => {
          if (subtotalRowsIndex.includes(rowNumber)) {
            // Style header row
            row.eachCell(cell => {
              cell.font = { bold: true };
              cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFFF00' },
              };
            });
          }
        })
      }
    });

    await Promise.all(promises);
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    FileSaver.saveAs(blob, `Inscripciones_${DateTime.now().setZone('America/Buenos_Aires').toFormat('yyyyMM')}.xlsx`);
    setExporting(false);

  }

  return (
    <div className="cont-admin-shifts admin-table">
      <div className="d-md-flex justify-content-between align-items-center mb-3">
        <h1>Administrar Inscripciones</h1>
        <Button variant="success" className="btn-icon" onClick={exportToExcel}>
          <span className={exporting ? 'pi pi-spin pi-spinner' : 'pi pi-file-excel'}></span>{exporting ? 'Exportando...' : 'Exportar'}
        </Button>
      </div>
      {renderTotalCost()}
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
                    return <AdminEnrollmentRow props={{ item: item, refetch: refetch, cols: cols, showEdit: false, showDelete: true, setShowToast: props.setShowToast }} key={item._id} />
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
    </div>
  );
}
