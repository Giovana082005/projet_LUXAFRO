export type Event = {
  id: number;
  nom: string;
  description: string;
  date: string;
  horaire: string;
  lieu: string;
  categories: string[];
  pour_enfant: boolean;
  nombre_participants: number | null;
  tarif: string | null;
  created_at: string;
  updated_at: string;
};