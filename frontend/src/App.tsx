import { useState } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  const [page, setPage] = useState<"login" | "register">("login");

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-500 via-yellow-400 to-red-500 flex items-center justify-center p-4">
      <div className="bg-white p-12 rounded-2xl shadow-2xl text-center max-w-2xl w-full">
        <h1 className="text-4xl font-bold mb-6">🌍 Luxafro</h1>

        {/* Boutons navigation */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={() => setPage("login")}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Connexion
          </button>

          <button
            onClick={() => setPage("register")}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Inscription
          </button>
        </div>

        {/* Affichage des pages */}
        {page === "login" && <Login />}
        {page === "register" && <Register />}
      </div>
    </div>
  );
}

export default App;