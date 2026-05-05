import { useEffect, useState } from "react";
import { getEvents } from "../services/eventService";
import { Event } from "../types/Event";
import EventCard from "../components/EventCard";
import EventFilters from "../components/EventFilters";

const Events = () => {
  const [events, setEvents] = useState<Event[]>([]);

  // filtres
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [onlyChildren, setOnlyChildren] = useState(false);

  // appel backend avec filtres
  useEffect(() => {
    const params: any = {};

    if (search) params.search = search;

    if (selectedCategories.length > 0) {
      params.category = selectedCategories[0]; // version simple
    }

    if (onlyChildren) {
      params.child = true;
    }

    getEvents(params)
      .then((res) => setEvents(res.data))
      .catch((err) => console.error("Erreur chargement events:", err));
  }, [search, selectedCategories, onlyChildren]);

  // gestion catégories
  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  // reset filtres
  const handleReset = () => {
    setSearch("");
    setSelectedCategories([]);
    setOnlyChildren(false);
  };

  return (
    <div>
      <h1>Liste des événements</h1>

      {/* FILTRES */}
      <EventFilters
        search={search}
        setSearch={setSearch}
        selectedCategories={selectedCategories}
        toggleCategory={toggleCategory}
        onlyChildren={onlyChildren}
        setOnlyChildren={setOnlyChildren}
        onReset={handleReset}
      />

      <hr />

      {/* LISTE */}
      {events.length === 0 ? (
        <p>Aucun événement trouvé</p>
      ) : (
        events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))
      )}
    </div>
  );
};

export default Events;