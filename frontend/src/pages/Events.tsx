import { Calendar, MapPin, Users, Euro, Baby } from "lucide-react";
import { useEvents } from "../hooks/useEvents";
import Spinner from "../components/Spinner";

function Events() {
  const { events, loading, error, refresh } = useEvents();

  // Formater la date en français
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Formater l'heure (HH:mm)
  const formatTime = (timeString: string) => {
    if (!timeString) return "";
    return timeString.substring(0, 5); // "14:30:00" → "14:30"
  };

  // Affichage pendant le chargement
  if (loading) {
    return <Spinner fullScreen />;
  }

  // Affichage en cas d'erreur
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <div className="bg-red-900/30 border border-red-500 rounded-lg p-6 max-w-md text-center">
          <p className="text-red-300 mb-4">❌ {error}</p>
          <button
            onClick={refresh}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* En-tête */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Événements à venir
          </h1>
          <p className="text-gray-400 text-lg">
            Découvrez nos prochains événements culturels
          </p>
          <p className="text-gray-500 text-sm mt-2">
            {events.length} événement{events.length > 1 ? "s" : ""} disponible{events.length > 1 ? "s" : ""}
          </p>
        </div>

        {/* Aucun événement */}
        {events.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-2xl text-gray-400">Aucun événement pour le moment</p>
            <p className="text-gray-500 mt-2">Revenez bientôt pour découvrir nos événements !</p>
          </div>
        ) : (
          /* Grille des événements */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div
                key={event.id}
                className="bg-gray-800 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
              >
                {/* Header coloré */}
                <div className="h-32 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <h2 className="text-3xl font-bold text-white px-4 text-center">
                    {event.nom}
                  </h2>
                </div>

                <div className="p-6">
                  {/* Description */}
                  <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                    {event.description}
                  </p>

                  {/* Catégories */}
                  {event.categories && event.categories.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {event.categories.map((cat) => (
                        <span
                          key={cat}
                          className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full text-xs font-semibold"
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Informations */}
                  <div className="space-y-2 text-sm text-gray-300 mb-4">
                    <div className="flex items-center space-x-2">
                      <Calendar size={16} className="text-blue-400 flex-shrink-0" />
                      <span>{formatDate(event.date)} à {formatTime(event.horaire)}</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <MapPin size={16} className="text-blue-400 flex-shrink-0" />
                      <span>{event.lieu}</span>
                    </div>

                    {event.nombre_participants && (
                      <div className="flex items-center space-x-2">
                        <Users size={16} className="text-blue-400 flex-shrink-0" />
                        <span>{event.nombre_participants} places</span>
                      </div>
                    )}

                    {event.tarif !== null && (
                      <div className="flex items-center space-x-2">
                        <Euro size={16} className="text-blue-400 flex-shrink-0" />
                        <span>
                          {parseFloat(event.tarif) === 0
                            ? "Gratuit"
                            : `${event.tarif}€`}
                        </span>
                      </div>
                    )}

                    {event.pour_enfant && (
                      <div className="flex items-center space-x-2">
                        <Baby size={16} className="text-green-400 flex-shrink-0" />
                        <span className="text-green-400">Adapté aux enfants</span>
                      </div>
                    )}
                  </div>

                  {/* Bouton */}
                  <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-semibold transition-colors">
                    En savoir plus
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Events;