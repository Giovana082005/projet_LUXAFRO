import type { Event } from "./Event";
import type { User } from "./User";

/**
 * Statuts possibles d'une réservation
 */
export type ReservationStatus = "pending" | "confirmed" | "paid" | "cancelled";

/**
 * Méthodes de paiement supportées
 */
export type PaymentMethod = "on_site" | "qr_code";

/**
 * Une réservation complète
 */
export type Reservation = {
  id: number;
  user_id: number;
  event_id: number;
  nb_adultes: number;
  nb_enfants: number;
  total_price: number;
  status: ReservationStatus;
  payment_method: PaymentMethod;
  created_at: string;
  updated_at: string;
  
  //Relations optionnelles (chargées selon l'endpoint)
  event?: Event;
  user?: User;
};

/**
 * Données à envoyer pour créer une réservation
 * (sous-ensemble des champs Reservation)
 */
export type CreateReservationData = {
  event_id: number;
  nb_adultes: number;
  nb_enfants: number;
  payment_method: PaymentMethod;
};