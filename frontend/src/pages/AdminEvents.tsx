import { useEffect, useState } from "react";
import { getEvents, deleteEvent } from "../services/eventService";
import { Event } from "../types/Event";
import EventCard from "../components/EventCard";

const AdminEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const token = localStorage.getItem("token") || "";

  const fetchEvents = () => {
    getEvents().then((res) => setEvents(res.data));
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm("Supprimer cet événement ?")) {
      await deleteEvent(id, token);
      fetchEvents();
    }
  };

  const handleEdit = (event: Event) => {
    console.log("Edit:", event);
  };

  const handleView = (event: Event) => {
    console.log("View:", event);
  };

  return (
    <div>
      <h1>Admin - Gestion des événements</h1>

      {events.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          isAdmin
          onDelete={handleDelete}
          onEdit={handleEdit}
          onView={handleView}
        />
      ))}
    </div>
  );
};

export default AdminEvents;