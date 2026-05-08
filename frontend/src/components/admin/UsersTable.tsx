import { useState } from "react";
import { Edit, Trash2, Calendar } from "lucide-react";
import type { User } from "../../types/User";

interface UsersTableProps {
  users: User[];
  currentUserId?: number; //ID de l'admin connecté 
  onUpdateRole: (id: number, role: User["role"]) => Promise<{ success: boolean; message?: string }>;
  onDelete: (id: number) => Promise<{ success: boolean; message?: string }>;
}

/**
 * Tableau interactif des utilisateurs
 * Affiche la liste avec actions (modifier rôle, supprimer)
 */
function UsersTable({ users, currentUserId, onUpdateRole, onDelete }: UsersTableProps) {
  //État pour suivre quelle action est en cours (loader sur le bouton)
  const [actionInProgress, setActionInProgress] = useState<number | null>(null);

  //Formater une date (created_at)
  const formatDate = (dateString?: string) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  //Générer les initiales depuis le nom
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  //Couleur de l'avatar basée sur le rôle
  const getAvatarColor = (role: User["role"]) => {
    return role === "administrateur" ? "bg-blue-950" : "bg-blue-700";
  };

  //Style du badge de rôle
  const getRoleBadgeStyle = (role: User["role"]) => {
    return role === "administrateur"
      ? "bg-blue-950 text-white"
      : "bg-blue-50 text-blue-900";
  };

  //Label lisible du rôle
  const getRoleLabel = (role: User["role"]) => {
    return role === "administrateur" ? "Admin" : "Utilisateur";
  };

  //Toggle le rôle
  const handleToggleRole = async (user: User) => {
    const newRole: User["role"] =
      user.role === "administrateur" ? "utilisateur" : "administrateur";

    const confirmMessage =
      newRole === "administrateur"
        ? `Promouvoir ${user.name} en administrateur ?`
        : `Rétrograder ${user.name} en utilisateur ?`;

    if (!confirm(confirmMessage)) return;

    setActionInProgress(user.id);
    const result = await onUpdateRole(user.id, newRole);
    setActionInProgress(null);

    if (!result.success) {
      alert("Erreur : " + result.message);
    }
  };

  //Supprimer un user (avec confirmation)
  const handleDelete = async (user: User) => {
    if (!confirm(`Supprimer ${user.name} ? Cette action peut être annulée.`)) return;

    setActionInProgress(user.id);
    const result = await onDelete(user.id);
    setActionInProgress(null);

    if (!result.success) {
      alert("Erreur : " + result.message);
    }
  };

  //Aucun user
  if (users.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
        <p className="text-gray-500">Aucun utilisateur à afficher</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          {/*En-tête du tableau */}
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-6 py-3">
                Utilisateur
              </th>
              <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-6 py-3">
                Email
              </th>
              <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-6 py-3">
                Rôle
              </th>
              <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-6 py-3">
                Inscrit le
              </th>
              <th className="text-right text-xs font-semibold text-gray-600 uppercase tracking-wider px-6 py-3">
                Actions
              </th>
            </tr>
          </thead>

          {/*Corps du tableau */}
          <tbody className="divide-y divide-gray-200">
            {users.map((user) => {
              const isCurrentUser = user.id === currentUserId;
              const isLoading = actionInProgress === user.id;

              return (
                <tr
                  key={user.id}
                  className={`hover:bg-gray-50 transition-colors ${
                    isLoading ? "opacity-50" : ""
                  }`}
                >
                  {/*Avatar + Nom */}
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-10 h-10 rounded-full ${getAvatarColor(
                          user.role
                        )} text-white flex items-center justify-center text-sm font-semibold flex-shrink-0`}
                      >
                        {getInitials(user.name)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {user.name}
                        </p>
                        {isCurrentUser && (
                          <p className="text-xs text-blue-700 font-medium">
                            (Vous)
                          </p>
                        )}
                      </div>
                    </div>
                  </td>

                  {/*Email */}
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </td>

                  {/* Rôle */}
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getRoleBadgeStyle(
                        user.role
                      )}`}
                    >
                      {getRoleLabel(user.role)}
                    </span>
                  </td>

                  {/* Date d'inscription */}
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-1.5 text-sm text-gray-500">
                      <Calendar size={14} />
                      <span>{formatDate(user.created_at)}</span>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end space-x-2">
                      {/* Modifier rôle */}
                      <button
                        onClick={() => handleToggleRole(user)}
                        disabled={isCurrentUser || isLoading}
                        title={
                          isCurrentUser
                            ? "Vous ne pouvez pas modifier votre propre rôle"
                            : "Modifier le rôle"
                        }
                        className="p-2 text-blue-700 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <Edit size={16} />
                      </button>

                      {/* Supprimer */}
                      <button
                        onClick={() => handleDelete(user)}
                        disabled={isCurrentUser || isLoading}
                        title={
                          isCurrentUser
                            ? "Vous ne pouvez pas vous supprimer"
                            : "Supprimer"
                        }
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

export default UsersTable;