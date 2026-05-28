import { useState, useEffect } from "react";
import type { Event } from "../types/Event";
import type { RecommendedEvent } from "../types/RecommendedEvent";
import cultureEventImage from "../assets/images/events/default.jpg";
// ============================================================
// MOCK — à retirer une fois l'endpoint backend disponible
// ============================================================
const USE_MOCK = true;

const MOCK_RECOMMENDED_EVENT: RecommendedEvent = {
  reason: "user_preferences",
  reason_label: "Parce que vous aimez la culture camerounaise",
  event: {
    id: 99,
    nom: "Nuit des Cultures Camerounaises",
    description:
      "Une soirée exceptionnelle célébrant la diversité des peuples du Cameroun. Au programme : danses traditionnelles, musique live, exposition artisanale et dégustation de plats typiques des différentes régions. Un voyage sensoriel et culturel à ne pas manquer.",
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    heure_debut: "19:00:00",
    heure_fin: "23:30:00",
    lieu: "Salle des Fêtes de Nancy",
    categories: [
      { id: 1, nom: "Culture" },
      { id: 2, nom: "Musique" },
      { id: 3, nom: "Gastronomie" },
    ],
    photos: [
      {
        id: 1,
        event_id: 99,
        image_path:
          //"https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=2000&q=80",
          "/images/events/exposition.jpg",
          //cultureEventImage,
      },
    ],
    pour_enfant: true,
    nombre_participants: 200,
    tarif: "15.00",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
};
// ============================================================

interface UseRecommendedEventOptions {
  /**
   * Liste d'événements à utiliser comme fallback
   * si le backend ne renvoie pas de recommandation personnalisée.
   * Le hook prendra le plus proche dans le temps.
   */
  fallbackEvents?: Event[];
}

interface UseRecommendedEventResult {
  recommendedEvent: RecommendedEvent | null;
  loading: boolean;
  error: string | null;
}

/**
 * Hook pour récupérer l'événement recommandé à afficher dans le hero.
 *
 * Stratégie :
 *  1. Appelle l'endpoint de recommandation (basé sur le profil utilisateur)
 *  2. Si pas de reco personnalisée → fallback sur le prochain événement de la liste
 *  3. Si rien du tout → null (le hero affichera son fallback générique)
 */
export function useRecommendedEvent(
  options: UseRecommendedEventOptions = {}
): UseRecommendedEventResult {
  const { fallbackEvents = [] } = options;

  const [recommendedEvent, setRecommendedEvent] =
    useState<RecommendedEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchRecommendation = async () => {
      setLoading(true);
      setError(null);

      try {
        // ============================================================
        // MOCK — remplacer ce bloc par le vrai appel API quand prêt
        // ============================================================
        if (USE_MOCK) {
          // Simule un délai réseau
          await new Promise((resolve) => setTimeout(resolve, 300));
          if (!cancelled) {
            setRecommendedEvent(MOCK_RECOMMENDED_EVENT);
            setLoading(false);
          }
          return;
        }
        // ============================================================

        // VRAIE IMPLÉMENTATION (à activer quand le backend est prêt) :
        //
        // const response = await api.get<RecommendedEvent>("/recommendations/featured");
        // if (!cancelled) {
        //   setRecommendedEvent(response.data);
        // }

        // Fallback si pas de reco : prochain événement chronologique
        if (!cancelled) {
          const fallback = getNextUpcomingEvent(fallbackEvents);
          if (fallback) {
            setRecommendedEvent({
              event: fallback,
              reason: "upcoming",
              reason_label: "Prochain événement à venir",
            });
          } else {
            setRecommendedEvent(null);
          }
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Erreur lors du chargement de la recommandation"
          );

          // En cas d'erreur, on tente quand même le fallback
          const fallback = getNextUpcomingEvent(fallbackEvents);
          if (fallback) {
            setRecommendedEvent({
              event: fallback,
              reason: "upcoming",
              reason_label: "Prochain événement à venir",
            });
          }
          setLoading(false);
        }
      }
    };

    fetchRecommendation();

    return () => {
      cancelled = true;
    };
  }, [fallbackEvents]);

  return { recommendedEvent, loading, error };
}

/**
 * Retourne l'événement le plus proche dans le futur, ou null si aucun.
 */
function getNextUpcomingEvent(events: Event[]): Event | null {
  const upcoming = events
    .filter((e) => new Date(e.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return upcoming[0] ?? null;
}