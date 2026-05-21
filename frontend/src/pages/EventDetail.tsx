import { useParams, Link, useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Users,
  Euro,
  Baby,
  AlertCircle,
  LogIn
} from "lucide-react";

import {
  useState,
  useEffect
} from "react";

import { useEvent } from "../hooks/useEvent";

import { getImageUrl } from "../config/api";

import Spinner from "../components/Spinner";

import ReservationModal from "../components/ReservationModal";

import { useAuth } from "../hooks/useAuth";

import echo from "../lib/echo";

/**
 * Page détail d'un événement
 */

function EventDetail() {

  const { id } =
    useParams<{ id: string }>();

  const navigate = useNavigate();

  const {
    event,
    loading,
    error,
    notFound
  } = useEvent(id);

  /*
  |--------------------------------------------------------------------------
  | Event live temps réel
  |--------------------------------------------------------------------------
  */

  const [liveEvent, setLiveEvent] =
    useState(event);

  /*
  |--------------------------------------------------------------------------
  | Modal réservation
  |--------------------------------------------------------------------------
  */

  const [showModal, setShowModal] =
    useState(false);

  /*
  |--------------------------------------------------------------------------
  | Auth utilisateur
  |--------------------------------------------------------------------------
  */

  const { isAuthenticated } =
    useAuth();

  /*
  |--------------------------------------------------------------------------
  | Sync event API -> state live
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    if (event) {

      setLiveEvent(event);
    }

  }, [event]);

  /*
  |--------------------------------------------------------------------------
  | WebSocket Reverb
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    if (!id) return;

    echo.channel("events")

      .listen(
        ".EventReservationUpdated",
        (e: any) => {

          console.log(
            "Event updated:",
            e
          );

          if (
            e.eventData.id === Number(id)
          ) {

             setLiveEvent((prev: any) => ({
            ...prev,
            ...e.eventData
           }));
          }
        }
      );

    return () => {

      echo.leave("events");
    };

  }, [id]);

  /*
  |--------------------------------------------------------------------------
  | Format date
  |--------------------------------------------------------------------------
  */

  const formatDate = (
    dateString: string
  ) => {

    return new Date(
      dateString
    ).toLocaleDateString(
      "fr-FR",
      {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    );
  };

  /*
  |--------------------------------------------------------------------------
  | Format heure
  |--------------------------------------------------------------------------
  */

  const formatTime = (
    timeString: string | null
  ) => {

    if (!timeString) return "";

    return timeString.substring(0, 5);
  };

  /*
  |--------------------------------------------------------------------------
  | Loading
  |--------------------------------------------------------------------------
  */

  if (loading) {

    return <Spinner fullScreen />;
  }

  /*
  |--------------------------------------------------------------------------
  | Event not found
  |--------------------------------------------------------------------------
  */

  if (notFound) {

    return (

      <div className="min-h-screen bg-white flex items-center justify-center px-4">

        <div className="text-center max-w-md">

          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">

            <AlertCircle
              size={32}
              className="text-blue-700"
            />

          </div>

          <h1 className="text-2xl font-semibold text-gray-900 mb-2">

            Événement introuvable

          </h1>

          <p className="text-gray-600 mb-6">

            L'événement que vous cherchez n'existe pas ou a été supprimé.

          </p>

          <Link
            to="/events"
            className="inline-flex items-center space-x-2 bg-blue-950 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >

            <ArrowLeft size={18} />

            <span>
              Retour aux événements
            </span>

          </Link>

        </div>

      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Error
  |--------------------------------------------------------------------------
  */

  if (error) {

    return (

      <div className="min-h-screen bg-white flex items-center justify-center px-4">

        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md text-center">

          <p className="text-red-700 mb-4 font-medium">

            ❌ {error}

          </p>

          <button
            onClick={() => navigate(-1)}
            className="text-blue-950 hover:underline font-semibold"
          >

            Retour

          </button>

        </div>

      </div>
    );
  }

  if (!liveEvent) return null;

  /*
  |--------------------------------------------------------------------------
  | Photo principale
  |--------------------------------------------------------------------------
  */

  const photoUrl =

    liveEvent.photos &&
    liveEvent.photos.length > 0

      ? getImageUrl(
          liveEvent.photos[0].image_path
        )

      : null;

  return (

    <div className="min-h-screen bg-white">

      {/* HERO */}

      <section className="relative">

        {photoUrl ? (

          <div className="relative h-[400px] md:h-[500px] overflow-hidden">

            <img
              src={photoUrl}
              alt={liveEvent.nom}
              className="w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-blue-950/95 via-blue-950/40 to-transparent"></div>

            {/* Retour */}

            <div className="absolute top-6 left-6">

              <Link
                to="/events"
                className="inline-flex items-center space-x-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-white/20"
              >

                <ArrowLeft size={16} />

                <span>Retour</span>

              </Link>

            </div>

            {/* Titre */}

            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">

              <div className="max-w-5xl mx-auto">

                {liveEvent.categories &&
                  liveEvent.categories.length > 0 && (

                  <div className="flex flex-wrap gap-2 mb-3">

                    {liveEvent.categories.map(
                      (cat) => (

                        <span
                          key={cat.id}
                          className="bg-white/15 backdrop-blur-sm border border-white/20 text-white px-3 py-1 rounded-full text-xs font-semibold"
                        >

                          {cat.nom}

                        </span>
                      )
                    )}

                  </div>
                )}

                <h1 className="text-3xl md:text-5xl lg:text-6xl font-light text-white leading-tight">

                  {liveEvent.nom}

                </h1>

              </div>

            </div>

          </div>

        ) : (

          <div className="bg-blue-950 py-16 md:py-24 px-6">

            <div className="max-w-5xl mx-auto">

              <Link
                to="/events"
                className="inline-flex items-center space-x-2 text-white/80 hover:text-white text-sm font-medium mb-6 transition-colors"
              >

                <ArrowLeft size={16} />

                <span>Retour</span>

              </Link>

              <h1 className="text-3xl md:text-5xl lg:text-6xl font-light text-white leading-tight">

                {liveEvent.nom}

              </h1>

            </div>

          </div>
        )}
      </section>

      {/* DETAILS */}

      <section className="max-w-5xl mx-auto px-6 py-12 lg:py-16">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* DESCRIPTION */}

          <div className="lg:col-span-2">

            <h2 className="text-xs uppercase tracking-wider text-blue-700 font-semibold mb-3">

              À propos de cet événement

            </h2>

            <p className="text-gray-700 text-base leading-relaxed whitespace-pre-line">

              {liveEvent.description}

            </p>

            {liveEvent.pour_enfant && (

              <div className="mt-6 inline-flex items-center space-x-2 bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-lg">

                <Baby size={18} />

                <span className="font-medium">

                  Cet événement est adapté aux enfants

                </span>

              </div>
            )}
          </div>

          {/* SIDEBAR */}

          <div className="lg:col-span-1">

            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 lg:sticky lg:top-24">

              <h2 className="text-xs uppercase tracking-wider text-blue-700 font-semibold mb-4">

                Informations pratiques

              </h2>

              <div className="space-y-4">

                {/* Date */}

                <div className="flex items-start space-x-3">

                  <div className="w-9 h-9 bg-blue-950 rounded-lg flex items-center justify-center flex-shrink-0">

                    <Calendar
                      size={18}
                      className="text-white"
                    />

                  </div>

                  <div>

                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-0.5">

                      Date

                    </p>

                    <p className="text-sm text-gray-900 font-medium capitalize">

                      {formatDate(
                        liveEvent.date
                      )}

                    </p>

                  </div>

                </div>

                {/* Places */}

                <div className="flex items-start space-x-3">

                  <div className="w-9 h-9 bg-blue-950 rounded-lg flex items-center justify-center flex-shrink-0">

                    <Users
                      size={18}
                      className="text-white"
                    />

                  </div>

                  <div>

                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-0.5">

                      Places restantes

                    </p>

                    <p className="text-sm text-gray-900 font-medium">

                      {liveEvent.places_restantes}

                    </p>

                  </div>

                </div>
              </div>

              {/* BTN */}

              {isAuthenticated ? (

                liveEvent.places_restantes > 0 ? (

                  <button
                    type="button"
                    onClick={() => setShowModal(true)}
                    className="mt-6 w-full bg-blue-950 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors shadow-md hover:shadow-lg"
                  >

                    S'inscrire à l'événement

                  </button>

                ) : (

                  <div className="mt-6 w-full bg-red-100 text-red-700 py-3 rounded-lg font-semibold text-center">

                    Événement complet

                  </div>
                )

              ) : (

                <div className="mt-6 space-y-3">

                  <Link
                    to="/login"
                    state={{
                      from: `/events/${liveEvent.id}`
                    }}
                    className="w-full bg-blue-950 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
                  >

                    <LogIn size={18} />

                    <span>
                      Se connecter
                    </span>

                  </Link>

                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* MODAL */}

      {showModal && (

        <ReservationModal
          event={liveEvent}
          onClose={() =>
            setShowModal(false)
          }
        />
      )}
    </div>
  );
}

export default EventDetail;