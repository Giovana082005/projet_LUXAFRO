import type { Event } from "./Event";

/**
 * Raison pour laquelle un événement a été recommandé à l'utilisateur.
 * Permet d'afficher un message personnalisé dans le hero
 */
export type RecommendationReason =
  | "user_preferences"   // basé sur les catégories préférées
  | "user_history"        // basé sur les événements consultés/réservés
  | "location"            // proximité géographique
  | "popular"             // tendance / populaire
  | "upcoming"            // fallback : le plus proche dans le temps
  | "default";            // aucun critère particulier

/**
 * Un événement recommandé : un Event + métadonnées de la recommandation
 * Renvoyé par le backend de recommandation
 */
export type RecommendedEvent = {
  event: Event;
  reason: RecommendationReason;
  /** Texte à afficher dans le badge  */
  reason_label?: string;
};