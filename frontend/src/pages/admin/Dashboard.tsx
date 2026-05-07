import { Link } from "react-router-dom";
import { Users, Calendar, ChefHat, ArrowRight } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

/**
 * Dashboard admin - Vue d'ensemble
 * Affiche un aperçu et les liens vers les sections de gestion
 */
function Dashboard() {
  const { user } = useAuth();

  //Cartes d'accès rapide aux sections admin
  const sections = [
    {
      to: "/admin/users",
      title: "Utilisateurs",
      description: "Gérer les membres et leurs rôles",
      icon: Users,
      available: true,
    },
    {
      to: "/admin/events",
      title: "Événements",
      description: "Créer et modifier les événements",
      icon: Calendar,
      available: false,
    },
  ];

  return (
    <div>
      
      {/*En-tête de la page */}
      <div className="mb-8">
        <h1 className="text-3xl font-light text-gray-900 mb-2">
          Tableau de bord
        </h1>
        <p className="text-gray-600">
          Bienvenue dans l'espace administrateur, {user?.name}
        </p>
      </div>

      {/*Grille des sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map((section) => {
          const Icon = section.icon;
          
          return (
            <Link 
              key={section.to} 
              to={section.to}
              className="bg-white border border-gray-200 hover:border-blue-950 hover:shadow-md rounded-lg p-6 transition-all"
            >
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