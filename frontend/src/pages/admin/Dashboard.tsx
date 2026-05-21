import { Link } from "react-router-dom";
import { Users, Calendar, Mail, ArrowRight } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useAdminContactMessages } from "../../hooks/useAdminContactMessages";

/**
 * Dashboard admin - Vue d'ensemble
 */
function Dashboard() {
  const { user } = useAuth();
  const { unreadCount, messages } = useAdminContactMessages();

  const sections = [
    {
      to: "/admin/users",
      title: "Utilisateurs",
      description: "Gérer les membres et leurs rôles",
      icon: Users,
    },
    {
      to: "/admin/events",
      title: "Événements",
      description: "Créer et modifier les événements",
      icon: Calendar,
    },
    {
      to: "/admin/contacts",
      title: "Messages",
      description: `${messages.length} message${messages.length > 1 ? "s" : ""} reçu${messages.length > 1 ? "s" : ""}`,
      icon: Mail,
      badge: unreadCount,
    },
  ];

  return (
    <div>

      {/* En-tête */}
      <div className="mb-8">
        <h1 className="text-3xl font-light text-gray-900 mb-2">
          Tableau de bord
        </h1>
        <p className="text-gray-600">
          Bienvenue dans l'espace administrateur, {user?.name}
        </p>
      </div>

      {/* Alerte si messages non lus — épingle l'attention */}
      {unreadCount > 0 && (
        <div className="mb-6 bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-950 rounded-lg flex items-center justify-center flex-shrink-0">
              <Mail size={20} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-blue-950">
                Vous avez {unreadCount} message{unreadCount > 1 ? "s" : ""} non lu{unreadCount > 1 ? "s" : ""}
              </p>
              <p className="text-xs text-blue-700">
                Pensez à répondre aux demandes en attente.
              </p>
            </div>
          </div>
          <Link
            to="/admin/contacts"
            className="bg-blue-950 hover:bg-blue-800 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex-shrink-0"
          >
            Voir
          </Link>
        </div>
      )}

      {/* Grille des sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map((section) => {
          const Icon = section.icon;

          return (
            <Link
              key={section.to}
              to={section.to}
              className="relative bg-white border border-gray-200 hover:border-blue-950 hover:shadow-md rounded-2xl p-6 transition-all"
            >
              {/* Badge non-lus en haut à droite */}
              {section.badge !== undefined && section.badge > 0 && (
                <span className="absolute top-4 right-4 bg-blue-500 text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-[24px] text-center">
                  {section.badge > 99 ? "99+" : section.badge}
                </span>
              )}

              <div className="w-12 h-12 bg-blue-950 rounded-lg flex items-center justify-center mb-4">
                <Icon size={22} className="text-white" />
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {section.title}
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                {section.description}
              </p>

              <div className="flex items-center text-blue-950 text-sm font-semibold">
                <span>Accéder</span>
                <ArrowRight size={16} className="ml-1" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default Dashboard;
