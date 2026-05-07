import { Calendar, MapPin, Users, Euro, Baby } from "lucide-react";
import type { Event } from "../types/Event";

interface EventCardProps {
  event: Event;
}

function EventCard({ event }: EventCardProps) {
  //Formater la date en français
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  //Formater l'heure (HH:mm)
  const formatTime = (timeString: string) => {
    if (!timeString) return "";
    return timeString.substring(0, 5);
  };

  return (
    
    <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full border border-blue-50">
      
    
      <div className="h-28 bg-blue-950 flex items-center justify-center flex-shrink-0 px-4">
        <h2 className="text-2xl font-semibold text-white text-center">
          {event.nom}
        </h2>
      </div>

    
      <div className="p-6 flex flex-col flex-grow">
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {event.description}
        </p>

        {event.categories && event.categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {event.categories.map((cat) => (
              <span
                key={cat}
                className="bg-blue-50 text-blue-900 px-2.5 py-1 rounded-full text-xs font-semibold"
              >
                {cat}
              </span>
            ))}
          </div>
        )}

        <div className="space-y-2 text-sm text-gray-700 mb-4">
          <div className="flex items-center space-x-2">
            <Calendar size={16} className="text-blue-700 flex-shrink-0" />
            <span>{formatDate(event.date)} à {formatTime(event.horaire)}</span>
          </div>

          <div className="flex items-center space-x-2">
            <MapPin size={16} className="text-blue-700 flex-shrink-0" />
            <span>{event.lieu}</span>
          </div>

          {event.nombre_participants && (
            <div className="flex items-center space-x-2">
              <Users size={16} className="text-blue-700 flex-shrink-0" />
              <span>{event.nombre_participants} places</span>
            </div>
          )}

          {event.tarif !== null && (
            <div className="flex items-center space-x-2">
              <Euro size={16} className="text-blue-700 flex-shrink-0" />
              <span>
                {parseFloat(event.tarif) === 0
                  ? "Gratuit"
                  : `${event.tarif}€`}
              </span>
            </div>
          )}

          {event.pour_enfant && (
            <div className="flex items-center space-x-2">
              <Baby size={16} className="text-green-600 flex-shrink-0" />
              <span className="text-green-600 font-medium">Adapté aux enfants</span>
            </div>
          )}
        </div>

        <button className="mt-auto w-full bg-blue-950 hover:bg-blue-700 text-white py-2.5 rounded-lg font-semibold transition-colors">
          En savoir plus
        </button>
      </div>
    </div>
  );
}

export default EventCard;