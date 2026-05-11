export type EventPhoto = {
  id: number;
  event_id: number;
  image_path: string; // chemin relatif du fichier sur le serveur
  created_at?: string;
  updated_at?: string;
};