import { useEffect, useState } from "react";
import { getEvents, deleteEvent } from "../services/eventService";
import { Event } from "../types/Event";
import EventCard from "../components/EventCard";
import { useNavigate } from "react-router-dom";
import EventFilters from "../components/EventFilters"; 

const AdminEvents = () => {
  const navigate = useNavigate();

  const [events, setEvents] = useState<Event[]>([]);
  const token = localStorage.getItem("auth_token") || "";

  // états filtres
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [onlyChildren, setOnlyChildren] = useState(false);

  // toggle catégorie
  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  // ✅ fetch avec filtres
  useEffect(() => {
    const params: any = {};

    if (search) params.search = search;
    if (selectedCategories.length > 0) {
      params.category = selectedCategories[0]; // version simple
    }
    if (onlyChildren) params.child = true;

    getEvents(params)
      .then((res) => setEvents(res.data))
      .catch((err) => console.error(err));
  }, [search, selectedCategories, onlyChildren]);

  // suppression
  const handleDelete = async (id: number) => {
    if (window.confirm("Supprimer cet événement ?")) {
      await deleteEvent(id, token);
      // recharge avec filtres actifs
      const params: any = {};
      if (search) params.search = search;
      if (selectedCategories.length > 0) {
        params.category = selectedCategories[0];
      }
      if (onlyChildren) params.child = true;

      const res = await getEvents(params);
      setEvents(res.data);
    }
  };

  const handleEdit = (event: Event) => {
    navigate(`/admin/events/${event.id}/edit`);
  };

  return (
    <div>
      <h1>Admin - Gestion des événements</h1>

      {/* FILTRES */}
      <EventFilters
        search={search}
        setSearch={setSearch}
        selectedCategories={selectedCategories}
        toggleCategory={toggleCategory}
        onlyChildren={onlyChildren}
        setOnlyChildren={setOnlyChildren}
        onReset={() => {
          setSearch("");
          setSelectedCategories([]);
          setOnlyChildren(false);
        }}
      />

      <hr />

      {/* LISTE */}
      {events.length === 0 ? (
        <p>Aucun événement trouvé</p>
      ) : (
        events.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            isAdmin
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        ))
      )}
    </div>
  );
};

export default AdminEvents;