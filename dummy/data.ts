import { Chat, User } from "@/types/directmessage/dm";

export const currentUser: User = {
  id: "current-user",
  name: "You",
};

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
    unreadCount: 0,
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
      read: false,
      type: "text",
      status: "read",
    },
    unreadCount: 1,
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
        status: "delivered" as const,
      },
      {
        id: "202",
        text: "hil my name is tasya. ntmy tool",
        timestamp: new Date("2025-10-05T10:03:00"),
        senderId: "current-user",
        read: true,
        type: "text" as const,
        status: "read" as const,
      },
      {
        id: "203",
        text: "Alis Cantik",
        timestamp: new Date("2025-10-05T10:14:00"),
        senderId: "3",
        read: true,
        type: "text" as const,
        status: "delivered" as const,
      },
      {
        id: "204",
        text: "wkwk, cuman galak",
        timestamp: new Date("2025-10-05T10:16:00"),
        senderId: "current-user",
        read: false,
        type: "text" as const,
        status: "delivered" as const,
      },
    ];
  }

  return [];
};
