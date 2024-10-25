
export default function CustomBadge({ props }) {
  return (
    <span className="badge badge-inscripto bg-secondary d-flex align-item-center gap-1">
      <span className={"pi pi-" + props.icon}></span>
      <span>{props.label}</span>
    </span>
  )
}
