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
import EventDetail from "./pages/EventDetail";

//Pages admin
import Dashboard from "./pages/admin/Dashboard";
import UsersManagement from "./pages/admin/UsersManagement";
import EventsManagement from "./pages/admin/EventsManagement";
import EventForm from "./pages/admin/EventForm";
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
        <Route path="/events" element={<Events /> }/>
      {/* Détail d'un événement */}
      <Route path="/events/:id"element={<EventDetail />}/>
      </Route>
      

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
        {/* Création */}
        <Route path="events/new" element={<EventForm />} />

        {/* Édition */}
        <Route path="events/:id/edit" element={<EventForm />} />
              </Route>
      
    </Routes>
  );
}

export default App;