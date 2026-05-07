import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEventById, deleteEvent } from "../services/eventService";
import { Event } from "../types/Event";

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState<Event | null>(null);
  const token = localStorage.getItem("auth_token") || "";

  //  récupération user
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const isAdmin = user?.role === "administrateur";

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
        navigate("/admin/events");
      } catch (error) {
        console.error("Erreur suppression:", error);
      }
    }
  };

  if (!event) return <p>Chargement...</p>;

  return (
    <div style={{ maxWidth: "600px", margin: "auto" }}>
      <h1>{event.nom}</h1>

      <p>{event.description}</p>

      <hr />

      <p>
        <strong>Date :</strong>{" "}
        {new Date(event.date).toLocaleDateString("fr-FR")}
      </p>

      <p>
        <strong>Horaire :</strong> {event.horaire}
      </p>

      <p>
        <strong>Lieu :</strong> {event.lieu}
      </p>

      <p>
        <strong>Tarif :</strong>{" "}
        {event.tarif ? `${event.tarif} €` : "Gratuit"}
      </p>

      <p>
        <strong>Participants max :</strong>{" "}
        {event.nombre_participants || "Non limité"}
      </p>

      <p>
        <strong>Pour enfant :</strong>{" "}
        {event.pour_enfant ? "Oui " : "Non"}
      </p>

      <p>
        <strong>Catégories :</strong>{" "}
        {event.categories && event.categories.length > 0
          ? event.categories.join(", ")
          : "Aucune"}
      </p>

      <hr />

      {/*  ADMIN */}
      {isAdmin && (
        <>
          <button onClick={() => navigate(`/admin/events/${event.id}/edit`)}>
            Modifier
          </button>

          <button onClick={handleDelete} style={{ marginLeft: "10px" }}>
            Supprimer
          </button>

          <button
            onClick={() => console.log("Ajouter photos")}
            style={{ marginLeft: "10px" }}
          >
            Ajouter photos
          </button>
        </>
      )}

      {/*  UTILISATEUR */}
      {!isAdmin && (
        <button onClick={() => console.log("Réserver")}>
          Réserver
        </button>
      )}

      <br /><br />

      {/*  RETOUR INTELLIGENT */}
      <button
        onClick={() =>
          isAdmin
            ? navigate("/admin/events")
            : navigate("/events")
        }
      >
        Retour
      </button>
    </div>
  );
};

export default EventDetails;