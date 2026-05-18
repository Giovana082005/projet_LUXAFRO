import { Link } from "react-router-dom";
import { ArrowRight, Calendar, MapPin, Sparkles } from "lucide-react";
import type { RecommendedEvent } from "../types/RecommendedEvent";
import { getImageUrl } from "../config/api";

interface HomeHeroProps {
  /** Événement recommandé renvoyé par le hook useRecommendedEvent */
  recommendedEvent?: RecommendedEvent | null;
  /** État de chargement pendant l'appel API */
  loading?: boolean;
}

function HomeHero({ recommendedEvent, loading = false }: HomeHeroProps) {
  // ============================================
  // ÉTAT DE CHARGEMENT (skeleton)
  // ============================================
  if (loading) {
    return (
      <section className="relative min-h-[600px] lg:min-h-[700px] bg-blue-950 overflow-hidden animate-pulse">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800"></div>
        <div className="relative z-10 max-w-5xl mx-auto px-6 py-20 h-full flex flex-col justify-center">
          <div className="h-6 w-48 bg-white/10 rounded-full mb-6"></div>
          <div className="h-16 w-3/4 bg-white/10 rounded mb-4"></div>
          <div className="h-16 w-1/2 bg-white/10 rounded mb-8"></div>
          <div className="h-4 w-2/3 bg-white/10 rounded"></div>
        </div>
      </section>
    );
  }

  // ============================================
  // FALLBACK GÉNÉRIQUE : aucune reco disponible
  // ============================================
  if (!recommendedEvent) {
    return <HomeHeroFallback />;
  }

  // ============================================
  // VUE PRINCIPALE : événement recommandé
  // ============================================
  const { event, reason_label } = recommendedEvent;

  // Si l'image_path est déjà une URL absolue (mock, CDN), on l'utilise telle quelle
  // Sinon on passe par getImageUrl pour préfixer avec l'URL du backend
  const rawPath = event.photos?.[0]?.image_path;
  const photoUrl = rawPath
    ? rawPath.startsWith("http")
      ? rawPath
      : getImageUrl(rawPath)
    : null;

  const formattedDate = new Date(event.date).toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const shortDescription =
    event.description.length > 160
      ? event.description.substring(0, 160).trim() + "…"
      : event.description;

  const badgeText = reason_label ?? "Recommandé pour vous";

  return (
    <section className="relative min-h-[600px] lg:min-h-[700px] flex items-center overflow-hidden">
      {photoUrl ? (
        <img
          src={photoUrl}
          alt={event.nom}
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1583308148860-d09ce009f203?auto=format&fit=crop&w=2000&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>
      )}

      <div className="absolute inset-0 bg-gradient-to-r from-blue-950/95 via-blue-950/70 to-blue-950/30"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-blue-950/80 via-transparent to-transparent"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="max-w-2xl">
          <span className="inline-flex items-center space-x-2 bg-white/15 backdrop-blur-sm text-white px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide border border-white/20 mb-6">
            <Sparkles size={14} />
            <span>{badgeText}</span>
          </span>

          {event.categories && event.categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {event.categories.slice(0, 3).map((cat) => (
                <span
                  key={cat.id}
                  className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-3 py-1 rounded-full text-xs font-medium"
                >
                  {cat.nom}
                </span>
              ))}
            </div>
          )}

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-white leading-tight mb-6">
            {event.nom}
          </h1>

          <p className="text-white/90 text-base md:text-lg leading-relaxed mb-6 max-w-xl">
            {shortDescription}
          </p>

          <div className="flex flex-wrap gap-x-6 gap-y-2 mb-8 text-white/90">
            <div className="flex items-center space-x-2">
              <Calendar size={18} className="text-white/70" />
              <span className="text-sm font-medium capitalize">{formattedDate}</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin size={18} className="text-white/70" />
              <span className="text-sm font-medium">{event.lieu}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to={`/events/${event.id}`}
              className="inline-flex items-center justify-center space-x-2 bg-white hover:bg-blue-50 text-blue-950 px-8 py-3.5 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              <span>Découvrir l'événement</span>
              <ArrowRight size={20} />
            </Link>

            <Link
              to="/events"
              className="inline-flex items-center justify-center space-x-2 bg-transparent hover:bg-white/10 text-white border-2 border-white/60 px-8 py-3.5 rounded-lg font-semibold transition-all backdrop-blur-sm"
            >
              <span>Voir tous les événements</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center text-white/60 animate-bounce">
        <span className="text-xs uppercase tracking-wider mb-2">Découvrir</span>
        <div className="w-6 h-10 border-2 border-white/40 rounded-full flex items-start justify-center p-1.5">
          <div className="w-1 h-2 bg-white/60 rounded-full"></div>
        </div>
      </div>
    </section>
  );
}

/**
 * Fallback générique : utilisateur non connecté ou aucune reco disponible
 */
function HomeHeroFallback() {
  return (
    <section
      className="relative min-h-[600px] lg:min-h-[700px] flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1583308148860-d09ce009f203?auto=format&fit=crop&w=2000&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-950/90 via-blue-900/80 to-blue-800/70"></div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
        <span className="inline-block bg-white/15 backdrop-blur-sm text-white px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide border border-white/20 mb-6">
          Plateforme culturelle camerounaise
        </span>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-white leading-tight mb-6">
          Vivez la richesse de la <br className="hidden md:block" />
          <span className="font-semibold">culture camerounaise</span>
        </h1>

        <p className="text-white/90 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-8">
          Une communauté, des événements, des traditions à célébrer ensemble.
          Découvrez et partagez notre patrimoine culturel.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            to="/events"
            className="inline-flex items-center space-x-2 bg-white hover:bg-blue-50 text-blue-950 px-8 py-3.5 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            <span>Voir les événements</span>
            <ArrowRight size={20} />
          </Link>

          <Link
            to="/register"
            className="inline-flex items-center space-x-2 bg-transparent hover:bg-white/10 text-white border-2 border-white px-8 py-3.5 rounded-lg font-semibold transition-all backdrop-blur-sm"
          >
            <span>Nous rejoindre</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default HomeHero;
