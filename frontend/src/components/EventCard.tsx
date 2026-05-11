import { Calendar, MapPin, Users, Euro, Baby, Clock } from "lucide-react";
import type { Event } from "../types/Event";
import { getImageUrl } from "../config/api";

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
  const formatTime = (timeString: string | null) => {
    if (!timeString) return "";
    return timeString.substring(0, 5);
  };

  //Format combiné des horaires
  const formatHoraires = () => {
    const debut = formatTime(event.heure_debut);
    const fin = formatTime(event.heure_fin);
    
    if (debut && fin) {
      return `${debut} - ${fin}`;
    }
    return debut;
  };

  //  Récupérer la photo principale (la première du tableau)
  const photoUrl = event.photos && event.photos.length > 0
    ? getImageUrl(event.photos[0].image_path)
    : null;

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full border border-blue-50">
      
      {/* Header avec photo OU titre stylisé */}
      {photoUrl ? (
        // 📷 Avec photo : image en fond + overlay avec titre
        <div className="relative h-48 overflow-hidden flex-shrink-0">
          <img
            src={photoUrl}
            alt={event.nom}
            className="w-full h-full object-cover"
          />
          {/* Overlay dégradé pour la lisibilité du titre */}
          <div className="absolute inset-0 bg-gradient-to-t from-blue-950/80 to-transparent flex items-end p-4">
            <h2 className="text-xl font-semibold text-white">
              {event.nom}
            </h2>
          </div>
        </div>
      ) : (
        // Sans photo : header bleu marine uni avec titre
        <div className="h-28 bg-blue-950 flex items-center justify-center flex-shrink-0 px-4">
          <h2 className="text-2xl font-semibold text-white text-center">
            {event.nom}
          </h2>
        </div>
      )}

      {/* Contenu */}
      <div className="p-6 flex flex-col flex-grow">
        
        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {event.description}
        </p>

        {/*  Badges de catégories - utilise cat.nom maintenant */}
        {event.categories && event.categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {event.categories.map((cat) => (
              <span
                key={cat.id}
                className="bg-blue-50 text-blue-900 px-2.5 py-1 rounded-full text-xs font-semibold"
              >
                {cat.nom}
              </span>
            ))}
          </div>
        )}

        {/*  Informations */}
        <div className="space-y-2 text-sm text-gray-700 mb-4">
          
          {/*  Date */}
          <div className="flex items-center space-x-2">
            <Calendar size={16} className="text-blue-700 flex-shrink-0" />
            <span>{formatDate(event.date)}</span>
          </div>

          {/*  Horaires (début + fin si disponible) */}
          <div className="flex items-center space-x-2">
            <Clock size={16} className="text-blue-700 flex-shrink-0" />
            <span>{formatHoraires()}</span>
          </div>

          {/*  Lieu */}
          <div className="flex items-center space-x-2">
            <MapPin size={16} className="text-blue-700 flex-shrink-0" />
            <span>{event.lieu}</span>
          </div>

          {/*  Places */}
          {event.nombre_participants && (
            <div className="flex items-center space-x-2">
              <Users size={16} className="text-blue-700 flex-shrink-0" />
              <span>{event.nombre_participants} places</span>
            </div>
          )}

          {/*  Tarif */}
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

          {/*  Adapté aux enfants */}
          {event.pour_enfant && (
            <div className="flex items-center space-x-2">
              <Baby size={16} className="text-green-600 flex-shrink-0" />
              <span className="text-green-600 font-medium">Adapté aux enfants</span>
            </div>
          )}
        </div>

        {/*  Bouton CTA */}
        <button className="mt-auto w-full bg-blue-950 hover:bg-blue-700 text-white py-2.5 rounded-lg font-semibold transition-colors">
          En savoir plus
        </button>
      </div>
    </div>
  );
}

export default EventCard;