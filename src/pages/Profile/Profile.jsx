// Styles
import "./Profile.css";

// React
import { Outlet } from "react-router-dom";

// Services
import EnrollmentsProfileCard from "../../components/Profile/EnrollmentsProfileCard/EnrollmentsProfileCard";

export default function ProfilePage({ props }) {
  return (
    <main className="container main">
      <div className="grid">
        <div className="col-lg-6 m-auto d-flex flex-column gap-4">
          <Outlet />
          <EnrollmentsProfileCard props={{ setShowToast: props.setShowToast }} />
        </div>
      </div>
    </main>
  );
}
