import './Paginator.css';
import { Toast, ToastContainer } from "react-bootstrap";

export default function Paginator({ props }) {
  return <nav aria-label="pagination">
    <ul className="pagination justify-content-center">
      <li className="page-item">
        <button className={'page-link ' + (props.activePage === 1 ? 'disabled' : '')} onClick={() => props.handlePaginatePrevious(props.activePage)} aria-label="Anterior" aria-disabled={props.activePage === 1}>
          <span aria-hidden="true">&laquo;</span>
        </button>
        {/* <a className="page-link" href="#" aria-label="Previous">
                      <span aria-hidden="true">&laquo;</span>
                  </a> */}
      </li>
      {Array.from({ length: props.endPage - props.startPage }, (_, index) => {
        return (index + props.startPage <= props.pages && <li key={index} className={`page-item ${(props.page / props.limit + 1 === index + props.startPage) ? 'active' : ''}`}>
          <button className="rounded-0 page-link" onClick={() => props.handlePaginate(index)}>
            {index + props.startPage}
          </button>
        </li>)
      }
      )}
      {/* {Array.from({ length: props.pages }, (_, index) => (
          <li key={index} className={`page-item ${(props.page / request.limit === index) ? 'active' : ''}`}>
              <button className="rounded-0 page-link" onClick={() => props.handlePaginate(index)}>
                  {index + 1}
              </button>
          </li>
      ))} */}
      <li className="page-item">
        <button className={'page-link ' + (props.activePage === props.pages ? 'disabled' : '')} onClick={() => props.handlePaginateNext(props.activePage)} aria-label="Siguiente" aria-disabled={props.activePage === props.pages}>
          <span aria-hidden="true">&raquo;</span>
        </button>
      </li>
    </ul>
  </nav>
}
