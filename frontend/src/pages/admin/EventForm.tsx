import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { useAdminEvents } from "../../hooks/useAdminEvents";
import { API_URL } from "../../config/api";
import type { Event } from "../../types/Event";
import Spinner from "../../components/Spinner";

/**
 * Formulaire de création/édition d'événement
 * Sert pour 2 routes :
 * - /admin/events/new (création)
 * - /admin/events/:id/edit (édition)
 */
function EventForm() {
  //Récupère l'ID depuis l'URL (undefined en mode création)
  const { id } = useParams<{ id?: string }>();
  const isEditMode = !!id;
  
  const navigate = useNavigate();
  const { createEvent, updateEvent } = useAdminEvents();

  //État du formulaire (un seul objet pour tous les champs)
  const [formData, setFormData] = useState({
    nom: "",
    description: "",
    date: "",
    heure_debut: "",
    heure_fin: "",
    lieu: "",
    pour_enfant: false,
    nombre_participants: "",
    tarif: "",
  });

  //États de gestion
  const [loadingEvent, setLoadingEvent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  //En mode édition : charger les données de l'événement
  useEffect(() => {
    if (isEditMode && id) {
      loadEvent(id);
    }
  }, [id]);

  const loadEvent = async (eventId: string) => {
    setLoadingEvent(true);
    try {
      const res = await fetch(`${API_URL}/api/events/${eventId}`, {
        credentials: "include",
        headers: { Accept: "application/json" },
      });

      if (!res.ok) throw new Error("Événement introuvable");

      const event: Event = await res.json();

      //Pré-remplit le formulaire avec les données existantes
      setFormData({
        nom: event.nom,
        description: event.description,
        date: event.date.split("T")[0], // "2026-05-31T..." → "2026-05-31"
        heure_debut: event.heure_debut?.substring(0, 5) || "",
        heure_fin: event.heure_fin?.substring(0, 5) || "",
        lieu: event.lieu,
        pour_enfant: event.pour_enfant,
        nombre_participants: event.nombre_participants?.toString() || "",
        tarif: event.tarif?.toString() || "",
      });
    } catch (err) {
      setError("Impossible de charger l'événement");
      console.error(err);
    } finally {
      setLoadingEvent(false);
    }
  };

  //Gestion centralisée des changements de champs
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    
    //Pour les checkbox
    const newValue = type === "checkbox" 
      ? (e.target as HTMLInputElement).checked 
      : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  //Soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    //Préparer les données (convertir les strings vides en null pour les champs nullable)
    const payload = {
      nom: formData.nom,
      description: formData.description,
      date: formData.date,
      heure_debut: formData.heure_debut,
      heure_fin: formData.heure_fin || null,
      lieu: formData.lieu,
      pour_enfant: formData.pour_enfant,
      nombre_participants: formData.nombre_participants 
        ? parseInt(formData.nombre_participants) 
        : null,
      tarif: formData.tarif ? parseFloat(formData.tarif) : null,
    };

    //Crée OU modifie selon le mode
    const result = isEditMode && id
      ? await updateEvent(parseInt(id), payload as never)
      : await createEvent(payload as never);

    setSubmitting(false);

    if (result.success) {
      navigate("/admin/events");
    } else {
      setError(result.message || "Erreur lors de la sauvegarde");
    }
  };

  //Chargement en mode édition
  if (loadingEvent) {
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    );
  }

  return (
    <div>
      
      {/* En-tête avec lien retour */}
      <div className="mb-8">
        <Link
          to="/admin/events"
          className="inline-flex items-center space-x-1 text-sm text-gray-600 hover:text-blue-950 mb-4 transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Retour à la liste</span>
        </Link>
        
        <h1 className="text-3xl font-light text-gray-900 mb-2">
          {isEditMode ? "Modifier l'événement" : "Créer un événement"}
        </h1>
        <p className="text-gray-600">
          {isEditMode 
            ? "Mettez à jour les informations de l'événement"
            : "Remplissez les informations pour créer un nouvel événement"}
        </p>
      </div>

      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 max-w-3xl">
        
        {/* ❌ Erreur */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700 text-sm">❌ {error}</p>
          </div>
        )}

        {/*  Nom */}
        <div className="mb-5">
          <label htmlFor="nom" className="block text-sm font-semibold text-gray-900 mb-2">
            Nom de l'événement <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="nom"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
            required
            placeholder="Ex: Atelier de cuisine traditionnelle"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Description */}
        <div className="mb-5">
          <label htmlFor="description" className="block text-sm font-semibold text-gray-900 mb-2">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={4}
            placeholder="Décrivez votre événement..."
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
          />
        </div>

        {/*  Date + Heures en grille */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
          
          <div>
            <label htmlFor="date" className="block text-sm font-semibold text-gray-900 mb-2">
              Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="heure_debut" className="block text-sm font-semibold text-gray-900 mb-2">
              Heure de début <span className="text-red-500">*</span>
            </label>
            <input
              type="time"
              id="heure_debut"
              name="heure_debut"
              value={formData.heure_debut}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="heure_fin" className="block text-sm font-semibold text-gray-900 mb-2">
              Heure de fin
            </label>
            <input
              type="time"
              id="heure_fin"
              name="heure_fin"
              value={formData.heure_fin}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/*  Lieu */}
        <div className="mb-5">
          <label htmlFor="lieu" className="block text-sm font-semibold text-gray-900 mb-2">
            Lieu <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="lieu"
            name="lieu"
            value={formData.lieu}
            onChange={handleChange}
            required
            placeholder="Ex: Nancy, salle communale"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Places +  Tarif en grille */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
          
          <div>
            <label htmlFor="nombre_participants" className="block text-sm font-semibold text-gray-900 mb-2">
              Nombre de places
            </label>
            <input
              type="number"
              id="nombre_participants"
              name="nombre_participants"
              value={formData.nombre_participants}
              onChange={handleChange}
              min="0"
              placeholder="Ex: 30"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">Laissez vide pour places illimitées</p>
          </div>

          <div>
            <label htmlFor="tarif" className="block text-sm font-semibold text-gray-900 mb-2">
              Tarif (€)
            </label>
            <input
              type="number"
              id="tarif"
              name="tarif"
              value={formData.tarif}
              onChange={handleChange}
              min="0"
              step="0.01"
              placeholder="Ex: 15.00"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">Mettez 0 pour gratuit, vide si non défini</p>
          </div>
        </div>

        {/*  Pour enfants */}
        <div className="mb-6">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              name="pour_enfant"
              checked={formData.pour_enfant}
              onChange={handleChange}
              className="w-5 h-5 text-blue-950 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-900">
              Cet événement est adapté aux enfants 👶
            </span>
          </label>
        </div>

        {/*  Actions */}
        <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
          <Link
            to="/admin/events"
            className="px-5 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg font-semibold transition-colors"
          >
            Annuler
          </Link>
          
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center space-x-2 bg-blue-950 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <Spinner size="sm" color="white" />
                <span>Enregistrement...</span>
              </>
            ) : (
              <>
                <Save size={18} />
                <span>{isEditMode ? "Modifier" : "Créer"}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EventForm;