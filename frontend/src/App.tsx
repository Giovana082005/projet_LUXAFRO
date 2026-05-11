import { Routes, Route } from "react-router-dom";

//Layouts
import Layout from "./components/Layout";
import AdminLayout from "./components/admin/AdminLayout";

//Protections de routes
import ProtectedRoute from "./components/ProtectedRoute";
import AdminProtectedRoute from "./components/AdminProtectedRoute";

//Pages publiques
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Events from "./pages/Events";
import EventDetails from "./pages/EventDetails";

//Pages admin
import Dashboard from "./pages/admin/Dashboard";
import UsersManagement from "./pages/admin/UsersManagement";
import EventsManagement from "./pages/admin/EventsManagement";

function App() {
  return (
    <Routes>
      
      {/* Routes avec Layout principal (Header + Footer) */}
      <Route element={<Layout />}>
        
        {/* Routes publiques */}
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
      </Route>
      <Route
        path="/events/:id"
        element={
          <ProtectedRoute>
            <EventDetails />
          </ProtectedRoute>
        }
      />

      {/* Routes ADMIN (avec AdminLayout dédié) */}
      <Route 
        path="/admin" 
        element={
          <AdminProtectedRoute>
            <AdminLayout />
          </AdminProtectedRoute>
        }
      >
        {/* /admin  Dashboard */}
        <Route index element={<Dashboard />} />
        
        {/* /admin/users : Gestion utilisateurs */}
        <Route path="users" element={<UsersManagement />} />
        {/* /admin/events → Gestion événements */}
        <Route path="events" element={<EventsManagement />} />
      </Route>
      
    </Routes>
  );
}

export default App;