/**
 * Contact complet
 */

export type ContactMessage ={
  id: number;
  nom: string;
  email: string;
  raison: string;
  message: string;
  is_read:boolean; 
  created_at: string;
  updated_at: string;
};

/**
 * Données à envoyer pour créer un message
 * (sous-ensemble des champs Contact)
 */
export type CreateContactMessage = {
   nom: string;
  email: string;
  raison: string;
   message: string;
};