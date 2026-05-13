import { Link } from "react-router-dom";
import { 
  MapPin, 
  Users, 
  Euro, 
  CheckCircle2, 
  Clock as ClockIcon, 
  XCircle,
  Ticket
} from "lucide-react";
import { useReservations } from "../hooks/useReservations";
import type { Reservation, ReservationStatus } from "../types/Reservation";
import Spinner from "../components/Spinner";

/**
 * Page "Mes réservations"
 * Liste les réservations de l'utilisateur connecté
 */
function MyReservations() {
  const { reservations, loading, error, cancelReservation } = useReservations();

  // Formater le mois en abréviation
  const formatMonth = (dateString: string) => {
    return new Date(dateString)
      .toLocaleDateString("fr-FR", { month: "short" })
      .replace(".", "")
      .toUpperCase();
  };

  // Formater le jour
  const formatDay = (dateString: string) => {
    return new Date(dateString).getDate();
  };

  // Configuration des badges de statut
  const getStatusConfig = (status: ReservationStatus) => {
    switch (status) {
      case "paid":
        return {
          label: "Payée",
          bg: "bg-green-100",
          text: "text-green-700",
          icon: CheckCircle2,
        };
      case "confirmed":
        return {
          label: "Confirmée",
          bg: "bg-blue-100",
          text: "text-blue-700",
          icon: CheckCircle2,
        };
      case "pending":
        return {
          label: "En attente",
          bg: "bg-amber-100",
          text: "text-amber-700",
          icon: ClockIcon,
        };
      case "cancelled":
        return {
          label: "Annulée",
          bg: "bg-red-100",
          text: "text-red-700",
          icon: XCircle,
        };
    }
  };

  // Gérer l'annulation
  const handleCancel = async (reservation: Reservation) => {
    if (!confirm(`Annuler votre réservation pour "${reservation.event?.nom}" ?`)) {
      return;
    }

    const result = await cancelReservation(reservation.id);
    if (!result.success) {
      alert("Erreur : " + result.message);
    }
  };

  // Chargement
  if (loading) {
    return <Spinner fullScreen />;
  }

  //  Erreur
  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md text-center">
          <p className="text-red-700 font-medium">❌ {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/*  En-tête */}
        <div className="text-center mb-12">
          <span className="inline-block bg-blue-950 text-white px-4 py-1.5 rounded-full text-xs font-semibold mb-4 uppercase tracking-wide">
            Mon espace
          </span>
          
          <h1 className="text-4xl md:text-5xl mb-4 font-light text-gray-900">
            Mes réservations
          </h1>
          
          <p className="text-gray-600 text-lg">
            Retrouvez l'historique de vos inscriptions
          </p>
        </div>

        {/* Aucune réservation */}
        {reservations.length === 0 ? (
          <div className="text-center py-16 bg-blue-50 rounded-2xl">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
              <Ticket size={28} className="text-blue-700" />
            </div>
            <p className="text-xl text-blue-950 font-light mb-2">
              Aucune réservation pour le moment
            </p>
            <p className="text-blue-700 mb-6">
              Découvrez nos événements et inscrivez-vous !
            </p>
            <Link
              to="/events"
              className="inline-flex items-center space-x-2 bg-blue-950 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              <span>Voir les événements</span>
            </Link>
          </div>
        ) : (
          //  Liste des réservations
          <div className="space-y-3">
            {reservations.map((reservation) => {
              const status = getStatusConfig(reservation.status);
              const StatusIcon = status.icon;
              const isCancelled = reservation.status === "cancelled";
              const event = reservation.event;

              if (!event) return null; // Sécurité

              return (
                <div
                  key={reservation.id}
                  className={`bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow ${
                    isCancelled ? "opacity-60" : ""
                  }`}
                >
                  <div className="grid grid-cols-[80px_1fr_auto] gap-4 items-center">
                    
                    {/* Vignette date */}
                    <div className={`rounded-lg aspect-square flex items-center justify-center ${
                      isCancelled ? "bg-gray-100" : "bg-blue-50"
                    }`}>
                      <div className="text-center">
                        <p className={`text-xs font-bold uppercase ${
                          isCancelled ? "text-gray-400" : "text-blue-700"
                        }`}>
                          {formatMonth(event.date)}
                        </p>
                        <p className={`text-2xl font-semibold leading-none ${
                          isCancelled ? "text-gray-400 line-through" : "text-blue-950"
                        }`}>
                          {formatDay(event.date)}
                        </p>
                      </div>
                    </div>

                    {/*  Infos */}
                    <div className="min-w-0">
                      {/* Titre + badge */}
                      <div className="flex items-center flex-wrap gap-2 mb-2">
                        <h3 className={`text-base font-semibold truncate ${
                          isCancelled ? "text-gray-500 line-through" : "text-gray-900"
                        }`}>
                          {event.nom}
                        </h3>
                        <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase ${status.bg} ${status.text}`}>
                          <StatusIcon size={11} />
                          <span>{status.label}</span>
                        </span>
                      </div>

                      {/* Infos compactes */}
                      <div className={`flex flex-wrap gap-x-4 gap-y-1 text-sm ${
                        isCancelled ? "text-gray-400" : "text-gray-600"
                      }`}>
                        <span className="flex items-center space-x-1">
                          <MapPin size={14} />
                          <span>{event.lieu}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Users size={14} />
                          <span>
                            {reservation.nb_adultes + reservation.nb_enfants} personne
                            {reservation.nb_adultes + reservation.nb_enfants > 1 ? "s" : ""}
                          </span>
                        </span>
                        {!isCancelled && (
                          <span className="flex items-center space-x-1">
                            <Euro size={14} />
                            <span>
                              {reservation.total_price === 0
                                ? "Gratuit"
                                : `${reservation.total_price.toFixed(2)}€`}
                            </span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-2 flex-shrink-0">
                      <Link
                        to={`/events/${event.id}`}
                        className="px-3 py-1.5 bg-white border border-gray-300 hover:border-blue-700 hover:text-blue-700 rounded-lg text-sm font-medium text-gray-700 transition-colors text-center"
                      >
                        Détails
                      </Link>
                      
                      {!isCancelled && (
                        <button
                          onClick={() => handleCancel(reservation)}
                          className="px-3 py-1.5 bg-white border border-red-300 hover:bg-red-50 text-red-600 rounded-lg text-sm font-medium transition-colors"
                        >
                          Annuler
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyReservations;