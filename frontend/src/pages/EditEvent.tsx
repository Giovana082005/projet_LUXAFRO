import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEventById, updateEvent } from "../services/eventService";
import { Event } from "../types/Event";

const categoriesList = ["musique", "sport", "culture", "danse", "festival"];

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("auth_token") || "";

  const [form, setForm] = useState<Partial<Event>>({
    categories: [],
    pour_enfant: false,
  });

  useEffect(() => {
    if (id) {
      getEventById(Number(id)).then((res) => {
        setForm({
          ...res.data,
          categories: res.data.categories || [],
        });
      });
    }
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setForm({ ...form, [name]: checked });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleCategoryChange = (category: string) => {
    let updated = form.categories || [];

    if (updated.includes(category)) {
      updated = updated.filter((c) => c !== category);
    } else {
      updated = [...updated, category];
    }

    setForm({ ...form, categories: updated });
  };

  const handleSubmit = async () => {
    try {
      await updateEvent(Number(id), form, token);
      navigate(`/admin/events/${id}`);
    } catch (error) {
      console.error("Erreur update:", error);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "auto" }}>
      <h1>Modifier un événement</h1>

      {/* NOM */}
      <label>Nom de l'événement</label>
      <input
        type="text"
        name="nom"
        value={form.nom || ""}
        onChange={handleChange}
      />

      {/* DESCRIPTION */}
      <label>Description</label>
      <textarea
        name="description"
        value={form.description || ""}
        onChange={handleChange}
      />

      {/* DATE */}
      <label>Date</label>
      <input
        type="date"
        name="date"
        value={form.date?.slice(0, 10) || ""}
        onChange={handleChange}
      />

      {/* HORAIRE */}
      <label>Horaire</label>
      <input
        type="text"
        name="horaire"
        value={form.horaire || ""}
        onChange={handleChange}
      />

      {/* LIEU */}
      <label>Lieu</label>
      <input
        type="text"
        name="lieu"
        value={form.lieu || ""}
        onChange={handleChange}
      />

      {/* TARIF */}
      <label>Tarif (€)</label>
      <input
        type="number"
        name="tarif"
        value={form.tarif || ""}
        onChange={handleChange}
      />

      {/* NOMBRE PARTICIPANTS */}
      <label>Nombre de participants</label>
      <input
        type="number"
        name="nombre_participants"
        value={form.nombre_participants || ""}
        onChange={handleChange}
      />

      {/* CATEGORIES */}
      <label>Catégories</label>
      <div>
        {categoriesList.map((cat) => (
          <label key={cat} style={{ marginRight: "10px" }}>
            <input
              type="checkbox"
              checked={form.categories?.includes(cat)}
              onChange={() => handleCategoryChange(cat)}
            />
            {cat}
          </label>
        ))}
      </div>

      {/* POUR ENFANT */}
      <label>
        <input
          type="checkbox"
          name="pour_enfant"
          checked={form.pour_enfant || false}
          onChange={handleChange}
        />
        Événement pour enfant
      </label>

      <br /><br />

      {/* BOUTONS */}
      <button onClick={() => navigate("/admin/events")}>
        Annuler
      </button>

      <button onClick={handleSubmit} style={{ marginLeft: "10px" }}>
        Enregistrer
      </button>
    </div>
  );
};

export default EditEvent;