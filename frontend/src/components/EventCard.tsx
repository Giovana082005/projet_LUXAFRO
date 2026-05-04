import { Event } from "../types/Event";

interface Props {
  event: Event;
  isAdmin?: boolean;
  onDelete?: (id: number) => void;
  onEdit?: (event: Event) => void;
  onView?: (event: Event) => void;
}

const EventCard = ({
  event,
  isAdmin = false,
  onDelete,
  onEdit,
  onView,
}: Props) => {
  return (
    <div style={{ border: "1px solid #ccc", padding: "10px", margin: "10px" }}>
      <h3>{event.nom}</h3>
      <p>{event.description}</p>
      <p><strong>Date :</strong> {event.date}</p>

      <button onClick={() => onView?.(event)}>
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