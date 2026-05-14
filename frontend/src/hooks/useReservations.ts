import { useEffect, useState } from "react";
import type { Reservation, CreateReservationData } from "../types/Reservation";
 import { API_URL, getCsrfCookie, getAuthHeaders } from "../config/api";

// MODE MOCK : à passer à false quand le backend sera prêt

const USE_MOCKS = false;


//DONNÉES FICTIVES (uniquement utilisées en mode mock)

const mockReservations: Reservation[] = [
  {
    id: 1,
    user_id: 1,
    event_id: 1,
    nb_adultes: 2,
    nb_enfants: 1,
    total_price: 30.00,
    status: "paid",
    payment_method: "qr_code",
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    event: {
      id: 1,
      nom: "Atelier cuisine traditionnelle (MOCK)",
      description: "Découverte des plats camerounais",
      date: "2026-06-15",
      heure_debut: "14:00:00",
      heure_fin: "17:00:00",
      lieu: "Nancy",
      pour_enfant: true,
      nombre_participants: 30,
      tarif: "10.00",
      categories: [],
      photos: [],
      created_at: "",
      updated_at: "",
    },
  },
  {
    id: 2,
    user_id: 1,
    event_id: 2,
    nb_adultes: 1,
    nb_enfants: 0,
    total_price: 15.00,
    status: "pending",
    payment_method: "on_site",
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    event: {
      id: 2,
      nom: "Concert de musique (MOCK)",
      description: "Soirée musicale",
      date: "2026-07-20",
      heure_debut: "20:00:00",
      heure_fin: null,
      lieu: "Paris",
      pour_enfant: false,
      nombre_participants: 100,
      tarif: "15.00",
      categories: [],
      photos: [],
      created_at: "",
      updated_at: "",
    },
  },
];

//Simulation d'un délai réseau réaliste
const fakeDelay = (ms: number = 400) =>
  new Promise((resolve) => setTimeout(resolve, ms));

//  LE HOOK PRINCIPAL

export function useReservations() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  
  //  LISTE - Mes réservations

  const fetchMyReservations = async () => {
    setLoading(true);
    setError("");

    try {
      if (USE_MOCKS) {
        //MOCK
        await fakeDelay();
        setReservations(mockReservations);
      } else {
        // VRAI APPEL API 
         const res = await fetch(`${API_URL}/api/reservations/me`, {
           credentials: "include",
           headers: { Accept: "application/json" },
         });
         if (!res.ok) throw new Error("Erreur");
         const data = await res.json();
         setReservations(data);
      }
    } catch (err) {
      setError("Impossible de charger les réservations");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  //CRÉATION
  const createReservation = async (data: CreateReservationData) => {
    try {
      if (USE_MOCKS) {
        // MOCK
        await fakeDelay(600);

        // Simule une réponse réussie
        const fakeReservation: Reservation = {
          id: Math.floor(Math.random() * 10000),
          user_id: 1,
          event_id: data.event_id,
          nb_adultes: data.nb_adultes,
          nb_enfants: data.nb_enfants,
          total_price: (data.nb_adultes + data.nb_enfants) * 15, //prix fictif
          status: "pending",
          payment_method: data.payment_method,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        //Ajoute à la liste locale (comme le ferait le vrai backend après refetch)
        setReservations((prev) => [fakeReservation, ...prev]);

        return { success: true, reservation: fakeReservation };
      } else {
        // VRAI APPEL API
        await getCsrfCookie();
         const res = await fetch(`${API_URL}/api/reservations`, {
           method: "POST",
          credentials: "include",
          headers: getAuthHeaders(),
          body: JSON.stringify(data),
         });
         const result = await res.json();
         if (!res.ok) throw new Error(result.message || "Erreur");
        setReservations((prev) => [result.reservation, ...prev]);
         return { success: true, reservation: result.reservation };
        //return { success: false, message: "Backend non implémenté" };
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur inconnue";
      console.error(err);
      return { success: false, message };
    }
  };

  //ANNULATION
  const cancelReservation = async (id: number) => {
    try {
      if (USE_MOCKS) {
        //MOCK
        await fakeDelay();

        //Met à jour le statut localement
        setReservations((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status: "cancelled" as const } : r))
        );

        return { success: true };
      } else {
        //VRAI APPEL API
        await getCsrfCookie();
        const res = await fetch(`${API_URL}/api/reservations/${id}`, {
          method: "POST",
          credentials: "include",
          headers: getAuthHeaders(),
         });
         if (!res.ok) throw new Error("Erreur lors de l'annulation");
         setReservations((prev) =>
           prev.map((r) => (r.id === id ? { ...r, status: "cancelled" as const } : r))
        );
         return { success: true };
        //return { success: false, message: "Backend non implémenté" };
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur inconnue";
      console.error(err);
      return { success: false, message };
    }
  };

  //Chargement initial
  useEffect(() => {
    fetchMyReservations();
  }, []);

  return {
    reservations,
    loading,
    error,
    fetchMyReservations,
    createReservation,
    cancelReservation,
  };
}