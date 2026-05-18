import { NavLink, Link } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Calendar,
  Mail,
  ArrowLeft,
} from "lucide-react";
import { useAdminContactMessages } from "../../hooks/useAdminContactMessages";

/**
 * Sidebar de navigation pour la partie admin
 */
function AdminSidebar() {
  // Compteur de messages non lus → badge dans le menu
  const { unreadCount } = useAdminContactMessages();

  const adminLinks = [
    {
      to: "/admin",
      label: "Tableau de bord",
      icon: LayoutDashboard,
      end: true,
    },
    {
      to: "/admin/users",
      label: "Utilisateurs",
      icon: Users,
    },
    {
      to: "/admin/events",
      label: "Événements",
      icon: Calendar,
    },
    {
      to: "/admin/contacts",
      label: "Messages",
      icon: Mail,
      badge: unreadCount, // Badge avec le compteur
    },
  ];

  return (
    <aside className="w-64 bg-gray-900 min-h-screen flex flex-col">

      {/* En-tête */}
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

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <p className="text-gray-500 text-xs uppercase tracking-wider mb-3 px-3 font-semibold">
          Menu
        </p>

        <ul className="space-y-1">
          {adminLinks.map((link) => {
            const Icon = link.icon;
            return (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.end}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-blue-950 text-white shadow-md"
                        : "text-gray-300 hover:bg-gray-800 hover:text-white"
                    }`
                  }
                >
                  <div className="flex items-center space-x-3">
                    <Icon size={18} />
                    <span>{link.label}</span>
                  </div>

                  {/* Badge pour les non-lus */}
                  {link.badge !== undefined && link.badge > 0 && (
                    <span className="bg-blue-500 text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center">
                      {link.badge > 99 ? "99+" : link.badge}
                    </span>
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Retour au site */}
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
