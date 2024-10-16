import "./css/Store.css";
import { Outlet } from "react-router-dom";

export default function StorePage() {
  return (
    <main className="container main tienda-cont">
      <Outlet />
    </main>
  );
}
