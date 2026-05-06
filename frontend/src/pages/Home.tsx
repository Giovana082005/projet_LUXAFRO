import { Link } from "react-router-dom";
import { Calendar, MapPin, ArrowRight } from "lucide-react";

function Home() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Texte */}
          <div className="space-y-6">
            <span className="inline-block bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
              Événement à ne pas manquer
            </span>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            Atelier découverte
            </h1>
            
            <p className="text-gray-400 text-lg leading-relaxed">
              Notre événement annuel réservé aux plus petits...............
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-gray-300">
                <Calendar size={20} className="text-blue-400" />
                <span>1er Juillet 2026</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <MapPin size={20} className="text-blue-400" />
                <span>Luxembourg, salle ...</span>
              </div>
            </div>
            
            <Link
              to="/register"
              className="inline-flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              <span>S'inscrire maintenant</span>
              <ArrowRight size={20} />
            </Link>
          </div>
          
          {/* Image */}
          <div className="rounded-2xl overflow-hidden shadow-2xl">
            <img
              src="/images/eventImage.jpg" 
              alt="Événement"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Section À propos */}
      <section className="bg-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            À propos de l'Association
          </h2>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto leading-relaxed">
            Luxafro est une plateforme dédiée à la valorisation de la culture camerounaise. 
            Nous organisons des événements, partageons des recettes traditionnelles et créons 
            des liens entre les membres de notre communauté.
          </p>
        </div>
      </section>
    </div>
  );
}

export default Home;