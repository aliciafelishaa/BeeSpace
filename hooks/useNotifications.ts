import { useAuth } from "@/context/AuthContext";
import { NotificationService } from "@/services/notificationService";
import { updateUserNotificationToken } from "@/services/userService";
import * as Notifications from "expo-notifications";
import { useEffect, useRef } from "react";

export const useNotifications = () => {
  const { user } = useAuth();

  const notificationListener = useRef<Notifications.Subscription | null>(null);
  const responseListener = useRef<Notifications.Subscription | null>(null);

  useEffect(() => {
    const registerPushNotifications = async () => {
      try {
        const token =
          await NotificationService.registerForPushNotificationsAsync();

        if (token && user?.uid) {
          await updateUserNotificationToken(user.uid, token);
        }
      } catch (err) {
        console.error(err);
      }
    };

    registerPushNotifications();

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log("Req Notification:", notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("Res Notifcation:", response);
        const data = response.notification.request.content.data;

        if (data.type === "room_starting_soon" && data.roomId) {
          console.log(data.roomId);
        }
      });

    return () => {
      if (notificationListener.current) {
        notificationListener.current.remove();
      }
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, [user]);

  return {
    getNotificationStatus: NotificationService.getNotificationStatus,
  };
};
