import { useState } from "react";
import { Mail, MailOpen, Search, Inbox, Trash2 } from "lucide-react";
import { useAdminContactMessages } from "../../hooks/useAdminContactMessages";
import type { ContactMessage } from "../../types/ContactMessage";
import Spinner from "../../components/Spinner";
import ContactMessageModal from "../../components/admin/ContactMessageModal";

type FilterMode = "all" | "unread" | "read";

/**
 * Page admin : liste et gestion des messages de contact
 */
function AdminContactMessages() {
  const { messages, loading, error, unreadCount, toggleRead, deleteMessage } =
    useAdminContactMessages();

  const [filter, setFilter] = useState<FilterMode>("all");
  const [search, setSearch] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  // Filtrage combiné : lu/non-lu + recherche texte
  const filteredMessages = messages
    .filter((m) => {
      if (filter === "unread") return !m.is_read;
      if (filter === "read") return m.is_read;
      return true;
    })
    .filter((m) => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        m.nom.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.message.toLowerCase().includes(q)
      );
    });

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  return (
    <div>

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-light text-gray-900 mb-2">
          Messages de contact
        </h1>
        <p className="text-gray-600">
          {messages.length} message{messages.length > 1 ? "s" : ""} reçu{messages.length > 1 ? "s" : ""}
          {unreadCount > 0 && (
            <>
              {" "}— <span className="text-blue-700 font-semibold">{unreadCount} non lu{unreadCount > 1 ? "s" : ""}</span>
            </>
          )}
        </p>
      </div>

      {/* FILTRES + RECHERCHE */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 mb-6 flex flex-col md:flex-row md:items-center gap-4">

        {/* Onglets de filtre */}
        <div className="flex items-center bg-gray-100 rounded-lg p-1">
          <FilterTab
            label="Tous"
            count={messages.length}
            active={filter === "all"}
            onClick={() => setFilter("all")}
          />
          <FilterTab
            label="Non lus"
            count={unreadCount}
            active={filter === "unread"}
            onClick={() => setFilter("unread")}
            highlight
          />
          <FilterTab
            label="Lus"
            count={messages.length - unreadCount}
            active={filter === "read"}
            onClick={() => setFilter("read")}
          />
        </div>

        {/* Recherche */}
        <div className="relative flex-1 md:max-w-xs md:ml-auto">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher..."
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* CONTENU */}
      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
          <p className="text-red-700">❌ {error}</p>
        </div>
      ) : filteredMessages.length === 0 ? (
        <EmptyState filter={filter} hasSearch={search.trim().length > 0} />
      ) : (
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <ul className="divide-y divide-gray-100">
            {filteredMessages.map((m) => (
              <MessageRow
                key={m.id}
                message={m}
                onClick={() => {
                  setSelectedMessage(m);
                  // Auto-mark comme lu à l'ouverture si non lu
                  if (!m.is_read) toggleRead(m.id);
                }}
                onDelete={() => {
                  if (
                    window.confirm(
                      "Supprimer ce message ? Cette action est irréversible."
                    )
                  ) {
                    deleteMessage(m.id);
                  }
                }}
                formatDate={formatDate}
              />
            ))}
          </ul>
        </div>
      )}

      {/* MODAL DÉTAIL */}
      {selectedMessage && (
        <ContactMessageModal
          message={
            // On récupère toujours la version la plus à jour depuis le store
            messages.find((m) => m.id === selectedMessage.id) ?? selectedMessage
          }
          onClose={() => setSelectedMessage(null)}
          onToggleRead={toggleRead}
          onDelete={deleteMessage}
        />
      )}
    </div>
  );
}

/**
 * Onglet de filtre
 */
interface FilterTabProps {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
  highlight?: boolean;
}

function FilterTab({ label, count, active, onClick, highlight }: FilterTabProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
        active
          ? "bg-white text-gray-900 shadow-sm"
          : "text-gray-600 hover:text-gray-900"
      }`}
    >
      <span>{label}</span>
      {count > 0 && (
        <span
          className={`px-1.5 py-0.5 rounded-full text-xs font-semibold ${
            active
              ? highlight
                ? "bg-blue-100 text-blue-800"
                : "bg-gray-100 text-gray-700"
              : highlight
              ? "bg-blue-100 text-blue-800"
              : "bg-gray-200 text-gray-600"
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
}

/**
 * Ligne d'un message dans la liste
 */
interface MessageRowProps {
  message: ContactMessage;
  onClick: () => void;
  onDelete: () => void;
  formatDate: (date: string) => string;
}

function MessageRow({ message, onClick, onDelete, formatDate }: MessageRowProps) {
  return (
    <li>
      <div
        onClick={onClick}
        className={`group flex items-center gap-4 px-5 py-4 hover:bg-gray-50 cursor-pointer transition-colors ${
          !message.is_read ? "bg-blue-50/30" : ""
        }`}
      >
        {/* Icône lu/non lu */}
        <div className="flex-shrink-0">
          {message.is_read ? (
            <MailOpen size={18} className="text-gray-400" />
          ) : (
            <Mail size={18} className="text-blue-700" />
          )}
        </div>

        {/* Infos principales */}
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-3 mb-1">
            <p
              className={`text-sm truncate ${
                !message.is_read
                  ? "font-semibold text-gray-900"
                  : "font-medium text-gray-700"
              }`}
            >
              {message.nom}
            </p>
            <p className="text-xs text-gray-500 flex-shrink-0">
              {formatDate(message.created_at)}
            </p>
          </div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs text-gray-500 capitalize bg-gray-100 px-2 py-0.5 rounded-full">
              {message.raison}
            </span>
            <span className="text-xs text-gray-400 truncate">
              {message.email}
            </span>
          </div>
          <p className="text-sm text-gray-600 truncate">
            {message.message}
          </p>
        </div>

        {/* Action supprimer (visible au hover) */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="flex-shrink-0 w-9 h-9 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
          aria-label="Supprimer"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </li>
  );
}

/**
 * État vide selon le contexte
 */
function EmptyState({ filter, hasSearch }: { filter: FilterMode; hasSearch: boolean }) {
  let title = "Aucun message";
  let description = "Les messages reçus via le formulaire de contact apparaîtront ici.";

  if (hasSearch) {
    title = "Aucun résultat";
    description = "Essayez un autre terme de recherche.";
  } else if (filter === "unread") {
    title = "Tout est lu ✨";
    description = "Aucun message non lu pour le moment.";
  } else if (filter === "read") {
    title = "Aucun message lu";
    description = "Vous n'avez pas encore lu de message.";
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">
      <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
        <Inbox size={24} className="text-blue-700" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
}

export default AdminContactMessages;
