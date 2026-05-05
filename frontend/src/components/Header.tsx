import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, LogIn, LogOut, User as UserIcon } from "lucide-react";
import type { User } from "../types/User";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  //Vérifier si l'utilisateur est connecté au chargement
  useEffect(() => {
    checkAuth();
  }, [location.pathname]); //Re-vérifie à chaque changement de route

  //Fermer le menu mobile quand on change de page
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const checkAuth = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/me", {
        credentials: "include",
        headers: {
          Accept: "application/json",
        },
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    }
  };

  const getCsrfCookie = async () => {
    await fetch("http://localhost:8000/sanctum/csrf-cookie", {
      credentials: "include",
    });
  };

  const getXsrfToken = (): string => {
    const cookies = document.cookie.split(";");
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split("=");
      if (name === "XSRF-TOKEN") {
        return decodeURIComponent(value);
      }
    }
    return "";
  };

  const handleLogout = async () => {
    try {
      await getCsrfCookie();
      await fetch("http://localhost:8000/api/logout", {
        method: "POST",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "X-XSRF-TOKEN": getXsrfToken(),
        },
      });
    } catch {
      console.error("Erreur lors de la déconnexion");
    } finally {
      setUser(null);
      navigate("/");
    }
  };

  //Liens de navigation
  const navLinks = [
    { to: "/", label: "Accueil" },
    { to: "/events", label: "Événements" }
  ];

  return (
    <header className="sticky top-0 z-50 bg-gray-900 border-b border-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">Lx</span>
            </div>
            <span className="text-white font-bold text-xl hidden sm:block">
              Luxafro
            </span>
          </Link>

          {/* Navigation desktop (cachée sur mobile) */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-medium transition-colors ${
                  location.pathname === link.to
                    ? "text-blue-400"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions à droite (Desktop) */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 text-gray-300">
                  <UserIcon size={18} />
                  <span className="text-sm">{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  <LogOut size={16} />
                  <span>Déconnexion</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                <LogIn size={16} />
                <span>Connexion</span>
              </Link>
            )}
          </div>

          {/* Bouton burger menu (mobile) */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white hover:text-blue-400 transition-colors"
            aria-label="Menu"
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Menu mobile (s'ouvre quand burger cliqué) */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-800">
            <nav className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === link.to
                      ? "bg-blue-500/20 text-blue-400"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              <div className="border-t border-gray-800 pt-3 mt-3">
                {user ? (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-gray-300 px-3 py-2">
                      <UserIcon size={18} />
                      <span className="text-sm">{user.name}</span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      <LogOut size={16} />
                      <span>Déconnexion</span>
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    className="flex items-center justify-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    <LogIn size={16} />
                    <span>Connexion</span>
                  </Link>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;