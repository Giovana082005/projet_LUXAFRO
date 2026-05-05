import { useEffect, useState } from "react";

export type Event = {
  nom: string;
  description: string;
  date: string;
  horaire: string;
  lieu: string;
  categories: string[];
  pour_enfant: boolean;
  nombre_participants: number;
  tarif: number;
};

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/api/events");

      const data = await res.json();
      setEvents(data);
    } catch (error) {
      console.error("Erreur fetch events:", error);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return { events, loading, refresh: fetchEvents };
}