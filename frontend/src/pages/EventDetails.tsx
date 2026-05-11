import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Euro,
  Baby,
  ArrowLeft,
} from "lucide-react";
import { getImageUrl } from "../config/api";
import { useEvents } from "../hooks/useEvents";
import { Link,  useParams} from "react-router-dom";
import Spinner from "../components/Spinner";

function EventDetails() {
   const { id } = useParams();
   const { events, loading, error, refresh } = useEvents();
  const event = events.find((e) => e.id === Number(id));

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
  if (!event) {
    return <div>Événement introuvable</div>;
  }
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);

    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };
   const formatTime = (timeString: string | null) => {
    if (!timeString) return "";
    return timeString.substring(0, 5);
  };

  const formatHoraires = () => {
    const debut = formatTime(event.heure_debut);
    const fin = formatTime(event.heure_fin);

    if (debut && fin) {
      return `${debut} - ${fin}`;
    }

    return debut;
  };
   return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-lg overflow-hidden">
        {/* Header image */}
        {event.photos && event.photos.length > 0 ? (
          <div className="relative h-[400px]">
            <img
              src={getImageUrl(event.photos[0].image_path)}
              alt={event.nom}
              className="w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

            <div className="absolute bottom-8 left-8 text-white">
              <h1 className="text-4xl font-bold mb-2">{event.nom}</h1>

              <div className="flex flex-wrap gap-2">
                {event.categories?.map((cat) => (
                  <span
                    key={cat.id}
                     className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-sm"
                  >
                    {cat.nom}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-blue-950 text-white p-10">
            <h1 className="text-4xl font-bold mb-4">{event.nom}</h1>

            <div className="flex flex-wrap gap-2">
              {event.categories?.map((cat) => (
                <span
                  key={cat.id}
                  className="bg-white/20 px-3 py-1 rounded-full text-sm"
                >
                  {cat.nom}
                </span>
              ))}
            </div>
          </div>
        )}
         {/* Content */}
        <div className="p-8">
          {/* Retour */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-blue-900 hover:text-blue-700 mb-8 font-medium"
          >
            <ArrowLeft size={18} />
            Retour aux événements
          </Link>

          {/* Informations */}
          <div className="grid md:grid-cols-2 gap-6 mb-10">
            <div className="bg-gray-50 rounded-2xl p-5 space-y-4 border">
              <div className="flex items-center gap-3">
                <Calendar className="text-blue-700" />
                <span>{formatDate(event.date)}</span>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="text-blue-700" />
                <span>{formatHoraires()}</span>
              </div>
               <div className="flex items-center gap-3">
                <MapPin className="text-blue-700" />
                <span>{event.lieu}</span>
              </div>

              {event.nombre_participants && (
                <div className="flex items-center gap-3">
                  <Users className="text-blue-700" />
                  <span>{event.nombre_participants} places disponibles</span>
                </div>
              )}

              {event.tarif !== null && (
                <div className="flex items-center gap-3">
                  <Euro className="text-blue-700" />
                  <span>
                    {parseFloat(event.tarif) === 0
                      ? "Gratuit"
                      : `${event.tarif}€`}
                  </span>
                </div>
              )}
                {event.pour_enfant && (
                <div className="flex items-center gap-3 text-green-600 font-medium">
                  <Baby />
                  <span>Adapté aux enfants</span>
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <h2 className="text-2xl font-bold text-blue-950 mb-4">
                Description
              </h2>

              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {event.description}
              </p>
            </div>
          </div>
           {/* Galerie photos */}
          {event.photos && event.photos.length > 1 && (
            <div>
              <h2 className="text-2xl font-bold text-blue-950 mb-6">
                Galerie
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {event.photos.map((photo) => (
                  <img
                    key={photo.id}
                    src={getImageUrl(photo.image_path)}
                    alt={event.nom}
                    className="w-full h-64 object-cover rounded-2xl"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default EventDetails;