import { NotificationItem, NotificationType } from "@/types/notifications/notification";

export const mockNotifications: NotificationItem[] = [
  { 
    id: "1", 
    title: "Plan Created", 
    body: "Invite your friends to join your plan.", 
    timestamp: new Date(), 
    read: false, 
    type: "plan_created" as NotificationType 
  },
  { 
    id: "2", 
    title: "New Message", 
    body: "From Alice. Check it out!", 
    timestamp: new Date(), 
    read: false, 
    type: "new_message" as NotificationType, 
    senderName: "Alice" 
  },
  { 
    id: "3", 
    title: "Plan starts soon", 
    body: "Your plan will start in 30 minutes.", 
    timestamp: new Date(), 
    read: true, 
    type: "plan_start" as NotificationType 
  },
  { 
    id: "4", 
    title: "Friend Request", 
    body: "John wants to be your friend.", 
    timestamp: new Date(Date.now() - 3600000), 
    read: false, 
    type: "friend_request" as NotificationType,
    senderName: "John"
  },
  { 
    id: "5", 
    title: "Plan Completed", 
    body: "Your beach trip plan is completed!", 
    timestamp: new Date(Date.now() - 86400000), 
    read: true, 
    type: "plan_completed" as NotificationType 
  },
];