import { useUsers } from "../hooks/useUsers";
import type { User } from "../types/User";

export default function AdminUsers() {
  const { users, loading, refresh, error } = useUsers();

  const token = localStorage.getItem("auth_token");

  const deleteUser = async (id: number) => {
    try {
      const res = await fetch(
        `http://localhost:8000/api/users/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (!res.ok) {
        throw new Error("Erreur lors de la suppression");
      }

      // recharge la liste
      refresh();
    } catch (err) {
      console.error(err);
      alert("Impossible de supprimer l'utilisateur");
    }
  };

  // loading
  if (loading) {
    return <p>Chargement...</p>;
  }

  // erreur API (si ton hook la gère)
  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  return (
    <div>
      <h2>Gestion des utilisateurs</h2>

      {users.length === 0 ? (
        <p>Aucun utilisateur</p>
      ) : (
        users.map((user: User) => (
          <div
            key={user.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "8px",
              borderBottom: "1px solid #ddd",
            }}
          >
            <div>
              <strong>{user.name}</strong> - {user.email}
            </div>

            <button
              onClick={() => deleteUser(user.id)}
              style={{
                background: "red",
                color: "white",
                border: "none",
                padding: "5px 10px",
                cursor: "pointer",
              }}
            >
              Supprimer
            </button>
          </div>
        ))
      )}
    </div>
  );
}