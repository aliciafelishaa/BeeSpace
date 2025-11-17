import { Expo } from "expo-server-sdk";
import * as admin from "firebase-admin";

const expo = new Expo();

const REMINDER_INTERVALS = [
  {
    minutes: 30,
    sentField: "notificationSent30min",
    body: "will start in 30 minutes...",
  },
  {
    minutes: 15,
    sentField: "notificationSent15min",
    body: "will start in 15 minutes...",
  },
  {
    minutes: 5,
    sentField: "notificationSent5min",
    body: "will start in 5 minutes...",
  },
];

const sendRoomNotificationsToParticipants = async (
  room: any,
  roomId: string,
  bodyText: string
) => {
  const db = admin.firestore();
  const participants = room.joinedUids || [];

  for (const participantId of participants) {
    try {
      const isMuted = room.muteSettings?.[participantId]?.muted || false;
      if (isMuted) continue;

      const userDoc = await db.collection("users").doc(participantId).get();
      if (!userDoc.exists) continue;

      const userData = userDoc.data();
      const notificationTokens = userData?.notificationTokens || [];
      if (notificationTokens.length === 0) continue;

      await sendPushNotification(notificationTokens, room, roomId, bodyText);
    } catch (err) {
      console.error(err);
    }
  }
};

const sendPushNotification = async (
  tokens: string[],
  room: any,
  roomId: string,
  bodyText: string
) => {
  const messages = [];

  for (const token of tokens) {
    if (!Expo.isExpoPushToken(token)) continue;

    messages.push({
      to: token,
      sound: "default",
      title: "Room Starting Soon! 🚀",
      body: `${room.planName} ${bodyText}`,
      data: {
        roomId,
        roomName: room.planName,
        startTime: room.date.toDate().toISOString(),
        type: "room_starting_soon",
      },
    });
  }

  if (messages.length > 0) {
    const chunks = expo.chunkPushNotifications(messages);

    for (const chunk of chunks) {
      try {
        await expo.sendPushNotificationsAsync(chunk);
      } catch (err) {
        console.error(err);
      }
    }
  }
};

export const checkUpcomingRooms = async () => {
  const now = new Date();
  const db = admin.firestore();

  for (const interval of REMINDER_INTERVALS) {
    const targetTime = new Date(now.getTime() + interval.minutes * 60 * 1000);

    const roomsSnapshot = await db
      .collection("rooms")
      .where("date", ">=", now)
      .where("date", "<=", targetTime)
      .where(interval.sentField, "==", false)
      .get();

    for (const roomDoc of roomsSnapshot.docs) {
      const room = roomDoc.data();
      const roomId = roomDoc.id;

      try {
        await sendRoomNotificationsToParticipants(room, roomId, interval.body);

        await db
          .collection("rooms")
          .doc(roomId)
          .update({
            [interval.sentField]: true,
          });
      } catch (err) {
        console.error(err);
      }
    }
  }
};
