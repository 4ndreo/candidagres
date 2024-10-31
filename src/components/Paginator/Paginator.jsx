import { useState } from 'react';
import './Paginator.css';


export default function Paginator({ props }) {
  const visiblePages = 5;
  const [startPage, setStartPage] = useState(1);
  const [endPage, setEndPage] = useState(visiblePages + 1);
  const [activePage, setActivePage] = useState(1);

  function handlePaginate(page) {
    setActivePage(page);
    props.handlePaginate(page - 1);
  }

  function handlePaginatePrevious(page) {
    if (page > 1) {
      setActivePage(prev => 0 < prev - 1 ? prev - 1 : 1);
      setStartPage((page - 1) % visiblePages === 0 ? page - visiblePages : startPage);
      setEndPage((page - 1) % visiblePages === 0 ? activePage : endPage);
      if (props.page >= props.limit) {
        props.handlePaginatePrevious(page);
      }
    }
  }

  function handlePaginateNext(page) {
    setActivePage(prev => prev + 1 <= props.pages ? prev + 1 : props.pages);
    setStartPage((page) % visiblePages === 0 ? page + 1 : startPage);
    setEndPage(page % visiblePages === 0 ? activePage + visiblePages + 1 : endPage);
    if ((props.page + props.limit) <= props.count) {
      props.handlePaginateNext(page);
    }
  }
  return (
    <nav aria-label="paginator-cont">
      <ul className="pagination justify-content-center">
        <li className="page-item">
          <button className={'page-link ' + (activePage === 1 ? 'disabled' : '')} onClick={() => handlePaginatePrevious(activePage)} aria-label="Anterior" aria-disabled={activePage === 1}>
          <span aria-hidden="true">&lsaquo;</span>
          </button>
        </li>
        {Array.from({ length: endPage - startPage }, (_, index) => {
          return (index + startPage <= props.pages && <li key={index} className={`page-item ${(props.page / props.limit === index + startPage - 1) ? 'active' : ''}`}>
            <button className="rounded-0 page-link" onClick={() => handlePaginate(index + startPage)}>
              {index + startPage}
            </button>
          </li>)
        }
        )}
        <li className="page-item">
          <button className={'page-link ' + (activePage === props.pages ? 'disabled' : '')} onClick={() => handlePaginateNext(activePage)} aria-label="Siguiente" aria-disabled={activePage === props.pages}>
            <span aria-hidden="true">&rsaquo;</span>
          </button>
        </li>
      </ul>
    </nav>
  )
}
