import { useEffect, useState } from "react";
import type { Event } from "../types/Event";
import { API_URL, getCsrfCookie, getAuthHeaders } from "../config/api";

/**
 * Hook centralisé pour gérer les événements côté admin
 * 
 * Expose tout ce dont l'admin a besoin :
 * - Liste, création, modification, suppression d'événements
 * - Upload/suppression de photo
 * - Attachement de catégories
 */
export function useAdminEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  //Récupérer tous les événements
  
  const fetchEvents = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/api/events`, {
        credentials: "include",
        headers: { Accept: "application/json" },
      });

      if (!res.ok) {
        throw new Error("Erreur lors du chargement des événements");
      }

      const data = await res.json();
      setEvents(data);
    } catch (err) {
      setError("Impossible de charger les événements");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  //CRÉATION - Créer un nouvel événement
  const createEvent = async (eventData: Partial<Event>) => {
    try {
      await getCsrfCookie();

      const res = await fetch(`${API_URL}/api/events`, {
        method: "POST",
        credentials: "include",
        headers: getAuthHeaders(),
        body: JSON.stringify(eventData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Erreur lors de la création");
      }

      //Ajoute le nouvel event à la liste locale
      setEvents((prev) => [data, ...prev]);

      return { success: true, event: data as Event };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur inconnue";
      console.error(err);
      return { success: false, message };
    }
  };

  //MODIFICATION - Mettre à jour un événement
  
  const updateEvent = async (id: number, eventData: Partial<Event>) => {
    try {
      await getCsrfCookie();

      const res = await fetch(`${API_URL}/api/events/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: getAuthHeaders(),
        body: JSON.stringify(eventData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Erreur lors de la modification");
      }

      //Mise à jour optimiste de la liste
      setEvents((prev) =>
        prev.map((event) => (event.id === id ? { ...event, ...data } : event))
      );

      return { success: true, event: data as Event };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur inconnue";
      console.error(err);
      return { success: false, message };
    }
  };

  //SUPPRESSION - Supprimer un événement
  
  const deleteEvent = async (id: number) => {
    try {
      await getCsrfCookie();

      const res = await fetch(`${API_URL}/api/events/${id}`, {
        method: "DELETE",
        credentials: "include",
        headers: getAuthHeaders(),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Erreur lors de la suppression");
      }

      //Retire de la liste locale
      setEvents((prev) => prev.filter((event) => event.id !== id));

      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur inconnue";
      console.error(err);
      return { success: false, message };
    }
  };

  //CATÉGORIES - Attacher des catégories à un event
  const attachCategories = async (eventId: number, categoryIds: number[]) => {
    try {
      await getCsrfCookie();

      const res = await fetch(`${API_URL}/api/events/${eventId}/categories`, {
        method: "POST",
        credentials: "include",
        headers: getAuthHeaders(),
        body: JSON.stringify({ categories: categoryIds }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Erreur lors de l'ajout des catégories");
      }

      return { success: true, categories: data.categories };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur inconnue";
      console.error(err);
      return { success: false, message };
    }
  };

  //PHOTO - Uploader une photo pour un event
  const uploadPhoto = async (eventId: number, file: File) => {
    try {
      await getCsrfCookie();

      //Pour les fichiers : FormData (pas JSON)
      const formData = new FormData();
      formData.append("photo", file);

      //On NE met PAS Content-Type ici : le navigateur le gère pour multipart/form-data
      const res = await fetch(`${API_URL}/api/events/${eventId}/photos`, {
        method: "POST",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "X-XSRF-TOKEN": getAuthHeaders()["X-XSRF-TOKEN"],
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Erreur lors de l'upload");
      }

      return { success: true, photo: data.photo };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur inconnue";
      console.error(err);
      return { success: false, message };
    }
  };

  //PHOTO - Supprimer une photo
  const deletePhoto = async (photoId: number) => {
    try {
      await getCsrfCookie();

      const res = await fetch(`${API_URL}/api/photos/${photoId}`, {
        method: "DELETE",
        credentials: "include",
        headers: getAuthHeaders(),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Erreur lors de la suppression");
      }

      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur inconnue";
      console.error(err);
      return { success: false, message };
    }
  };

  //Chargement initial
  useEffect(() => {
    fetchEvents();
  }, []);

  return {
    events,
    loading,
    error,
    fetchEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    attachCategories,
    uploadPhoto,
    deletePhoto,
  };
}