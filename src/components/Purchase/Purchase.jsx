import "./Purchase.css";
import { DateTime } from "luxon";

export default function Purchase({ props }) {
  return (
    <div className="cont-purchase">
      <p className="purchase-date">{DateTime.fromISO(props.compra.created_at, { setZone: true }).toLocaleString(DateTime.DATETIME_FULL)}</p> 
      {/* TODO: Agregar fecha de entrega del producto cuando se configure la funcionalidad */}
      <div className="purchase-details">
        <div className="purchase-summary">
          <h2>Resumen</h2>
          <p><span className="negritas">Importe total:</span> ${props.compra.totalCost}</p>
          <p><span className="negritas">Cantidad total:</span> {props.compra.totalQuantity} artículos</p>
          <p><span className="negritas">Demora estimada:</span> {props.compra.totalDelay} días</p>
          <p><span className="negritas">Fecha de entrega:</span> {props.compra.delivered_at ? DateTime.fromISO(props.compra.delivered_at, { setZone: true }).toFormat('dd-MM-yyyy') : 'Pendiente'}</p>
        </div>
        <div className="purchase-items">
          <h2>Artículos</h2>
          <ul>
            {props.compra.items.map((producto, subIndex) => (
              <li key={`${props.index}-${subIndex}`}>
                <div className="d-flex justify-content-between align-items-center">

                  <div>
                    <h3 className="mb-0 me-2 d-inline">{producto.title}</h3><span className="badge text-bg-primary">{producto.material}</span>
                  </div>
                  <div><span>{producto.quantity} x </span><span>${producto.unit_price}</span></div>
                </div>
                <p>{producto.description}</p>

              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
