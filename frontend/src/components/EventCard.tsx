import { Calendar, MapPin, Euro, Baby, ArrowRight } from "lucide-react";
import type { Event } from "../types/Event";
import { getImageUrl,FALLBACK_IMAGE_URL } from "../config/api";
import { Link } from "react-router-dom";

interface EventCardProps {
  event: Event;
}
  
function EventCard({ event }: EventCardProps) {
  // Date courte façon "30 mai 2026"
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Jour + mois isolés pour la pastille calendrier
  const dateParts = (dateString: string) => {
    const date = new Date(dateString);
    return {
      day: date.toLocaleDateString("fr-FR", { day: "2-digit" }),
      month: date
        .toLocaleDateString("fr-FR", { month: "short" })
        .replace(".", "")
        .toUpperCase(),
    };
  };

  const { day, month } = dateParts(event.date);

  // Photo principale ou image générique
  const photoUrl =
    event.photos && event.photos.length > 0
      ? getImageUrl(event.photos[0].image_path)
      : FALLBACK_IMAGE_URL;// Image générique de secours

  const isFree = event.tarif !== null && parseFloat(event.tarif) === 0;

  return (
    <Link
      to={`/events/${event.id}`}
      className="group relative block rounded-2xl overflow-hidden shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 h-[420px]"
    >
      {/* Image plein cadre */}
      <img
        src={photoUrl}
        alt={event.nom}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />

      {/* Dégradé bleu marine (cohérent avec le Hero) */}
      <div className="absolute inset-0 bg-gradient-to-t from-blue-950 via-blue-950/60 to-transparent" />

      {/* Pastille date (haut gauche) */}
      <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl px-3 py-2 text-center shadow-lg leading-none">
        <div className="text-xl font-bold text-blue-950">{day}</div>
        <div className="text-[10px] font-semibold text-blue-700 tracking-wide">
          {month}
        </div>
      </div>

      {/* Badge tarif (haut droite) */}
      {event.tarif !== null && (
        <div className="absolute top-4 right-4 bg-white/15 backdrop-blur-md border border-white/25 text-yellow-500 px-3 py-1.5 rounded-full text-sm font-semibold shadow-lg">
          {isFree ? "Gratuit" : `${event.tarif}€`}
        </div>
      )}

      {/* Badge enfants (sous le tarif, si applicable) */}
      {event.pour_enfant && (
        <div className="absolute top-16 right-4 inline-flex items-center gap-1 bg-red-400 backdrop-blur-sm text-white px-2.5 py-1 rounded-full text-xs font-medium shadow-lg">
          <Baby size={13} />
          <span>Enfants</span>
        </div>
      )}

      {/* Contenu en overlay (bas) */}
      <div className="absolute bottom-0 inset-x-0 p-5 text-white">
        {/* Catégories */}
        {event.categories && event.categories.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {event.categories.slice(0, 3).map((cat) => (
              <span
                key={cat.id}
                className="bg-white/15 backdrop-blur-sm border border-white/20 px-2.5 py-0.5 rounded-full text-[11px] font-medium"
              >
                {cat.nom}
              </span>
            ))}
          </div>
        )}

        {/* Titre */}
        <h2 className="text-xl font-semibold leading-tight mb-2 line-clamp-2">
          {event.nom}
        </h2>

        {/* Description courte */}
        <p className="text-white/75 text-sm leading-snug mb-4 line-clamp-2">
          {event.description}
        </p>

        {/* Essentiel : date + lieu */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-white/90 mb-4">
          <div className="flex items-center gap-1.5">
            <Calendar size={15} className="text-white/60" />
            <span>{formatDate(event.date)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin size={15} className="text-white/60" />
            <span>{event.lieu}</span>
          </div>
        </div>

        {/* CTA discret qui se révèle au survol */}
        <div className="inline-flex items-center gap-2 text-sm font-semibold text-white group-hover:gap-3 transition-all">
          <span>En savoir plus</span>
          <ArrowRight
            size={16}
            className="transition-transform group-hover:translate-x-1"
          />
        </div>
      </div>
    </Link>
  );
}

export default EventCard;
