import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Event } from "../types/Event";
import { getEventById, deleteEvent } from "../services/eventService";

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const token = localStorage.getItem("token") || "";
  const isAdmin = true; // à remplacer plus tard par vrai check

  useEffect(() => {
    if (id) {
      getEventById(Number(id)).then((res) => setEvent(res.data));
    }
  }, [id]);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const handleDelete = async () => {
    if (event && window.confirm("Supprimer cet événement ?")) {
      await deleteEvent(event.id, token);
      window.location.href = "/admin/events";
    }
  };

  if (!event) return <p>Chargement...</p>;

  return (
    <div>
      <h1>{event.nom}</h1>

      <p>{event.description}</p>

      <p><strong>Date :</strong> {formatDate(event.date)}</p>
      <p><strong>Horaire :</strong> {event.horaire}</p>
      <p><strong>Lieu :</strong> {event.lieu}</p>
      <p><strong>Participants :</strong> {event.nombre_participants}</p>
      <p><strong>Tarif :</strong> {event.tarif} €</p>
      <p><strong>Pour enfant :</strong> {event.pour_enfant ? "Oui" : "Non"}</p>

      {/* ADMIN ACTIONS */}
      {isAdmin && (
        <div style={{ marginTop: "20px" }}>
          <button onClick={() => console.log("Modifier")}>
            Modifier
          </button>

          <button onClick={() => console.log("Ajouter photos")}>
            Ajouter photos
          </button>

          <button onClick={handleDelete}>
            Supprimer
          </button>
        </div>
      )}
    </div>
  );
};

export default EventDetails;