import { useEvents } from "../hooks/useEvents";
import Spinner from "../components/Spinner";
import EventCard from "../components/EventCard";

function Events() {
  const { events, loading, error, refresh } = useEvents();

  //Affichage pendant le chargement
  if (loading) {
    return <Spinner fullScreen />;
  }

  //Affichage en cas d'erreur
  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md text-center shadow-md">
          <p className="text-red-700 mb-4 font-medium">❌ {error}</p>
          <button
            onClick={refresh}
            className="bg-blue-950 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        
        <div className="text-center mb-12">
          
          <span className="inline-block bg-blue-950 text-white px-4 py-1.5 rounded-full text-xs font-semibold mb-4 uppercase tracking-wide">
            Tous nos événements
          </span>
          
          <h1 className="text-4xl md:text-5xl mb-4 font-light text-gray-900">
            Événements à venir
          </h1>
          
          <p className="text-gray-600 text-lg">
            Découvrez nos prochains événements culturels
          </p>
          
          {events.length > 0 && (
            <p className="text-gray-500 text-sm mt-3">
              {events.length} événement{events.length > 1 ? "s" : ""} disponible{events.length > 1 ? "s" : ""}
            </p>
          )}
        </div>

        {events.length === 0 ? (
          <div className="text-center py-16 bg-blue-50 rounded-2xl">
            <p className="text-2xl text-blue-950 font-light">
              Aucun événement pour le moment
            </p>
            <p className="text-blue-700 mt-2">
              Revenez bientôt pour découvrir nos événements !
            </p>
          </div>
        ) : (
          /* Grille des événements avec EventCard */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Events;