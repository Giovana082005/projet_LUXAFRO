import { useState } from "react";
import { X, CreditCard, Banknote, Users, Baby, CheckCircle2 } from "lucide-react";
import type { Event } from "../types/Event";
import type { PaymentMethod } from "../types/Reservation";
import { useReservations } from "../hooks/useReservations";
import Spinner from "./Spinner";

interface ReservationModalProps {
  event: Event;
  onClose: () => void;
}

/**
 * Modal de réservation d'un événement
 * Gère le formulaire + calcul du prix + soumission
 */
function ReservationModal({ event, onClose }: ReservationModalProps) {
  const { createReservation } = useReservations();

  // État du formulaire
  const [nbAdultes, setNbAdultes] = useState(1);
  const [nbEnfants, setNbEnfants] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("on_site");
  
  //  États de gestion
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Prix de l'événement (0 si gratuit ou non défini)
  const tarif = event.tarif ? parseFloat(event.tarif) : 0;
  const totalPersonnes = nbAdultes + nbEnfants;
  const totalPrice = tarif * totalPersonnes;
  const isGratuit = tarif === 0;

  //  Places restantes
  const placesRestantes = event.nombre_participants
    ? event.nombre_participants
    : null; // null = illimité

  // Empêcher de dépasser les places disponibles
  const canAddMore = placesRestantes === null || totalPersonnes < placesRestantes;

  // Handlers compteurs
  const increment = (setter: React.Dispatch<React.SetStateAction<number>>, value: number) => {
    if (canAddMore) setter(value + 1);
  };

  const decrement = (
    setter: React.Dispatch<React.SetStateAction<number>>,
    value: number,
    min: number
  ) => {
    if (value > min) setter(value - 1);
  };

  // Soumission
  const handleSubmit = async () => {
    setError("");
    setSubmitting(true);

    const result = await createReservation({
      event_id: event.id,
      nb_adultes: nbAdultes,
      nb_enfants: nbEnfants,
      payment_method: paymentMethod,
    });

    setSubmitting(false);

    if (result.success) {
      setSuccess(true);
    } else {
      setError(result.message || "Erreur lors de la réservation");
    }
  };

  
  // VUE SUCCÈS
 
  if (success) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/70 backdrop-blur-sm">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
          
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={32} className="text-green-600" />
          </div>
          
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Inscription confirmée ! 🎉
          </h3>
          
          <p className="text-gray-600 mb-1 text-sm">
            Vous êtes inscrit à <span className="font-semibold text-blue-950">{event.nom}</span>
          </p>
          <p className="text-gray-600 mb-1 text-sm">
            {totalPersonnes} personne{totalPersonnes > 1 ? "s" : ""} •{" "}
            {isGratuit ? "Gratuit" : `${totalPrice.toFixed(2)}€`}
          </p>
          <p className="text-gray-500 text-xs mb-6">
            Paiement {paymentMethod === "on_site" ? "sur place à l'arrivée" : "par QR Code"}
          </p>

          {/* Actions post-succès */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-blue-950 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
            >
              Fermer
            </button>
          </div>

          {/* Badge mock */}
          <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-full px-3 py-1 mt-4 inline-block">
            ⚠️ Mode démonstration — backend non connecté
          </p>
        </div>
      </div>
    );
  }

  // VUE FORMULAIRE (par défaut)
  
  return (
    // Overlay avec fermeture au clic extérieur
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/70 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden">
        
        {/*  En-tête de la modal */}
        <div className="p-5 border-b border-gray-200 flex items-start justify-between">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">
              Inscription
            </p>
            <h2 className="text-lg font-semibold text-gray-900">
              {event.nom}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors flex-shrink-0"
          >
            <X size={16} className="text-gray-600" />
          </button>
        </div>

        {/*  Corps */}
        <div className="p-5 space-y-5">
          
          {/*  Erreur */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-700 text-sm font-medium">❌ {error}</p>
            </div>
          )}

          {/*  Info places restantes */}
          {placesRestantes !== null && (
            <div className="bg-blue-50 border border-blue-100 rounded-lg px-3 py-2">
              <p className="text-blue-900 text-xs font-medium">
                💺 {placesRestantes} place{placesRestantes > 1 ? "s" : ""} disponible{placesRestantes > 1 ? "s" : ""}
              </p>
            </div>
          )}

          {/* ============================================ */}
          {/*  Compteurs de personnes */}
          {/* ============================================ */}
          <div>
            <p className="text-sm font-semibold text-gray-900 mb-3">
              Nombre de personnes
            </p>
            
            <div className="space-y-2">
              
              {/* Adultes */}
              <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
                <div className="flex items-center space-x-2">
                  <Users size={18} className="text-blue-700" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Adultes</p>
                    {!isGratuit && (
                      <p className="text-xs text-gray-500">{tarif.toFixed(2)}€ / personne</p>
                    )}
                  </div>
                </div>

                {/* Compteur */}
                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={() => decrement(setNbAdultes, nbAdultes, 1)}
                    disabled={nbAdultes <= 1}
                    className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed font-semibold text-lg leading-none"
                  >
                    −
                  </button>
                  <span className="w-6 text-center font-semibold text-gray-900">
                    {nbAdultes}
                  </span>
                  <button
                    type="button"
                    onClick={() => increment(setNbAdultes, nbAdultes)}
                    disabled={!canAddMore}
                    className="w-7 h-7 rounded-full bg-blue-950 flex items-center justify-center text-white hover:bg-blue-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed font-semibold text-lg leading-none"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Enfants (seulement si event adapté aux enfants) */}
              {event.pour_enfant && (
                <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
                  <div className="flex items-center space-x-2">
                    <Baby size={18} className="text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Enfants</p>
                      {!isGratuit && (
                        <p className="text-xs text-gray-500">{tarif.toFixed(2)}€ / personne</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <button
                      type="button"
                      onClick={() => decrement(setNbEnfants, nbEnfants, 0)}
                      disabled={nbEnfants <= 0}
                      className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed font-semibold text-lg leading-none"
                    >
                      −
                    </button>
                    <span className="w-6 text-center font-semibold text-gray-900">
                      {nbEnfants}
                    </span>
                    <button
                      type="button"
                      onClick={() => increment(setNbEnfants, nbEnfants)}
                      disabled={!canAddMore}
                      className="w-7 h-7 rounded-full bg-blue-950 flex items-center justify-center text-white hover:bg-blue-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed font-semibold text-lg leading-none"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ============================================ */}
          {/* Mode de paiement */}
          {/* ============================================ */}
          <div>
            <p className="text-sm font-semibold text-gray-900 mb-3">
              Mode de paiement
            </p>
            
            <div className="grid grid-cols-2 gap-2">
              
              {/* Sur place */}
              <button
                type="button"
                onClick={() => setPaymentMethod("on_site")}
                className={`p-3 rounded-xl border-2 text-left transition-all ${
                  paymentMethod === "on_site"
                    ? "border-blue-950 bg-blue-950 text-white"
                    : "border-gray-200 bg-white text-gray-700 hover:border-blue-700"
                }`}
              >
                <div className="flex items-center space-x-2 mb-1">
                  <Banknote size={16} />
                  <span className="text-xs font-semibold">Sur place</span>
                </div>
                <p className={`text-xs ${paymentMethod === "on_site" ? "text-white/80" : "text-gray-500"}`}>
                  À l'arrivée
                </p>
              </button>

              {/* QR Code */}
              <button
                type="button"
                onClick={() => setPaymentMethod("qr_code")}
                className={`p-3 rounded-xl border-2 text-left transition-all ${
                  paymentMethod === "qr_code"
                    ? "border-blue-950 bg-blue-950 text-white"
                    : "border-gray-200 bg-white text-gray-700 hover:border-blue-700"
                }`}
              >
                <div className="flex items-center space-x-2 mb-1">
                  <CreditCard size={16} />
                  <span className="text-xs font-semibold">QR Code</span>
                </div>
                <p className={`text-xs ${paymentMethod === "qr_code" ? "text-white/80" : "text-gray-500"}`}>
                  Paiement direct
                </p>
              </button>
            </div>
          </div>

          {/* ============================================ */}
          {/* Total */}
          {/* ============================================ */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-blue-700 uppercase tracking-wider font-semibold mb-1">
                  Total
                </p>
                <p className="text-sm text-blue-900">
                  {totalPersonnes} personne{totalPersonnes > 1 ? "s" : ""}
                </p>
              </div>
              <p className="text-2xl font-semibold text-blue-950">
                {isGratuit ? "Gratuit" : `${totalPrice.toFixed(2)}€`}
              </p>
            </div>
          </div>
        </div>

        {/*  Actions */}
        <div className="p-5 border-t border-gray-100 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg font-semibold transition-colors text-sm"
          >
            Annuler
          </button>
          
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting || totalPersonnes === 0}
            className="flex-2 flex-grow py-2.5 bg-blue-950 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center justify-center space-x-2"
          >
            {submitting ? (
              <>
                <Spinner size="sm" color="white" />
                <span>Confirmation...</span>
              </>
            ) : (
              <span>Confirmer l'inscription</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReservationModal;