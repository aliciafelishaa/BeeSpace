export type NotificationFilter =
  | "all"
  | "unread";

export type NotificationType = "plan_created" | "new_message" | "plan_start" | "plan_cancelled";

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  timestamp: Date;
  read: boolean;
  type: NotificationType;

  icon?: string;
  senderName?: string;
  linkTarget?: string;
}
