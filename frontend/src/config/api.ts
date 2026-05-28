
//URL de base de l'API
export const API_URL = import.meta.env.VITE_API_URL;

//Fonction utilitaire pour récupérer le CSRF cookie
export const getCsrfCookie = async () => {
  await fetch(`${API_URL}/sanctum/csrf-cookie`, {
    credentials: "include",
  });
};

//Fonction utilitaire pour lire le token XSRF dans les cookies
export const getXsrfToken = (): string => {
  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split("=");
    if (name === "XSRF-TOKEN") {
      return decodeURIComponent(value);
    }
  }
  return "";
};

//Headers communs pour les requêtes authentifiées
export const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  Accept: "application/json",
  "X-XSRF-TOKEN": getXsrfToken(),
});

//Construit l'URL complète d'une image stockée sur le serveur Laravel
export const getImageUrl = (path: string | null | undefined): string => {
  if (!path) return "";
  return `${API_URL}/storage/${path}`;
};
 //Image par défaut des évenements
export const FALLBACK_IMAGE_URL = import.meta.env.VITE_FALLBACK_IMAGE_URL ?? 
  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80"; // valeur de secours si .env absent