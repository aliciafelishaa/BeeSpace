import * as admin from "firebase-admin";
import { onSchedule } from "firebase-functions/v2/scheduler";
import { checkUpcomingRooms } from "../utils/roomNotifier";

admin.initializeApp();

export const checkRoomNotifications = onSchedule(
  {
    schedule: "every 5 minutes",
    timeoutSeconds: 540,
  },
  async (event) => {
    try {
      await checkUpcomingRooms();
    } catch (err) {
      console.error("Room Notification Error:", err);
    }
  }
);
