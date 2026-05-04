import { useEffect, useState } from "react";
import { getEvents } from "../services/eventService";
import { Event } from "../types/Event";
import EventCard from "../components/EventCard";

const Events = () => {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    getEvents().then((res) => setEvents(res.data));
  }, []);

  const handleView = (event: Event) => {
    console.log(event);
  };

  return (
    <div>
      <h1>Événements</h1>

      {events.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          onView={handleView}
        />
      ))}
    </div>
  );
};

export default Events;