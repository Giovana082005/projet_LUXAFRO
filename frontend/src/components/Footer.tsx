import { Link } from "react-router-dom";
import {  Mail, MapPin, Phone } from "lucide-react";
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";
function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 border-t border-gray-800 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Grille principale */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Logo + Description */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <span className="font-bold text-xl hidden sm:block bg-gradient-to-r from-white via-yellow-200 to-yellow-500 bg-clip-text text-transparent">LX</span>
            </div>
          <span className="font-bold text-xl hidden sm:block bg-gradient-to-r from-white via-yellow-200 to-yellow-500 bg-clip-text text-transparent">
            LUXAFRO
          </span>
            </Link>
            <p className="text-sm text-gray-400">
              Plateforme culturelle camerounaise. Découvrez les événements, recettes traditionnelles et la richesse de notre culture.
            </p>
          </div>

          {/* Liens rapides */}
          <div>
            <h3 className="text-white font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-blue-400 transition-colors">
                  Accueil
                </Link>
              </li>
              <li>
                <Link to="/events" className="hover:text-blue-400 transition-colors">
                  Événements
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-blue-400 transition-colors">
                  Contact
                </Link>
              </li>
             
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-2">
                <MapPin size={16} className="text-blue-400 mt-1 flex-shrink-0" />
                <span>Luxembourg</span>
              </li>
              <li className="flex items-start space-x-2">
                <Mail size={16} className="text-blue-400 mt-1 flex-shrink-0" />
                <a href="mailto:contact@luxafro.fr" className="hover:text-blue-400 transition-colors">
                  contact@luxafro.fr
                </a>
              </li>
              <li className="flex items-start space-x-2">
                <Phone size={16} className="text-blue-400 mt-1 flex-shrink-0" />
                <a href="tel:+3300000000" className="hover:text-blue-400 transition-colors">
                  +33 00 00 00 00
                </a>
              </li>
            </ul>
          </div>
          {/* Colonne 4 : Réseaux sociaux */}
          <div>
            <h3 className="text-white font-semibold mb-4">Suivez-nous</h3>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/luxafroworkshop/" className="hover:text-blue-400 cursor-pointer " > <FaFacebook /></a>
              <a href="https://www.instagram.com/luxafroworkshop/" className="hover:text-pink-400 cursor-pointer"> <FaInstagram /></a>
              <a href="https://www.youtube.com/" className="hover:text-red-400 cursor-pointer" > <FaYoutube /></a>
            </div>
            </div>
        </div>
        {/* Ligne de séparation + copyright */}
        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
          <p>
            © {currentYear} Luxafro. Tous droits réservés.
          </p>
          <div className="mt-2 space-x-4">
            <Link to="/legal" className="hover:text-blue-400 transition-colors">
              Mentions légales
            </Link>
            <span>•</span>
            <Link to="/privacy" className="hover:text-blue-400 transition-colors">
              Confidentialité
            </Link>
            <span>•</span>
            <Link to="/terms" className="hover:text-blue-400 transition-colors">
              CGU
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;