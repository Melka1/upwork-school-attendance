import cron from "node-cron";
import httpRequest from "./httpRequest";
import moment from "moment-timezone";

async function callInitializeAttendance(retries = 5, delay = 5000) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await httpRequest(
        `${process.env.NEXT_PUBLIC_FULL_API_URL}/attendance/initialize`,
        {
          method: "POST",
        }
      );

      if (response.status !== 200) {
        throw new Error("Failed to initialize attendance.");
      }

      console.log("Daily attendance initialized successfully.");
    } catch (error) {
      console.error(`Attempt ${i + 1} failed:`, error);

      if (i === retries - 1) {
        console.error("All retries failed. Giving up.");
        await httpRequest(
          `${process.env.NEXT_PUBLIC_FULL_API_URL}/notification/initialize`,
          {
            method: "POST",
            body: {
              title:
                "Initialization of daily attendance failed, start it manually",
            },
          }
        );
        throw error;
      }

      const waitTime = delay * Math.pow(2, i);
      console.log(`Retrying in ${waitTime}ms...`);
      await new Promise((resolve) => setTimeout(resolve, waitTime));
    }
  }
}

export function startScheduler() {
  cron.schedule(
    "0 0 * * *",
    () => {
      console.log("Running daily attendance initialization...");
      const now = moment().tz("Europe/Berlin");
      callInitializeAttendance();
    },
    {
      timezone: "Europe/Berlin",
    }
  );
}
