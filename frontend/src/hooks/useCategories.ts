import { useEffect, useState } from "react";
import type { Category } from "../types/Event";
import { API_URL } from "../config/api";

/**
 * Hook pour récupérer la liste des catégories
 * Utilisé notamment dans le formulaire de création/édition d'événement
 */
export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCategories = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/api/categories`, {
        credentials: "include",
        headers: {
          Accept: "application/json",
        },
      });

      if (!res.ok) {
        throw new Error("Erreur lors du chargement des catégories");
      }

      const data = await res.json();
      setCategories(data);
    } catch (err) {
      setError("Impossible de charger les catégories");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return { categories, loading, error, refresh: fetchCategories };
}