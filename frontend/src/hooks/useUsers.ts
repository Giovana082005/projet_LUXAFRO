import { useEffect, useState } from "react";
import type { User } from "../types/User";
import { API_URL, getCsrfCookie, getAuthHeaders } from "../config/api";

/**
 * Hook centralisé pour gérer les utilisateurs côté admin
 * 
 * Expose :
 * - users : la liste des utilisateurs
 * - loading : true pendant les chargements
 * - error : message d'erreur éventuel
 * - fetchUsers : recharger la liste
 * - updateUserRole : modifier le rôle d'un user
 * - deleteUser : supprimer un user (soft delete)
 */
export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  //Récupérer la liste des users
  const fetchUsers = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/api/users`, {
        credentials: "include",
        headers: {
          Accept: "application/json",
        },
      });

      if (!res.ok) {
        throw new Error("Erreur lors du chargement des utilisateurs");
      }

      const data = await res.json();
      setUsers(data);
    } catch (err) {
      setError("Impossible de charger les utilisateurs");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  //Modifier le rôle d'un utilisateur
  const updateUserRole = async (id: number, role: User["role"]) => {
    try {
      //Récupérer le cookie CSRF avant une requête 
      await getCsrfCookie();

      const res = await fetch(`${API_URL}/api/users/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: getAuthHeaders(),
        body: JSON.stringify({ role }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Erreur lors de la modification");
      }

      //Mise à jour optimiste : on modifie directement la liste locale
      //sans avoir à refaire un fetchUsers() complet
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === id ? { ...user, role } : user
        )
      );

      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur inconnue";
      console.error(err);
      return { success: false, message };
    }
  };

  //Supprimer un utilisateur (soft delete)
  const deleteUser = async (id: number) => {
    try {
      await getCsrfCookie();

      const res = await fetch(`${API_URL}/api/users/${id}`, {
        method: "DELETE",
        credentials: "include",
        headers: getAuthHeaders(),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Erreur lors de la suppression");
      }

      //Mise à jour optimiste : on retire l'user de la liste
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));

      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur inconnue";
      console.error(err);
      return { success: false, message };
    }
  };

  //Chargement automatique au montage du composant
  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    loading,
    error,
    fetchUsers,
    updateUserRole,
    deleteUser,
  };
}