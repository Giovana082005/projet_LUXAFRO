import { NavLink, Link } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  ChefHat,
  ArrowLeft 
} from "lucide-react";

/**
 * Sidebar de navigation pour la partie admin
 * Affiche les liens vers les différentes pages admin
 */
function AdminSidebar() {
  //Liste des liens admin
  const adminLinks = [
    { 
      to: "/admin", 
      label: "Tableau de bord", 
      icon: LayoutDashboard,
      end: true 
    },
    { 
      to: "/admin/users", 
      label: "Utilisateurs", 
      icon: Users 
    },
    { 
      to: "/admin/events", 
      label: "Événements", 
      icon: Calendar 
    },
  ];

  return (
    <aside className="w-64 bg-gray-900 min-h-screen flex flex-col">
      
      {/* En-tête de la sidebar */}
      <div className="p-6 border-b border-gray-800">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">Lx</span>
          </div>
          <div>
            <p className="text-white font-bold text-lg leading-tight">Luxafro</p>
            <p className="text-blue-400 text-xs uppercase tracking-wider">Admin</p>
          </div>
        </Link>
      </div>

      {/* Navigation principale */}
      <nav className="flex-1 p-4">
        <p className="text-gray-500 text-xs uppercase tracking-wider mb-3 px-3 font-semibold">
          Menu
        </p>
        
        <ul className="space-y-1">
          {adminLinks.map((link) => {
            const Icon = link.icon;
            return (
              <li key={link.to}>
                {/* NavLink applique automatiquement une classe "active"
                    quand l'URL matche */}
                <NavLink
                  to={link.to}
                  end={link.end}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-blue-950 text-white shadow-md"
                        : "text-gray-300 hover:bg-gray-800 hover:text-white"
                    }`
                  }
                >
                  <Icon size={18} />
                  <span>{link.label}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* retour vers le site */}
      <div className="p-4 border-t border-gray-800">
        <Link
          to="/"
          className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
        >
          <ArrowLeft size={18} />
          <span>Retour au site</span>
        </Link>
      </div>
    </aside>
  );
}

export default AdminSidebar;