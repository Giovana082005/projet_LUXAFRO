import { Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

import AdminHome from "./pages/AdminHome";
import AdminUsers from "./pages/AdminUsers";
import AdminEvents from "./pages/AdminEvents";
import EventDetails from "./pages/EventDetails";
import AdminRoute from "./components/AdminRoute";
import EditEvent from "./pages/EditEvent";

function App() {
  return (
    <Routes>
      {/* routes publiques */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/events/:id" element={<EventDetails />} />
      

      {/* routes admin */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminHome />
          </AdminRoute>
        }
      >
        <Route index element={<Navigate to="users" />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="events" element={<AdminEvents />} />
        <Route path="events/:id" element={<EventDetails />} />
        <Route path="/admin/events/:id/edit" element={<EditEvent />} />
      </Route>
    </Routes>
  );
}

export default App;