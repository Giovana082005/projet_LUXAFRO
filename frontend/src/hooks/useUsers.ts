import { useEffect, useState, useCallback } from "react";
import type { User } from "../types/User";

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("auth_token");

      const res = await fetch("http://localhost:8000/api/users", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!res.ok) {
        throw new Error("Erreur API: " + res.status);
      }

      const data = await res.json();
      setUsers(data);

    } catch (err: any) {
      setError(err.message || "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return { users, loading, error, refresh: fetchUsers };
}