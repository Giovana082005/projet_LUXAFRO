import { useEffect, useState } from "react";

/**
 * Déclaration globale pour TypeScript :
 * `grecaptcha` est injecté par le script Google une fois chargé.
 */
declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
const SCRIPT_ID = "google-recaptcha-v3";

/**
 * Hook pour utiliser Google reCAPTCHA v3.
 *
 * - Charge le script une seule fois (même si plusieurs composants l'utilisent)
 * - Expose une fonction `executeRecaptcha(action)` qui renvoie un token
 *
 * Usage :
 *   const { executeRecaptcha, ready } = useRecaptcha();
 *
 *   const handleSubmit = async () => {
 *     const token = await executeRecaptcha("contact_form");
 *     // Envoyer le token au backend
 *   };
 */
export function useRecaptcha() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Si la clé n'est pas configurée, on n'essaie même pas
    if (!RECAPTCHA_SITE_KEY) {
      console.warn("VITE_RECAPTCHA_SITE_KEY n'est pas définie dans .env");
      return;
    }

    // Si le script est déjà chargé, on le réutilise
    if (document.getElementById(SCRIPT_ID)) {
      if (window.grecaptcha) {
        window.grecaptcha.ready(() => setReady(true));
      }
      return;
    }

    // Injection du script Google
    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      window.grecaptcha.ready(() => setReady(true));
    };

    document.head.appendChild(script);

    // Note : on ne supprime PAS le script au démontage.
    // Google reCAPTCHA n'aime pas être chargé/déchargé en permanence,
    // et on veut le réutiliser entre les pages.
  }, []);

  /**
   * Exécute reCAPTCHA et retourne un token.
   * @param action — Nom de l'action ("contact_form"). Doit matcher côté backend.
   */
  const executeRecaptcha = async (action: string): Promise<string> => {
    if (!RECAPTCHA_SITE_KEY) {
      throw new Error("reCAPTCHA non configuré");
    }

    if (!window.grecaptcha) {
      throw new Error("reCAPTCHA n'est pas encore chargé");
    }

    return window.grecaptcha.execute(RECAPTCHA_SITE_KEY, { action });
  };

  return { executeRecaptcha, ready };
}
