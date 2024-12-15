import { Outlet } from "react-router-dom";

export default function Admin() {
  return (
    <main className="container main">
      <Outlet />
    </main>
  );
}
