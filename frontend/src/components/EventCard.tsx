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

  // ✂️ description courte
  const shortDescription =
    event.description.length > 50
      ? event.description.substring(0, 50) + "..."
      : event.description;

  const handleView = () => {
    if (location.pathname.includes("/admin")) {
      navigate(`/admin/events/${event.id}`);
    } else {
      navigate(`/events/${event.id}`);
    }
  };

  return (
    <div style={{ border: "1px solid #ccc", padding: "10px", margin: "10px" }}>
      <h3>{event.nom}</h3>

      {/* description courte */}
      <p>{shortDescription}</p>

      <p>
        <strong>Date :</strong> {formatDate(event.date)}
      </p>

      {/* horaire */}
      <p>
        <strong>Horaire :</strong> {event.horaire}
      </p>

      {/* prix */}
      <p>
        <strong>Prix :</strong> {event.tarif} €
      </p>

      {/* catégories */}
      {event.categories && event.categories.length > 0 && (
        <p>
          <strong>Catégories :</strong> {event.categories.join(", ")}
        </p>
      )}

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