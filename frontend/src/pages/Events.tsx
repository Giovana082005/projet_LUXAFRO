import { useSearchParams } from "react-router-dom";
import { useEvents } from "../hooks/useEvents";
import { useCategories } from "../hooks/useCategories";
import Spinner from "../components/Spinner";
import EventCard from "../components/EventCard";
import CategoryFilter from "../components/CategoryFilter";

function Events() {
  //  Hook React Router pour synchroniser le filtre avec l'URL
  // /events?category=danse → searchParams.get("category") = "danse"
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategory = searchParams.get("category");

  //  Hooks de données
  const { events, loading, error, refresh } = useEvents(selectedCategory || undefined);
  const { categories } = useCategories();

  // Quand l'utilisateur clique sur une catégorie
  const handleCategoryChange = (categoryName: string | null) => {
    if (categoryName === null) {
      // "Toutes" → on retire le paramètre de l'URL
      setSearchParams({});
    } else {
      // Sinon → on met le paramètre
      setSearchParams({ category: categoryName });
    }
  };

  // Affichage pendant le chargement initial
  if (loading && events.length === 0) {
    return <Spinner fullScreen />;
  }

  //  Erreur
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-black">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md text-center">
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
        
        {/*  En-tête */}
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
        </div>

        {/* Filtre par catégorie */}
        {categories.length > 0 && (
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onChange={handleCategoryChange}
          />
        )}

        {/*  Compteur (s'adapte au filtre) */}
        <p className="text-center text-gray-500 text-sm mb-8">
          {loading ? (
            "Chargement..."
          ) : (
            <>
              {events.length} événement{events.length > 1 ? "s" : ""}
              {selectedCategory && (
                <> dans la catégorie <span className="font-semibold text-blue-950">{selectedCategory}</span></>
              )}
            </>
          )}
        </p>

        {/*  Aucun événement (cas filtré) */}
        {events.length === 0 ? (
          <div className="text-center py-16 bg-blue-50 rounded-2xl">
            <p className="text-2xl text-blue-950 font-light mb-2">
              {selectedCategory 
                ? `Aucun événement dans la catégorie "${selectedCategory}"`
                : "Aucun événement pour le moment"}
            </p>
            <p className="text-blue-700">
              {selectedCategory 
                ? "Essayez une autre catégorie ou revenez plus tard !"
                : "Revenez bientôt pour découvrir nos événements !"}
            </p>
            {selectedCategory && (
              <button
                onClick={() => handleCategoryChange(null)}
                className="mt-4 text-blue-950 hover:underline font-semibold"
              >
                Voir tous les événements →
              </button>
            )}
          </div>
        ) : (
          /* Grille des événements */
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