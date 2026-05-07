import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

function HomeHero() {
  return (
    <section 
      className="relative min-h-[600px] lg:min-h-[700px] flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1583308148860-d09ce009f203?auto=format&fit=crop&w=2000&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/*Overlay sombre avec dégradé pour la lisibilité du texte */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-950/90 via-blue-900/80 to-blue-800/70"></div>
      
      {/*Contenu centré */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
        
        {/*Badge avec effet "verre"*/}
        <span className="inline-block bg-white/15 backdrop-blur-sm text-white px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide border border-white/20 mb-6">
          Plateforme culturelle camerounaise
        </span>
        
        {/*Titre principal */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-white leading-tight mb-6">
          Vivez la richesse de la <br className="hidden md:block" />
          <span className="font-semibold">culture camerounaise</span>
        </h1>
        
        {/*Sous-titre */}
        <p className="text-white/90 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-8">
          Une communauté, des événements, des traditions à célébrer ensemble. 
          Découvrez et partagez notre patrimoine culturel.
        </p>
        
        {/* Boutons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            to="/events"
            className="inline-flex items-center space-x-2 bg-white hover:bg-blue-50 text-blue-950 px-8 py-3.5 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            <span>Voir les événements</span>
            <ArrowRight size={20} />
          </Link>
          
          <Link
            to="/register"
            className="inline-flex items-center space-x-2 bg-transparent hover:bg-white/10 text-white border-2 border-white px-8 py-3.5 rounded-lg font-semibold transition-all backdrop-blur-sm"
          >
            <span>Nous rejoindre</span>
          </Link>
        </div>
        
        {/*Indicateur scroll*/}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center text-white/60 animate-bounce">
          <span className="text-xs uppercase tracking-wider mb-2">Découvrir</span>
          <div className="w-6 h-10 border-2 border-white/40 rounded-full flex items-start justify-center p-1.5">
            <div className="w-1 h-2 bg-white/60 rounded-full"></div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HomeHero;