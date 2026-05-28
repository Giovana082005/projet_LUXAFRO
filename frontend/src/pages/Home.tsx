import { Link } from "react-router-dom";
import { ArrowRight, LogIn, Lock } from "lucide-react";
import { useEvents } from "../hooks/useEvents";
import { useRecommendedEvent } from "../hooks/useRecommendedEvent";
import EventCard from "../components/EventCard";
import Spinner from "../components/Spinner";
import HomeHero from "../components/HomeHero";
import AboutSection from "../components/AboutSection";

function Home() {
  const { events, loading, error, requiresAuth } = useEvents();
  const { recommendedEvent, loading: loadingReco } = useRecommendedEvent({
    fallbackEvents: events,
  });

  const upcomingEvents = events
    .filter((event) => new Date(event.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-white">

      {/* SECTION HERO */}
      <HomeHero recommendedEvent={recommendedEvent} loading={loadingReco} />

      {/* SECTION À PROPOS */}
      <AboutSection />

      {/* SECTION PROCHAINS ÉVÉNEMENTS */}
      <section className="bg-blue-50 py-16">
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
