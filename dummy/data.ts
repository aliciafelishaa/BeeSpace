import { Chat, User } from "@/types/directmessage/dm";

export const currentUser: User = {
  id: "current-user",
  name: "You",
};

// data.ts
export const mockChats: Chat[] = [
  {
    id: "1",
    user: {
      id: "2",
      name: "Bianca",
      avatar:
        "https://ui-avatars.com/api/?name=Bianca&background=3B82F6&color=white&size=150",
    },
    lastMessage: {
      id: "101",
      text: "Halo kak",
      timestamp: new Date("2025-10-05T10:03:00"),
      senderId: "2",
      read: true,
      type: "text",
      status: "delivered",
    },
    unreadCount: 1,
  },
  {
    id: "2",
    user: {
      id: "3",
      name: "Alicia Felisha",
      avatar:
        "https://ui-avatars.com/api/?name=Alicia&background=8B5CF6&color=white&size=150",
    },
    lastMessage: {
      id: "102",
      text: "Yuk Join",
      timestamp: new Date("2025-10-05T10:03:00"),
      senderId: "3",
      read: true,
      type: "text",
      status: "read",
    },
    unreadCount: 0,
  },
  {
    id: "3",
    user: {
      id: "4",
      name: "Ardell Gultom",
      avatar:
        "https://ui-avatars.com/api/?name=Ardell&background=10B981&color=white&size=150",
    },
    lastMessage: {
      id: "103",
      text: "Oke kak",
      timestamp: new Date("2025-10-05T10:03:00"),
      senderId: "4",
      read: true,
      type: "text",
      status: "read",
    },
    unreadCount: 0,
  },
];

export const getMockMessages = (chatId: string) => {
  if (chatId === "2") {
    return [
      {
        id: "201",
        text: "Hil Nice To Meet You. My Name is Alicia",
        timestamp: new Date("2025-10-05T10:02:00"),
        senderId: "3",
        read: true,
        type: "text" as const,
        status: "read" as const,
      },
    ];
  }

  return [];
};
