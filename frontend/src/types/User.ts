export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at?: string | null;
  role: "utilisateur" | "administrateur";
  created_at?: string;
  updated_at?: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}