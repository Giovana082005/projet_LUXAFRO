import { Mail, Clock, MessageCircle, MapPin } from "lucide-react";
import ContactForm from "../components/ContactForm";

/**
 * Page Contact publique
 * Structure : Hero + Layout 2 colonnes (infos | formulaire)
 */
function Contact() {
  return (
    <div className="min-h-screen bg-white">

      {/* ============================================ */}
      {/* HERO */}
      {/* ============================================ */}
      <section className="relative bg-blue-950 py-16 md:py-24 px-6 overflow-hidden">
        {/* Élément décoratif en arrière-plan */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-700 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
        </div>

        <div className="relative max-w-5xl mx-auto text-center">
          <span className="inline-block bg-white/15 backdrop-blur-sm text-white px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide border border-white/20 mb-6">
            Nous contacter
          </span>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-white leading-tight mb-4">
            Une question ? <br />
            <span className="font-semibold">Parlons-en.</span>
          </h1>

          <p className="text-white/80 text-lg max-w-2xl mx-auto leading-relaxed">
            Une suggestion, un partenariat, ou simplement envie d'échanger ?
            Notre équipe vous répond sous 48h.
          </p>
        </div>
      </section>

      {/* ============================================ */}
      {/* CONTENU PRINCIPAL */}
      {/* ============================================ */}
      <section className="max-w-6xl mx-auto px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">

          {/* COLONNE GAUCHE — Infos de contact */}
          <aside className="lg:col-span-1 space-y-6">
            <div>
              <h2 className="text-xs uppercase tracking-wider text-blue-700 font-semibold mb-3">
                Informations
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                Plusieurs façons de nous joindre. Choisissez celle qui vous convient.
              </p>
            </div>

            {/* Carte Email */}
            <ContactInfoCard
              icon={<Mail size={20} className="text-white" />}
              label="Email"
              value="contact@luxafro.fr"
              hint="Pour toute question générale"
            />

            {/* Carte Temps de réponse */}
            <ContactInfoCard
              icon={<Clock size={20} className="text-white" />}
              label="Délai de réponse"
              value="Sous 48h"
              hint="Du lundi au vendredi"
            />

            {/* Carte Localisation */}
            <ContactInfoCard
              icon={<MapPin size={20} className="text-white" />}
              label="Basés à"
              value="Differdange, Luxembourg"
              hint="Association culturelle"
            />

            {/* Encart d'aide */}
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
              <div className="flex items-start space-x-3">
                <div className="w-9 h-9 bg-blue-950 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MessageCircle size={18} className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-blue-950 mb-1">
                    Besoin d'aide rapide ?
                  </p>
                  <p className="text-xs text-blue-900 leading-relaxed">
                    Pour les questions sur un événement précis,
                    rendez-vous directement sur sa fiche.
                  </p>
                </div>
              </div>
            </div>
          </aside>

          {/* COLONNE DROITE — Formulaire */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-2">
                Envoyez-nous un message
              </h2>
              <p className="text-gray-600 text-sm">
                Tous les champs marqués d'un <span className="text-red-500">*</span> sont obligatoires.
              </p>
            </div>

            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  );
}

/**
 * Petit composant de carte d'info de contact
 * Réutilisé pour Email, Délai, Localisation, etc.
 */
interface ContactInfoCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  hint?: string;
}

function ContactInfoCard({ icon, label, value, hint }: ContactInfoCardProps) {
  return (
    <div className="flex items-start space-x-3">
      <div className="w-10 h-10 bg-blue-950 rounded-lg flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-0.5">
          {label}
        </p>
        <p className="text-sm text-gray-900 font-medium break-words">
          {value}
        </p>
        {hint && (
          <p className="text-xs text-gray-500 mt-0.5">{hint}</p>
        )}
      </div>
    </div>
  );
}

export default Contact;
