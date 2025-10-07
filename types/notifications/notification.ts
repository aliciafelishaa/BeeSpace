export type NotificationFilter =
  | "all"
  | "unread";

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  timestamp: Date;
  read: boolean;
  type: NotificationFilter;
}
