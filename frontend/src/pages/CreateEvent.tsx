import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createEvent } from "../services/eventService";

const categoriesList = ["musique", "sport", "culture", "danse", "festival"];

const CreateEvent = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("auth_token") || "";

  const [form, setForm] = useState({
    nom: "",
    description: "",
    date: "",
    horaire: "",
    lieu: "",
    tarif: "",
    nombre_participants: "",
    pour_enfant: false,
    categories: [] as string[], // tableau
  });

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // ✅ gestion catégories (checkbox)
  const toggleCategory = (category: string) => {
    if (form.categories.includes(category)) {
      setForm({
        ...form,
        categories: form.categories.filter((c) => c !== category),
      });
    } else {
      setForm({
        ...form,
        categories: [...form.categories, category],
      });
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
     try {
    const data = {
      ...form,
      tarif: form.tarif ? Number(form.tarif) : 0,
      nombre_participants: form.nombre_participants
        ? Number(form.nombre_participants)
        : null,
    };

    await createEvent(data, token);

    navigate("/admin/events");
  } catch (error) {
    console.error("Erreur création:", error);
  }
};

  return (
    <div style={{ maxWidth: "600px", margin: "auto" }}>
      <h1>Créer un événement</h1>

      <form onSubmit={handleSubmit}>
        <label>Nom</label>
        <input
          name="nom"
          value={form.nom}
          onChange={handleChange}
          required
        />

        <label>Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
        />

        <label>Date</label>
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          required
        />

        <label>Horaire</label>
        <input
          name="horaire"
          value={form.horaire}
          onChange={handleChange}
        />

        <label>Lieu</label>
        <input
          name="lieu"
          value={form.lieu}
          onChange={handleChange}
        />

        <label>Tarif (€)</label>
        <input
          type="number"
          name="tarif"
          value={form.tarif}
          onChange={handleChange}
        />

        <label>Participants max</label>
        <input
          type="number"
          name="nombre_participants"
          value={form.nombre_participants}
          onChange={handleChange}
        />

        <label>
          <input
            type="checkbox"
            name="pour_enfant"
            checked={form.pour_enfant}
            onChange={handleChange}
          />
          Pour enfant
        </label>

        {/* ✅ CATEGORIES PRO */}
        <div>
          <p>Catégories :</p>
          {categoriesList.map((cat) => (
            <label key={cat} style={{ marginRight: "10px" }}>
              <input
                type="checkbox"
                checked={form.categories.includes(cat)}
                onChange={() => toggleCategory(cat)}
              />
              {cat}
            </label>
          ))}
        </div>

        <br />

        <button type="submit">Créer</button>

        <button
          type="button"
          onClick={() => navigate("/admin/events")}
          style={{ marginLeft: "10px" }}
        >
          Annuler
        </button>
      </form>
    </div>
  );
};

export default CreateEvent;