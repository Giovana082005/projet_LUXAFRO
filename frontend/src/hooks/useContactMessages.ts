import { useEffect, useState } from "react";
import type {ContactMessage,CreateContactMessage } from "../types/ContactMessage";
import { API_URL, getCsrfCookie, getAuthHeaders } from "../config/api";

export function useContactMessages() {
    //Les états
    const [messages, setMessages] = useState<ContactMessage[]>([]);
    const[message, setMessage] = useState<ContactMessage| null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    /**
   * RÉCUPÉRER TOUS LES MESSAGES
   * (admin)
   */
    const fetchMessages = async () =>{
        setLoading(true);
        setError("");
        try{
        //Appel ApI
        const res = await fetch(`${API_URL}/api/contacts`, {
           credentials: "include",
           headers: { Accept: "application/json" },
         });
         if (!res.ok) throw new Error("Erreur");
         const data = await res.json();
         setMessages(data);
     
        } catch (err) {
        setError("Impossible de charger les messages");
        console.error(err);
        } finally {
        setLoading(false);
        }
    };
    /**
     * Envoyer un message via le formulaire
     */
    const createMessage = async (data : CreateContactMessage) =>{
        try {
              await getCsrfCookie();
        
              const res = await fetch(`${API_URL}/api/contacts`, {
                method: "POST",
                credentials: "include",
                headers: getAuthHeaders(),
                body: JSON.stringify(data),
              });
             const result = await res.json();

            if (!res.ok) throw new Error(result.message || "Erreur");
        setMessages((prev) => [result.contact, ...prev]);
         return { success: true, contact: result.contact };
        //return { success: false, message: "Backend non implémenté" };
      }
     catch (err) {
      const message = err instanceof Error ? err.message : "Erreur inconnue";
      console.error(err);
      return { success: false, message };
    }
    };
    /**
   * DÉTAIL D’UN MESSAGE
   
    const fetchMessageDetails = async ( id: number) => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/contacts/${id}`,
        {
         
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(
          data.message ||
            "Erreur lors du chargement du message"
        );
      }

      setMessage(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

    // MARQUER COMME LU
   
  const markAsRead = async (id: number) => {
    try {
      setLoading(true);
      setError("");

      await getCsrfCookie();

      const response = await fetch(
        `${API_URL}/contacts/${id}/read`,
        {
          
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Erreur lors de la mise à jour"
        );
      }

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === id
            ? { ...msg, is_read: true }
            : msg
        )
      );

      return data;
    } catch (err: any) {
      setError(err.message);

      throw err;
    } finally {
      setLoading(false);
    }
  };

  // SUPPRIMER MESSAGE

  const deleteMessage = async (id: number) => {
    try {
      setLoading(true);
      setError("");

      await getCsrfCookie();

      const response = await fetch(
        `${API_URL}/contacts/${id}`,
        {

        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Erreur lors de la suppression"
        );
      }

      setMessages((prev) =>
        prev.filter((msg) => msg.id !== id)
      );

      return data;
    } catch (err: any) {
      setError(err.message);

      throw err;
    } finally {
      setLoading(false);
    }
  };*/

  return {
    messages,
    message,
    loading,
    error,
    fetchMessages,
    createMessage
   // fetchMessageDetails,
   // markAsRead,
   // deleteMessage,
  };
}