import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Users,
  Euro,
  Baby,
  AlertCircle,
  LogIn,
} from "lucide-react";
import { useEvent } from "../hooks/useEvent";
import { getImageUrl } from "../config/api";
import Spinner from "../components/Spinner";
import { useState } from "react";
import ReservationModal from "../components/ReservationModal";
import { useAuth } from "../hooks/useAuth";

/**
 * Page détail d'un événement
 * Style : sobre, aéré, hiérarchie claire
 */
function EventDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { event, loading, error, notFound } = useEvent(id);
  const [showModal, setShowModal] = useState(false);
  const { isAuthenticated } = useAuth();

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  const formatTime = (timeString: string | null) =>
    timeString ? timeString.substring(0, 5) : "";

  // ============================================
  // ÉTATS DE CHARGEMENT / ERREUR
  // ============================================
  if (loading) return <Spinner fullScreen />;

  if (notFound) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle size={28} className="text-blue-700" />
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-3">
            Événement introuvable
          </h1>
          <p className="text-gray-600 mb-8 leading-relaxed">
            L'événement que vous cherchez n'existe pas ou a été supprimé.
          </p>
          <Link
            to="/events"
            className="inline-flex items-center space-x-2 bg-blue-950 hover:bg-blue-800 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            <ArrowLeft size={18} />
            <span>Retour aux événements</span>
          </Link>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-6">
        <div className="bg-red-50 border border-red-100 rounded-2xl p-8 max-w-md text-center">
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

  const photoUrl =
    event.photos && event.photos.length > 0
      ? getImageUrl(event.photos[0].image_path)
      : null;

  return (
    <div className="min-h-screen bg-white">

      {/* ============================================ */}
      {/* HERO */}
      {/* ============================================ */}
      <section className="relative">
        {photoUrl ? (
          <div className="relative h-[420px] md:h-[520px] lg:h-[560px] overflow-hidden">
            <img
              src={photoUrl}
              alt={event.nom}
              className="w-full h-full object-cover"
            />
            {/* Gradient plus subtil → la photo respire davantage */}
            <div className="absolute inset-0 bg-gradient-to-t from-blue-950/90 via-blue-950/30 to-blue-950/10"></div>

            {/* Bouton retour discret */}
            <div className="absolute top-6 left-6 md:top-8 md:left-8">
              <Link
                to="/events"
                className="inline-flex items-center space-x-2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-white/20"
              >
                <ArrowLeft size={16} />
                <span>Retour</span>
              </Link>
            </div>

            {/* Titre en bas du hero */}
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 lg:p-14">
              <div className="max-w-5xl mx-auto">
                {event.categories && event.categories.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {event.categories.map((cat) => (
                      <span
                        key={cat.id}
                        className="bg-white/15 backdrop-blur-sm border border-white/20 text-white px-3 py-1 rounded-full text-xs font-medium"
                      >
                        {cat.nom}
                      </span>
                    ))}
                  </div>
                )}

                <h1 className="text-3xl md:text-5xl lg:text-6xl font-light text-white leading-tight max-w-3xl">
                  {event.nom}
                </h1>
              </div>
            </div>
          </div>
        ) : (
          // Version sans photo : header bleu marine plus aéré
          <div className="bg-blue-950 py-20 md:py-28 lg:py-32 px-6">
            <div className="max-w-5xl mx-auto">
              <Link
                to="/events"
                className="inline-flex items-center space-x-2 text-white/70 hover:text-white text-sm font-medium mb-8 transition-colors"
              >
                <ArrowLeft size={16} />
                <span>Retour</span>
              </Link>

              {event.categories && event.categories.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-5">
                  {event.categories.map((cat) => (
                    <span
                      key={cat.id}
                      className="bg-white/15 backdrop-blur-sm border border-white/20 text-white px-3 py-1 rounded-full text-xs font-medium"
                    >
                      {cat.nom}
                    </span>
                  ))}
                </div>
              )}

              <h1 className="text-3xl md:text-5xl lg:text-6xl font-light text-white leading-tight max-w-3xl">
                {event.nom}
              </h1>
            </div>
          </div>
        )}
      </section>

      {/* ============================================ */}
      {/* CONTENU */}
      {/* ============================================ */}
      <section className="max-w-5xl mx-auto px-6 py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-12">

          {/* COLONNE GAUCHE : Description */}
          <div className="lg:col-span-2">
            <h2 className="text-xs uppercase tracking-[0.15em] text-blue-700 font-semibold mb-4">
              À propos
            </h2>

            <p className="text-gray-700 text-base md:text-lg leading-relaxed whitespace-pre-line">
              {event.description}
            </p>

            {/* Badge enfants — harmonisé avec le reste */}
            {event.pour_enfant && (
              <div className="mt-8 inline-flex items-center space-x-2 bg-blue-50 border border-blue-100 text-blue-900 px-4 py-2 rounded-lg">
                <Baby size={16} className="text-blue-700" />
                <span className="text-sm font-medium">
                  Adapté aux enfants
                </span>
              </div>
            )}
          </div>

          {/* COLONNE DROITE : Sidebar Infos pratiques */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 lg:p-7 lg:sticky lg:top-24 shadow-sm">

              <h2 className="text-xs uppercase tracking-[0.15em] text-blue-700 font-semibold mb-6">
                Informations
              </h2>

              <div className="space-y-5">

                <InfoRow
                  icon={<Calendar size={16} className="text-blue-700" />}
                  label="Date"
                  value={formatDate(event.date)}
                  capitalize
                />

                <InfoRow
                  icon={<Clock size={16} className="text-blue-700" />}
                  label="Horaires"
                  value={
                    formatTime(event.heure_debut) +
                    (event.heure_fin ? ` - ${formatTime(event.heure_fin)}` : "")
                  }
                />

                <InfoRow
                  icon={<MapPin size={16} className="text-blue-700" />}
                  label="Lieu"
                  value={event.lieu}
                />

                {event.nombre_participants && (
                  <InfoRow
                    icon={<Users size={16} className="text-blue-700" />}
                    label="Places"
                    value={`${event.nombre_participants} personnes`}
                  />
                )}

                {event.tarif !== null && (
                  <InfoRow
                    icon={<Euro size={16} className="text-blue-700" />}
                    label="Tarif"
                    value={
                      parseFloat(event.tarif) === 0
                        ? "Gratuit"
                        : `${event.tarif}€`
                    }
                  />
                )}
              </div>

              {/* Séparateur subtil avant le CTA */}
              <div className="mt-7 pt-6 border-t border-gray-100">
                {isAuthenticated ? (
                  <button
                    type="button"
                    onClick={() => setShowModal(true)}
                    className="w-full bg-blue-950 hover:bg-blue-800 text-white py-3 rounded-lg font-semibold transition-colors"
                  >
                    S'inscrire à l'événement
                  </button>
                ) : (
                  <div className="space-y-3">
                    <Link
                      to="/login"
                      state={{
                        from: `/events/${event.id}`,
                        message:
                          "Connectez-vous pour vous inscrire à cet événement",
                      }}
                      className="w-full bg-blue-950 hover:bg-blue-800 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
                    >
                      <LogIn size={16} />
                      <span>Se connecter pour s'inscrire</span>
                    </Link>
                    <p className="text-center text-xs text-gray-500 leading-relaxed">
                      Pas encore de compte ?{" "}
                      <Link
                        to="/register"
                        state={{
                          from: `/events/${event.id}`,
                          message:
                            "Votre compte est créé ! Connectez-vous pour finaliser votre inscription.",
                        }}
                        className="text-blue-700 hover:underline font-medium"
                      >
                        Créer un compte
                      </Link>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modal de réservation */}
      {showModal && (
        <ReservationModal
          event={event}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

/**
 * Ligne d'information dans la sidebar
 * Style aéré : icône légère sur fond clair, typo discrète
 */
interface InfoRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  capitalize?: boolean;
}

function InfoRow({ icon, label, value, capitalize }: InfoRowProps) {
  return (
    <div className="flex items-start space-x-3">
      <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-gray-500 font-medium mb-0.5">
          {label}
        </p>
        <p
          className={`text-sm text-gray-900 font-medium break-words ${
            capitalize ? "capitalize" : ""
          }`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

export default EventDetail;
