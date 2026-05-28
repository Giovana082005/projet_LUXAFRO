import { useEffect, useRef, useState } from "react";
import { Sparkles } from "lucide-react";

// --- Activités de l'association ---
const activities = [
  {
    image: "/images/about/atelier.jpg",
    label: "Ateliers",
    description:
      "Ateliers créatifs et pédagogiques pour enfants et adultes : artisanat, danse, langue et culture camerounaise.",
  },
  {
    image: "/images/about/decouverte.jpg",
    label: "Découverte",
    description:
      "Espaces de découverte pensés pour petits et grands, pour explorer notre patrimoine de façon ludique et interactive.",
  },
  {
    image: "/images/about/degustation.jpg",
    label: "Dégustation",
    description:
      "Soirées et stands de dégustation autour des saveurs authentiques de la gastronomie camerounaise.",
  },
  {
    image: "/images/about/foot.jpg",
    label: "Activités sportives",
    description:
      "Tournois, rencontres et activités sportives pour rassembler la communauté dans la bonne humeur.",
  },
  {
    image: "/images/about/exposition.jpg",
    label: "Expositions",
    description:
      "Expositions d'œuvres d'artistes afro-camerounais : produits, accéssoires de mode et arts contemporains.",
  },
];

// --- Hook animation séquentielle au scroll ---
function useSequentialReveal(itemCount: number, stepMs = 600) {
  const ref = useRef<HTMLDivElement>(null);
  const [revealedCount, setRevealedCount] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          observer.disconnect();
          for (let i = 0; i < itemCount; i++) {
            setTimeout(() => setRevealedCount((c) => c + 1), i * stepMs);
          }
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [itemCount, stepMs]);

  return { ref, revealedCount };
}

// --- Carte activité (photo ronde + texte) ---
function ActivityCard({
  activity,
  isVisible,
}: {
  activity: typeof activities[0];
  isVisible: boolean;
}) {
  return (
    <div
      style={{ transition: "opacity 900ms ease-out, transform 900ms ease-out" }}
      className={`flex items-start gap-6
        ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
    >
      {/* Photo ronde */}
      <div className="flex-shrink-0 w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden ring-4 ring-white/20 shadow-xl">
        <img
          src={activity.image}
          alt={activity.label}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Texte */}
      <div className="flex-1 pt-2">
        <h3 className="text-lg md:text-xl font-semibold text-white mb-2">
          {activity.label}
        </h3>
        <p className="text-white/70 text-sm md:text-base leading-relaxed">
          {activity.description}
        </p>
      </div>
    </div>
  );
}

// --- Composant principal ---
function AboutSection() {
  const { ref, revealedCount } = useSequentialReveal(activities.length + 1, 600);

  // Sépare les activités en 2 colonnes (3 gauche / 2 droite)
  const colLeft = activities.filter((_, i) => i % 2 === 0);
  const colRight = activities.filter((_, i) => i % 2 !== 0);

  return (
    <section
      ref={ref}
      className="relative py-16 overflow-hidden bg-gradient-to-b from-blue-950/90 via-blue-950/70 to-blue-950/10"
    >
      {/* Décor lumineux */}
      <div className="absolute top-10 left-1/3 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-60 h-60 bg-indigo-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* En-tête */}
        <div
          style={{ transition: "opacity 900ms ease-out, transform 900ms ease-out" }}
          className={`text-center mb-14
            ${revealedCount >= 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          <span className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide border border-white/20 mb-5">
            <Sparkles size={13} />
            Notre association
          </span>
          <h2 className="text-3xl md:text-4xl font-light text-white mb-3">
            À propos de <span className="font-semibold">Luxafro</span>
          </h2>
          <p className="text-white/75 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Une plateforme dédiée à la valorisation de la culture camerounaise,
            à travers des activités pour tous les âges.
          </p>
        </div>

        {/* Grille 2 colonnes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10">

          {/* Colonne gauche */}
          <div className="space-y-10">
            {colLeft.map((activity) => {
              const globalIndex = activities.indexOf(activity);
              return (
                <ActivityCard
                  key={activity.label}
                  activity={activity}
                  isVisible={revealedCount >= globalIndex + 2}
                />
              );
            })}
          </div>

          {/* Colonne droite — décalée visuellement */}
          <div className="space-y-10 md:pt-16">
            {colRight.map((activity) => {
              const globalIndex = activities.indexOf(activity);
              return (
                <ActivityCard
                  key={activity.label}
                  activity={activity}
                  isVisible={revealedCount >= globalIndex + 2}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutSection;
