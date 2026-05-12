import type { EventPhoto } from "./EventPhoto";

export type Category = {
  id: number;
  nom: string;
};

export type Event = {
  id: number;
  nom: string;
  description: string;
  date: string;
  heure_debut: string;
  heure_fin: string | null;
  lieu: string;
  categories: Category[];
  photos: EventPhoto[];
  pour_enfant: boolean;
  nombre_participants: number | null;
  tarif: string | null;
  created_at: string;
  updated_at: string;
};