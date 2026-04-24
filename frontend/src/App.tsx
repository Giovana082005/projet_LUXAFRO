function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-500 via-yellow-400 to-red-500 flex items-center justify-center p-4">
      <div className="bg-white p-12 rounded-2xl shadow-2xl text-center max-w-2xl">
        <h1 className="text-6xl font-bold text-gray-800 mb-4">
          🌍 Luxafro
        </h1>
        <p className="text-2xl text-gray-600 mb-6">
          Plateforme culturelle camerounaise
        </p>
        <div className="border-t border-gray-200 pt-6 mt-6">
          <p className="text-gray-500 text-sm">
            Frontend développé avec
          </p>
          <p className="text-gray-700 font-semibold mt-2">
            React 19 + Vite + TypeScript + Tailwind CSS
          </p>
        </div>
      </div>
    </div>
  )
}

export default App