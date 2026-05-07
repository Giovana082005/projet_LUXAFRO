import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import { useAuth } from "../../hooks/useAuth";

/**
 * Layout commun à toutes les pages admin
 * Affiche la sidebar à gauche et le contenu de la page à droite
 */
function AdminLayout() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      
      {/*Sidebar fixe à gauche */}
      <AdminSidebar />
      
      {/*Contenu principal */}
      <div className="flex-1 flex flex-col">
        
        {/* Topbar avec infos user */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider">
              Espace administrateur
            </p>
            <p className="text-sm text-gray-900 font-medium">
              Bonjour, {user?.name} 
            </p>
          </div>
          
          {/*Badge admin */}
          <span className="bg-blue-950 text-white px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide">
            Administrateur
          </span>
        </header>

        {/*Conteneur des pages enfants */}
        <main className="flex-1 p-8 overflow-auto">
          {/*  React Router injecte le bon composant */}
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;