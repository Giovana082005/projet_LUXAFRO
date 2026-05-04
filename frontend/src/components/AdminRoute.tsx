import { Navigate } from "react-router-dom";
import { ReactNode } from "react";

/**
 * protege les pages de l'acces via url
 * @param param0 
 * @returns 
 */
export default function AdminRoute({ children }: { children: ReactNode }) {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!user || user.role !== "administrateur") {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}