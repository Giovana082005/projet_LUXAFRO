import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEventById, deleteEvent } from "../services/eventService";
import { Event } from "../types/Event";

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState<Event | null>(null);
  const token = localStorage.getItem("auth_token") || "";

  useEffect(() => {
    if (id) {
      getEventById(Number(id)).then((res) => setEvent(res.data));
    }
  }, [id]);

  const handleDelete = async () => {
    if (!event) return;

    if (window.confirm("Supprimer cet événement ?")) {
      try {
        await deleteEvent(event.id, token);

        // redirection après suppression
        navigate("/admin/events");

      } catch (error) {
        console.error("Erreur suppression:", error);
      }
    }
  };

  if (!event) return <p>Chargement...</p>;

  return (
    <div>
      <h1>{event.nom}</h1>
      <p>{event.description}</p>

      <p><strong>Date :</strong> {new Date(event.date).toLocaleDateString("fr-FR")}</p>
      <p><strong>Lieu :</strong> {event.lieu}</p>
      <p><strong>Horaire :</strong> {event.horaire}</p>
      <p><strong>Tarif :</strong> {event.tarif} €</p>

      {/* bouton supprimer */}
      <button onClick={handleDelete}>
        Supprimer
      </button>

      {/* bouton retour */}
      <button onClick={() => navigate(-1)}>
        Retour
      </button>
      {/*ajouter des hotos*/}
      <button onClick={() => console.log("Ajouter photos")}>
            Ajouter photos
          </button>
    </div>
  );
};

export default EventDetails;