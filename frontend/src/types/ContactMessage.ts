/**
 * Message de contact complet (renvoyé par l'API)
 */
export type ContactMessage = {
  id: number;
  nom: string;
  email: string;
  raison: string;
  message: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
};

/**
 * Données à envoyer pour créer un message
 * Le token reCAPTCHA est requis côté backend mais n'est pas stocké en base.
 */
export type CreateContactMessage = {
  nom: string;
  email: string;
  raison: string;
  message: string;
  recaptcha_token: string;
};