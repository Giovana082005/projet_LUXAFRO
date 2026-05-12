import { useParams, Link, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Euro, 
  Baby,
  AlertCircle
} from "lucide-react";
import { useEvent } from "../hooks/useEvent";
import { getImageUrl } from "../config/api";
import Spinner from "../components/Spinner";

/**
 *  Page détail d'un événement
 * Affiche toutes les infos d'un événement avec sa photo en grand
 */
function EventDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { event, loading, error, notFound } = useEvent(id);

  //  Formater la date complète
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  //  Formater les horaires
  const formatTime = (timeString: string | null) => {
    if (!timeString) return "";
    return timeString.substring(0, 5);
  };

  //  État de chargement
  if (loading) {
    return <Spinner fullScreen />;
  }

  //  Événement introuvable
  if (notFound) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={32} className="text-blue-700" />
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Événement introuvable
          </h1>
          <p className="text-gray-600 mb-6">
            L'événement que vous cherchez n'existe pas ou a été supprimé.
          </p>
          <Link
            to="/events"
            className="inline-flex items-center space-x-2 bg-blue-950 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            <ArrowLeft size={18} />
            <span>Retour aux événements</span>
          </Link>
        </div>
      </div>
    );
  }

  //  Erreur technique
  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md text-center">
          <p className="text-red-700 mb-4 font-medium">❌ {error}</p>
          <button
            onClick={() => navigate(-1)}
            className="text-blue-950 hover:underline font-semibold"
          >
            Retour
          </button>
        </div>
      </div>
    );
  }

  if (!event) return null;

  //  Photo principale
  const photoUrl = event.photos && event.photos.length > 0
    ? getImageUrl(event.photos[0].image_path)
    : null;

  return (
    <div className="min-h-screen bg-white">
      
      {/* ============================================ */}
      {/*  SECTION HÉRO avec photo en grand */}
      {/* ============================================ */}
      <section className="relative">
        
        {photoUrl ? (
          //  Avec photo : image en grand avec overlay
          <div className="relative h-[400px] md:h-[500px] overflow-hidden">
            <img
              src={photoUrl}
              alt={event.nom}
              className="w-full h-full object-cover"
            />
            {/* Overlay dégradé sombre */}
            <div className="absolute inset-0 bg-gradient-to-t from-blue-950/95 via-blue-950/40 to-transparent"></div>
            
            {/*  Bouton retour en haut à gauche */}
            <div className="absolute top-6 left-6">
              <Link
                to="/events"
                className="inline-flex items-center space-x-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-white/20"
              >
                <ArrowLeft size={16} />
                <span>Retour</span>
              </Link>
            </div>

            {/*  Titre en bas */}
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
              <div className="max-w-5xl mx-auto">
                {/* Catégories en haut du titre */}
                {event.categories && event.categories.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {event.categories.map((cat) => (
                      <span
                        key={cat.id}
                        className="bg-white/15 backdrop-blur-sm border border-white/20 text-white px-3 py-1 rounded-full text-xs font-semibold"
                      >
                        {cat.nom}
                      </span>
                    ))}
                  </div>
                )}
                
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-light text-white leading-tight">
                  {event.nom}
                </h1>
              </div>
            </div>
          </div>
        ) : (
          //  Sans photo : header bleu marine
          <div className="bg-blue-950 py-16 md:py-24 px-6">
            <div className="max-w-5xl mx-auto">
              {/* Bouton retour */}
              <Link
                to="/events"
                className="inline-flex items-center space-x-2 text-white/80 hover:text-white text-sm font-medium mb-6 transition-colors"
              >
                <ArrowLeft size={16} />
                <span>Retour</span>
              </Link>

              {/* Catégories */}
              {event.categories && event.categories.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {event.categories.map((cat) => (
                    <span
                      key={cat.id}
                      className="bg-white/15 backdrop-blur-sm border border-white/20 text-white px-3 py-1 rounded-full text-xs font-semibold"
                    >
                      {cat.nom}
                    </span>
                  ))}
                </div>
              )}

              <h1 className="text-3xl md:text-5xl lg:text-6xl font-light text-white leading-tight">
                {event.nom}
              </h1>
            </div>
          </div>
        )}
      </section>

      {/* ============================================ */}
      {/*  SECTION DÉTAILS */}
      {/* ============================================ */}
      <section className="max-w-5xl mx-auto px-6 py-12 lg:py-16">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/*  Colonne gauche : Description */}
          <div className="lg:col-span-2">
            <h2 className="text-xs uppercase tracking-wider text-blue-700 font-semibold mb-3">
              À propos de cet événement
            </h2>
            
            <p className="text-gray-700 text-base leading-relaxed whitespace-pre-line">
              {event.description}
            </p>

            {/*  Badge enfants si applicable */}
            {event.pour_enfant && (
              <div className="mt-6 inline-flex items-center space-x-2 bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-lg">
                <Baby size={18} />
                <span className="font-medium">Cet événement est adapté aux enfants</span>
              </div>
            )}
          </div>

          {/*  Colonne droite : Infos pratiques (sticky) */}
          <div className="lg:col-span-1">
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 lg:sticky lg:top-24">
              
              <h2 className="text-xs uppercase tracking-wider text-blue-700 font-semibold mb-4">
                Informations pratiques
              </h2>
              
              <div className="space-y-4">
                
                {/*  Date */}
                <div className="flex items-start space-x-3">
                  <div className="w-9 h-9 bg-blue-950 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Calendar size={18} className="text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-0.5">
                      Date
                    </p>
                    <p className="text-sm text-gray-900 font-medium capitalize">
                      {formatDate(event.date)}
                    </p>
                  </div>
                </div>

                {/*  Horaires */}
                <div className="flex items-start space-x-3">
                  <div className="w-9 h-9 bg-blue-950 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock size={18} className="text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-0.5">
                      Horaires
                    </p>
                    <p className="text-sm text-gray-900 font-medium">
                      {formatTime(event.heure_debut)}
                      {event.heure_fin && ` - ${formatTime(event.heure_fin)}`}
                    </p>
                  </div>
                </div>

                {/*  Lieu */}
                <div className="flex items-start space-x-3">
                  <div className="w-9 h-9 bg-blue-950 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin size={18} className="text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-0.5">
                      Lieu
                    </p>
                    <p className="text-sm text-gray-900 font-medium">
                      {event.lieu}
                    </p>
                  </div>
                </div>

                {/*  Places */}
                {event.nombre_participants && (
                  <div className="flex items-start space-x-3">
                    <div className="w-9 h-9 bg-blue-950 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Users size={18} className="text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-0.5">
                        Places disponibles
                      </p>
                      <p className="text-sm text-gray-900 font-medium">
                        {event.nombre_participants} personnes
                      </p>
                    </div>
                  </div>
                )}

                {/*  Tarif */}
                {event.tarif !== null && (
                  <div className="flex items-start space-x-3">
                    <div className="w-9 h-9 bg-blue-950 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Euro size={18} className="text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-0.5">
                        Tarif
                      </p>
                      <p className="text-sm text-gray-900 font-medium">
                        {parseFloat(event.tarif) === 0 ? "Gratuit" : `${event.tarif}€`}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/*  CTA inscription (placeholder) */}
              <button
                type="button"
                className="mt-6 w-full bg-blue-950 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors shadow-md"
                onClick={() => alert("Fonctionnalité d'inscription à venir !")}
              >
                S'inscrire à l'événement
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default EventDetail;