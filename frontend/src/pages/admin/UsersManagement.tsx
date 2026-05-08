import { Users, ShieldCheck, UserCheck } from "lucide-react";
import { useUsers } from "../../hooks/useUsers";
import { useAuth } from "../../hooks/useAuth";
import UsersTable from "../../components/admin/UsersTable";
import Spinner from "../../components/Spinner";

/**
 * Page de gestion des utilisateurs (admin)
 * Affiche la liste, les stats, et permet les actions
 */
function UsersManagement() {
  // Hooks pour les données
  const { users, loading, error, updateUserRole, deleteUser } = useUsers();
  const { user: currentUser } = useAuth();

  //Calcul des statistiques
  const stats = {
    total: users.length,
    admins: users.filter((u) => u.role === "administrateur").length,
    utilisateurs: users.filter((u) => u.role === "utilisateur").length,
  };

  return (
    <div>
      
      {/* En-tête de la page */}
      <div className="mb-8">
        <h1 className="text-3xl font-light text-gray-900 mb-2">
          Gestion des utilisateurs
        </h1>
        <p className="text-gray-600">
          Gérez les membres de la communauté Luxafro
        </p>
      </div>

      {/* Cartes statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        
        {/* Carte Total */}
        <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
              Total
            </span>
            <Users size={18} className="text-blue-700" />
          </div>
          <p className="text-3xl font-semibold text-gray-900">
            {stats.total}
          </p>
        </div>

        {/* Carte Admins */}
        <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
              Administrateurs
            </span>
            <ShieldCheck size={18} className="text-blue-950" />
          </div>
          <p className="text-3xl font-semibold text-blue-950">
            {stats.admins}
          </p>
        </div>

        {/* Carte Utilisateurs */}
        <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
              Utilisateurs
            </span>
            <UserCheck size={18} className="text-blue-700" />
          </div>
          <p className="text-3xl font-semibold text-blue-700">
            {stats.utilisateurs}
          </p>
        </div>
      </div>

      {/* Tableau des utilisateurs - Gestion des états */}
      
      {/*Chargement */}
      {loading && (
        <div className="flex justify-center py-20">
          <Spinner />
        </div>
      )}

      {/* Erreur */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-700 font-medium">❌ {error}</p>
        </div>
      )}

      {/* Tableau */}
      {!loading && !error && (
        <UsersTable
          users={users}
          currentUserId={currentUser?.id}
          onUpdateRole={updateUserRole}
          onDelete={deleteUser}
        />
      )}
    </div>
  );
}

export default UsersManagement;