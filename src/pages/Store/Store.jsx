import { Outlet } from "react-router-dom";

export default function StorePage() {
  return (
    <main className="container main">
      <Outlet />
    </main>
  );
}
