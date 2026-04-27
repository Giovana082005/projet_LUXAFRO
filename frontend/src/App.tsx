import { useState, useEffect } from 'react'
//permet de stocker des données qui changent (loading, erreur, données API)
//permet d'exécuter du code au chargement du composant

//Interface TypeScript
interface ApiResponse {
  success: boolean
  message: string
  data: {
    project: string
    description: string
    version: string
    timestamp: string
  }
}

function App() {
  const [apiData, setApiData] = useState<ApiResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Appel à l'API Laravel au chargement de la page
    fetch('http://localhost:8000/api/welcome')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Erreur HTTP : ${response.status}`)
        }
        return response.json()
      })
      .then((data: ApiResponse) => {
        setApiData(data)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-500 via-yellow-400 to-red-500 flex items-center justify-center p-4">
      <div className="bg-white p-12 rounded-2xl shadow-2xl text-center max-w-2xl">
        <h1 className="text-6xl font-bold text-gray-800 mb-4">
          🌍 Luxafro
        </h1>
        <p className="text-2xl text-gray-600 mb-6">
          Plateforme culturelle camerounaise
        </p>

        {/* Affichage de la réponse de l'API */}
        <div className="border-t border-gray-200 pt-6 mt-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            🔗 Connexion à l'API Laravel
          </h2>

          {loading && (
            <p className="text-blue-600 animate-pulse">
              ⏳ Chargement des données...
            </p>
          )}

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              ❌ Erreur : {error}
            </div>
          )}

          {apiData && (
            <div className="bg-green-50 border border-green-300 rounded-lg p-4 text-left">
              <p className="text-green-800 font-semibold mb-2">
                ✅ {apiData.message}
              </p>
              <div className="text-sm text-gray-700 space-y-1">
                <p><span className="font-semibold">Projet :</span> {apiData.data.project}</p>
                <p><span className="font-semibold">Description :</span> {apiData.data.description}</p>
                <p><span className="font-semibold">Version :</span> {apiData.data.version}</p>
                <p className="text-xs text-gray-500 mt-2">
                  Réponse reçue le : {new Date(apiData.data.timestamp).toLocaleString('fr-FR')}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 pt-4 mt-6">
          <p className="text-gray-500 text-sm">
            React + Vite + TypeScript + Tailwind CSS ↔ Laravel 13
          </p>
        </div>
      </div>
    </div>
  )
}

export default App