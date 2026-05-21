import { Link } from "react-router-dom";
import { ArrowRight, LogIn, Lock } from "lucide-react";
import { useEvents } from "../hooks/useEvents";
import { useRecommendedEvent } from "../hooks/useRecommendedEvent";
import EventCard from "../components/EventCard";
import Spinner from "../components/Spinner";
import HomeHero from "../components/HomeHero";

function Home() {
  const { events, loading, error, requiresAuth } = useEvents();

  // Le hook gère sa propre logique (reco backend + fallback)
  const { recommendedEvent, loading: loadingReco } = useRecommendedEvent({
    fallbackEvents: events,
  });

  // Les 3 prochains événements pour la section agenda
  const upcomingEvents = events
    .filter((event) => new Date(event.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-white">

      {/* SECTION HERO */}
      <HomeHero
        recommendedEvent={recommendedEvent}
        loading={loadingReco}
      />

      {/* SECTION À PROPOS */}
      <section className="bg-blue-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block bg-blue-950 text-white px-4 py-1.5 rounded-full text-xs font-semibold mb-4 uppercase tracking-wide">
            Notre association
          </span>
          <h2 className="text-3xl md:text-4xl mb-6 font-light text-blue-950">
            À propos de Luxafro
          </h2>
          <p className="text-blue-900 text-lg max-w-3xl mx-auto leading-relaxed">
            Luxafro est une plateforme dédiée à la valorisation de la culture camerounaise.
            Nous organisons des événements, partageons des recettes traditionnelles et créons
            des liens entre les membres de notre communauté.
          </p>
        </div>
      </section>

      {/* SECTION PROCHAINS ÉVÉNEMENTS */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center mb-12">
            <span className="inline-block bg-blue-950 text-white px-4 py-1.5 rounded-full text-xs font-semibold mb-4 uppercase tracking-wide">
              Agenda
            </span>
            <h2 className="text-3xl md:text-4xl mb-4 font-light text-gray-900">
              Prochains événements
            </h2>
            <p className="text-gray-600 text-lg">
              Ne manquez pas nos évènements à venir
            </p>
          </div>

          {loading && (
            <div className="flex justify-center py-12">
              <Spinner />
            </div>
          )}

          {error && !loading && (
            <div className="text-center py-12">
              <p className="text-red-600">❌ {error}</p>
            </div>
          )}

          {requiresAuth && !loading && (
            <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-10 text-center max-w-2xl mx-auto">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-950 rounded-full mb-4">
                <Lock size={28} className="text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-blue-950 mb-3">
                Connectez-vous pour découvrir nos événements
              </h3>
              <p className="text-blue-900 mb-6 leading-relaxed">
                Rejoignez la communauté Luxafro pour accéder à tous nos événements
                culturels et participer à la valorisation de la culture camerounaise.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center space-x-2 bg-blue-950 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-md"
                >
                  <LogIn size={20} />
                  <span>Se connecter</span>
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center space-x-2 bg-white hover:bg-blue-50 text-blue-950 border-2 border-blue-950 px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  <span>Créer un compte</span>
                  <ArrowRight size={20} />
                </Link>
              </div>
            </div>
          )}

          {!loading && !error && !requiresAuth && upcomingEvents.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-700 text-lg">Aucun événement prévu pour le moment.</p>
              <p className="text-gray-500 mt-2">
                Revenez bientôt pour découvrir nos prochains événements !
              </p>
            </div>
          )}

          {!loading && !error && !requiresAuth && upcomingEvents.length > 0 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                {upcomingEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
              <div className="text-center">
                <Link
                  to="/events"
                  className="inline-flex items-center space-x-2 bg-blue-950 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors shadow-md hover:shadow-lg"
                >
                  <span>Voir tous les événements</span>
                  <ArrowRight size={20} />
                </Link>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}

export default Home;
