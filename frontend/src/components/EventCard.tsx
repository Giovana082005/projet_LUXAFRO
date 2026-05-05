import { Event } from "../types/Event";
import { useNavigate, useLocation } from "react-router-dom";

interface Props {
  event: Event;
  isAdmin?: boolean;
  onDelete?: (id: number) => void;
  onEdit?: (event: Event) => void;
}

const EventCard = ({
  event,
  isAdmin = false,
  onDelete,
  onEdit,
}: Props) => {
  const navigate = useNavigate();
  const location = useLocation();

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const handleView = () => {
    // détecte si on est dans l'espace admin
    if (location.pathname.includes("/admin")) {
      navigate(`/admin/events/${event.id}`);
    } else {
      navigate(`/events/${event.id}`);
    }
  };

  return (
    <div style={{ border: "1px solid #ccc", padding: "10px", margin: "10px" }}>
      <h3>{event.nom}</h3>
      <p>{event.description}</p>

      <p>
        <strong>Date :</strong> {formatDate(event.date)}
      </p>

      <button onClick={handleView}>
        En savoir plus
      </button>

      {isAdmin && (
        <>
          <button onClick={() => onEdit?.(event)}>
            Modifier
          </button>

          <button onClick={() => onDelete?.(event.id)}>
            Supprimer
          </button>
        </>
      )}
    </div>
  );
};

export default EventCard;