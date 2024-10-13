import './CustomToast.css';
import { Toast, ToastContainer } from "react-bootstrap";

export default function CustomToast({ props }) {
  return <ToastContainer
    className="custom-toast p-3"
    position={props.data?.position}
    style={{ zIndex: 10 }}
  >
    <Toast
      onClose={() => props.setShowToast({ ...props.data, show: false })}
      show={props.data?.show || false}
      bg={props.data?.variant}
      delay={2000}
      autohide
      className='overflow-hidden'
    >
      <Toast.Header className={'text-' + props.data?.variant} closeButton={true}>
        <span className="negritas me-auto">{props.data?.title}</span>
      </Toast.Header>
      <Toast.Body className={'text-' + props.data?.variant}>{props.data?.message}</Toast.Body>
    </Toast>
  </ToastContainer>
}

// export default Header;
