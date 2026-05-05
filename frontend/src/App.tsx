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

import AdminRoute from "./components/AdminRoute";
import ProtectedRoute from "./components/ProtectedRoute";
import Events from "./pages/Events";

function App() {
  return (
    <Routes>
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
      </Route>
      
    </Routes>
  );
}

export default App;