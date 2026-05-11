import { useState } from "react";
import { Link } from "react-router-dom";
import { Edit, Trash2, Eye, Calendar, MapPin, Image } from "lucide-react";
import type { Event } from "../../types/Event";
import { getImageUrl } from "../../config/api";

interface EventsTableProps {
  events: Event[];
  onDelete: (id: number) => Promise<{ success: boolean; message?: string }>;
}

/**
 * Tableau interactif des événements (côté admin)
 * Affiche la liste avec actions : voir, modifier, supprimer
 */
function EventsTable({ events, onDelete }: EventsTableProps) {
  const [actionInProgress, setActionInProgress] = useState<number | null>(null);

  // Formater la date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Formater l'heure
  const formatTime = (timeString: string | null) => {
    if (!timeString) return "—";
    return timeString.substring(0, 5);
  };

  //Supprimer un événement avec confirmation
  const handleDelete = async (event: Event) => {
    if (!confirm(`Supprimer l'événement "${event.nom}" ? Cette action est définitive.`)) {
      return;
    }

    setActionInProgress(event.id);
    const result = await onDelete(event.id);
    setActionInProgress(null);

    if (!result.success) {
      alert("Erreur : " + result.message);
    }
  };

  //Aucun événement
  if (events.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
        <Calendar size={32} className="mx-auto text-gray-400 mb-3" />
        <p className="text-gray-500 mb-1">Aucun événement pour le moment</p>
        <p className="text-sm text-gray-400">
          Cliquez sur "Nouvel événement" pour en créer un
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          
          {/*  En-tête */}
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-6 py-3">
                Événement
              </th>
              <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-6 py-3">
                Date & Heure
              </th>
              <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-6 py-3">
                Lieu
              </th>
              <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-6 py-3">
                Catégories
              </th>
              <th className="text-right text-xs font-semibold text-gray-600 uppercase tracking-wider px-6 py-3">
                Actions
              </th>
            </tr>
          </thead>

          {/*  Corps */}
          <tbody className="divide-y divide-gray-200">
            {events.map((event) => {
              const isLoading = actionInProgress === event.id;
              const photoUrl = event.photos && event.photos.length > 0
                ? getImageUrl(event.photos[0].image_path)
                : null;

              return (
                <tr
                  key={event.id}
                  className={`hover:bg-gray-50 transition-colors ${
                    isLoading ? "opacity-50" : ""
                  }`}
                >
                  {/*  Miniature + Nom */}
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      {/* Vignette photo OU placeholder */}
                      {photoUrl ? (
                        <img
                          src={photoUrl}
                          alt={event.nom}
                          className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Image size={20} className="text-blue-700" />
                        </div>
                      )}
                      
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {event.nom}
                        </p>
                        {event.pour_enfant && (
                          <span className="inline-block text-xs text-green-600 font-medium">
                            👶 Adapté aux enfants
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/*  Date & Heure */}
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-900">{formatDate(event.date)}</p>
                    <p className="text-xs text-gray-500">
                      {formatTime(event.heure_debut)}
                      {event.heure_fin && ` - ${formatTime(event.heure_fin)}`}
                    </p>
                  </td>

                  {/*  Lieu */}
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                      <MapPin size={14} className="text-gray-400 flex-shrink-0" />
                      <span className="truncate">{event.lieu}</span>
                    </div>
                  </td>

                  {/*  Catégories */}
                  <td className="px-6 py-4">
                    {event.categories && event.categories.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {event.categories.slice(0, 2).map((cat) => (
                          <span
                            key={cat.id}
                            className="bg-blue-50 text-blue-900 px-2 py-0.5 rounded-full text-xs font-medium"
                          >
                            {cat.nom}
                          </span>
                        ))}
                        {event.categories.length > 2 && (
                          <span className="text-xs text-gray-500 font-medium px-1">
                            +{event.categories.length - 2}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400 italic">Aucune</span>
                    )}
                  </td>

                  {/*  Actions */}
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end space-x-2">
                      
                      {/*  Voir (page publique) */}
                      <Link
                        to={`/events/${event.id}`}
                        title="Voir l'événement"
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Eye size={16} />
                      </Link>

                      {/*  Modifier */}
                      <Link
                        to={`/admin/events/${event.id}/edit`}
                        title="Modifier"
                        className="p-2 text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit size={16} />
                      </Link>

                      {/*  Supprimer */}
                      <button
                        onClick={() => handleDelete(event)}
                        disabled={isLoading}
                        title="Supprimer"
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default EventsTable;