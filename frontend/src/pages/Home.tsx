import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-500 via-yellow-400 to-red-500 flex items-center justify-center p-4">
      <div className="bg-white p-12 rounded-2xl shadow-2xl text-center max-w-2xl w-full">
        <h1 className="text-6xl font-bold text-gray-800 mb-4">
           Luxafro
        </h1>
        <p className="text-2xl text-gray-600 mb-8">
          Plateforme culturelle camerounaise
        </p>

        <div className="flex justify-center gap-4 flex-wrap">
          <Link
            to="/login"
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            Se connecter
          </Link>

          <Link
            to="/register"
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            S'inscrire
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;