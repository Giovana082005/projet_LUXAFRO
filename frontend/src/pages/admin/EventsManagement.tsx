import { Link } from "react-router-dom";
import { Calendar, Plus, CheckCircle2, Baby } from "lucide-react";
import { useAdminEvents } from "../../hooks/useAdminEvents";
import EventsTable from "../../components/admin/EventsTable";
import Spinner from "../../components/Spinner";

/**
 * Page de gestion des événements (admin)
 * Affiche la liste, les stats, et permet de créer/modifier/supprimer
 */
function EventsManagement() {
  // Hook centralisé
  const { events, loading, error, deleteEvent } = useAdminEvents();

  //  Calcul des statistiques (valeurs dérivées)
  const stats = {
    total: events.length,
    aVenir: events.filter((e) => new Date(e.date) >= new Date()).length,
    pourEnfants: events.filter((e) => e.pour_enfant).length,
  };

  return (
    <div>
      
      {/*  En-tête avec bouton "Nouvel événement" */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-light text-gray-900 mb-2">
            Gestion des événements
          </h1>
          <p className="text-gray-600">
            Créez, modifiez et organisez vos événements culturels
          </p>
        </div>
        
        {/* Bouton de création */}
        <Link
          to="/admin/events/new"
          className="inline-flex items-center space-x-2 bg-blue-950 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-semibold transition-colors shadow-sm"
        >
          <Plus size={18} />
          <span>Nouvel événement</span>
        </Link>
      </div>

      {/*  Cartes statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        
        {/* Carte Total */}
        <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
              Total
            </span>
            <Calendar size={18} className="text-blue-700" />
          </div>
          <p className="text-3xl font-semibold text-gray-900">
            {stats.total}
          </p>
        </div>

        {/* Carte À venir */}
        <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
              À venir
            </span>
            <CheckCircle2 size={18} className="text-blue-950" />
          </div>
          <p className="text-3xl font-semibold text-blue-950">
            {stats.aVenir}
          </p>
        </div>

        {/* Carte Pour enfants */}
        <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
              Pour enfants
            </span>
            <Baby size={18} className="text-green-600" />
          </div>
          <p className="text-3xl font-semibold text-green-600">
            {stats.pourEnfants}
          </p>
        </div>
      </div>

      {/*  Tableau - Gestion des états */}
      
      {/* Chargement */}
      {loading && (
        <div className="flex justify-center py-20">
          <Spinner />
        </div>
      )}

      {/*  Erreur */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-700 font-medium">❌ {error}</p>
        </div>
      )}

      {/* Tableau */}
      {!loading && !error && (
        <EventsTable
          events={events}
          onDelete={deleteEvent}
        />
      )}
    </div>
  );
}

export default EventsManagement;