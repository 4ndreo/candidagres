import "./Profile.css";

import { Outlet } from "react-router-dom";

export default function ProfilePage() {
  return (
    <main className="container main">
      <div className="grid">
        <div className="col-lg-6 m-auto">
          <Outlet />
        </div>
      </div>
    </main>

    // TODO: Add user's enrollments
  );
}
