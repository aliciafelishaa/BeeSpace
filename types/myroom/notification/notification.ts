import { RoomEntry } from "@/types/myroom/room";

export interface Room extends RoomEntry {
  id: string;
  notificationSent30min?: boolean;
  notificationSent15min?: boolean;
  notificationSent5min?: boolean;
  muteSettings?: {
    [userId: string]: {
      muted: boolean;
    };
  };
}

export interface RoomNotificationData {
  roomId: string;
  roomName: string;
  startTime: Date;
  type: "room_starting_soon";
}
