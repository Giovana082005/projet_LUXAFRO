import { X, Mail, User, Calendar, Tag, Trash2, Eye, EyeOff } from "lucide-react";
import type { ContactMessage } from "../../types/ContactMessage";

interface ContactMessageModalProps {
  message: ContactMessage;
  onClose: () => void;
  onToggleRead: (id: number) => void;
  onDelete: (id: number) => void;
}

/**
 * Modal de détail d'un message de contact
 * Affiche les infos complètes + actions (toggle lu, supprimer)
 */
function ContactMessageModal({
  message,
  onClose,
  onToggleRead,
  onDelete,
}: ContactMessageModalProps) {
  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const handleDelete = () => {
    if (window.confirm("Voulez-vous vraiment supprimer ce message ? Cette action est irréversible.")) {
      onDelete(message.id);
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/70 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

        {/* HEADER */}
        <div className="p-5 md:p-6 border-b border-gray-200 flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-2">
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
                Message de contact
              </p>
              {!message.is_read && (
                <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs font-semibold">
                  Non lu
                </span>
              )}
            </div>
            <h2 className="text-lg md:text-xl font-semibold text-gray-900 truncate">
              {message.nom}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors flex-shrink-0"
            aria-label="Fermer"
          >
            <X size={18} className="text-gray-600" />
          </button>
        </div>

        {/* CORPS — scrollable */}
        <div className="p-5 md:p-6 space-y-5 overflow-y-auto">

          {/* Infos expéditeur */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InfoBlock
              icon={<User size={14} className="text-blue-700" />}
              label="Nom"
              value={message.nom}
            />
            <InfoBlock
              icon={<Mail size={14} className="text-blue-700" />}
              label="Email"
              value={
                <a
                  href={`mailto:${message.email}`}
                  className="text-blue-700 hover:underline"
                >
                  {message.email}
                </a>
              }
            />
            <InfoBlock
              icon={<Tag size={14} className="text-blue-700" />}
              label="Raison"
              value={<span className="capitalize">{message.raison}</span>}
            />
            <InfoBlock
              icon={<Calendar size={14} className="text-blue-700" />}
              label="Reçu le"
              value={formatDate(message.created_at)}
            />
          </div>

          {/* Message */}
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">
              Message
            </p>
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
              <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-line">
                {message.message}
              </p>
            </div>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="p-5 md:p-6 border-t border-gray-100 flex flex-col-reverse sm:flex-row gap-3 sm:justify-between">

          {/* Supprimer (à gauche, secondaire/danger) */}
          <button
            type="button"
            onClick={handleDelete}
            className="inline-flex items-center justify-center space-x-2 text-red-600 hover:bg-red-50 px-4 py-2.5 rounded-lg font-semibold text-sm transition-colors"
          >
            <Trash2 size={16} />
            <span>Supprimer</span>
          </button>

          {/* Actions droite */}
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              type="button"
              onClick={() => onToggleRead(message.id)}
              className="inline-flex items-center justify-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2.5 rounded-lg font-semibold text-sm transition-colors"
            >
              {message.is_read ? <EyeOff size={16} /> : <Eye size={16} />}
              <span>
                {message.is_read ? "Marquer non lu" : "Marquer lu"}
              </span>
            </button>

            <a
              href={`mailto:${message.email}?subject=Re: ${encodeURIComponent(message.raison)}`}
              className="inline-flex items-center justify-center space-x-2 bg-blue-950 hover:bg-blue-800 text-white px-4 py-2.5 rounded-lg font-semibold text-sm transition-colors"
            >
              <Mail size={16} />
              <span>Répondre</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Petit bloc d'info aligné avec icône
 */
interface InfoBlockProps {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}

function InfoBlock({ icon, label, value }: InfoBlockProps) {
  return (
    <div>
      <div className="flex items-center space-x-2 mb-1">
        {icon}
        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
          {label}
        </p>
      </div>
      <div className="text-sm text-gray-900 font-medium break-words">
        {value}
      </div>
    </div>
  );
}

export default ContactMessageModal;
