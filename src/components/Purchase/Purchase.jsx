import "./Purchase.css";
import { DateTime } from "luxon";

export default function Purchase({ props }) {
  return (
    <div className="cont-purchase">
      <div className={"purchase-date " + (props.purchase.delivered_at ? 'bg-success ' : 'bg-warning')}>
        <div className={"purchase-date-body d-flex flex-column flex-md-row justify-content-between " + (props.purchase.delivered_at ? 'text-success' : 'text-secondary')}>


          <span>{DateTime.fromISO(props.purchase.created_at, { setZone: true }).toLocaleString(DateTime.DATETIME_FULL)}</span>
          <span className="fst-italic d-flex align-items-center gap-1"><span className={props.purchase.delivered_at ? 'pi pi-check' : 'pi pi-clock'}></span>Entrega: {props.purchase.delivered_at ? DateTime.fromISO(props.purchase?.delivered_at, { setZone: true }).toFormat('dd-MM-yyyy') : 'En proceso'}</span>
        </div>
      </div>
      <div className="purchase-details">
        <div className="purchase-summary">
          <h2>Resumen</h2>
          <p><span className="negritas">Importe total:</span> ${props.purchase.totalCost}</p>
          <p><span className="negritas">Cantidad total:</span> {props.purchase.totalQuantity} artículos</p>
          <p><span className="negritas">Demora estimada:</span> {props.purchase.totalDelay} días</p>
        </div>
        <div className="purchase-items">
          <h2>Artículos</h2>
          <ul>
            {props.purchase.items.map((product, subIndex) => (
              <li key={`${props.index}-${subIndex}`}>
                <div className="d-flex justify-content-between align-items-center">

                  <div>
                    <h3 className="mb-0 me-2 d-inline">{product.title}</h3><span className="badge text-bg-primary">{product.material}</span>
                  </div>
                  <div><span>{product.quantity} x </span><span>${product.unit_price}</span></div>
                </div>
                <p>{product.description}</p>

              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
