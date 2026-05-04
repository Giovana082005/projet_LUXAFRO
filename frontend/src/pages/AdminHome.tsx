import { Link, Outlet } from "react-router-dom";

export default function AdminHome() {
  return (
    <div>
      <nav style={{ display: "flex", gap: "20px" }}>
        <Link to="/admin/users">Users</Link>
        <Link to="/admin/events">Événements</Link>
      </nav>

      <Outlet />
    </div>
  );
}