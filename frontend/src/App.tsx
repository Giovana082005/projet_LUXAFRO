import { Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

import AdminHome from "./pages/AdminHome";
import AdminUsers from "./pages/AdminUsers";
import AdminEvents from "./pages/AdminEvents";

import Events from "./pages/Events"; 
import EventDetails from "./pages/EventDetails";
import EditEvent from "./pages/EditEvent";

import AdminRoute from "./components/AdminRoute";

function App() {
  return (
    <Routes>
      {/* ROUTES PUBLIQUES */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/events" element={<Events />} /> 
      <Route path="/events/:id" element={<EventDetails />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* ROUTES ADMIN */}
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
        <Route path="events/:id/edit" element={<EditEvent />} /> {/* ✅ corrigé */}
      </Route>
    </Routes>
  );
}

export default App;