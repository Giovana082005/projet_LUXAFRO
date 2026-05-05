import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
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
import CreateEvent from "./pages/CreateEvent";

import AdminRoute from "./components/AdminRoute";
import ProtectedRoute from "./components/ProtectedRoute";
import Events from "./pages/Events";

function App() {
  return (
    <Routes>
<<<<<<< HEAD
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
        <Route path="events/:id/edit" element={<EditEvent />} /> 
        <Route path="events/create" element={<CreateEvent />} />
=======
       {/* Routes avec Layout (header + footer) */}
      <Route element={<Layout />}>
          {/* routes publiques */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          {/* Routes protégées (utilisateur connecté requis) */}
        <Route
          path="/events"
          element={
            <ProtectedRoute>
              <Events />
            </ProtectedRoute>
          }
        />

          {/* routes admin */}
          <Route path="/admin" element={<AdminRoute> <AdminHome /></AdminRoute>} >
            <Route index element={<Navigate to="users" />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="events" element={<AdminEvents />} />
          </Route>
>>>>>>> 152dae34ebf835a86e07201b76424e61f5be5b34
      </Route>
      
    </Routes>
  );
}

export default App;