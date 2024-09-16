import "./css/Store.css";
import { Outlet } from "react-router-dom";

export default function Store() {
  return (
    <main className="container main tienda-cont">
      <Outlet />
    </main>
  );
}
