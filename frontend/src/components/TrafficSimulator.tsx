import { useEffect } from "react";
import { API_URL } from "../config/api";

function TrafficSimulator() {

  useEffect(() => {

    const actions = [

      "view_event",

      "search_category",

      "click_event",

      "start_reservation",
    ];

    const interval = setInterval(async () => {

      try {

        const randomEvent =
          Math.floor(Math.random() * 30) + 1;

        const randomAction =
          actions[
            Math.floor(Math.random() * actions.length)
          ];

        await fetch(`${API_URL}/api/activity`, {

          method: "POST",

          credentials: "include",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({

            action: randomAction,

            entity_type: "event",

            entity_id: randomEvent,

            metadata: {

              source: "simulator",

              timestamp: new Date(),
            },
          }),
        });

        console.log(
          "activité simulée :",
          randomAction
        );

      } catch (error) {

        console.error(error);
      }

    }, 3000);

    return () => clearInterval(interval);

  }, []);

  return null;
}

export default TrafficSimulator;