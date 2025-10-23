export interface User {
  id: string;
  name: string;
  avatar?: string;
  email?: string;
  username?: string;
}

export interface Message {
  id: string;
  text: string;
  timestamp: Date | any;
  senderId: string;
  read: boolean;
  type: "text" | "image";
  mediaUrl?: string;
  fileName?: string;
  fileSize?: number;
  replyTo?: string;
  status?: "sent" | "delivered" | "read";
  senderName?: string;
}

export interface Chat {
  id: string;
  userId: string;
  lastMessage: Message;
  unreadCount: number;
  user?: User;
  isGroupChat?: boolean;
  groupData?: {
    name: string;
    memberUids: string[];
    roomId: string;
    profilePicture?: string; 
    cover?: string;
    description?: string;
  };
}

export type FilterType = "all" | "not-read" | "newest" | "oldest";

export interface SearchFilters {
  query: string;
  category: FilterType;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export interface GroupChatDocument {
  name: string;
  memberUids: string[];
  adminUids: string[];
  roomId: string;
  profilePicture?: string;
  cover?: string;
  description?: string;
  lastMessage?: {
    text: string;
    timestamp: any;
    senderId: string;
    senderName?: string;
    read: boolean;
    type: "text" | "image";
  };
  lastUpdated: any;
  unreadCount: {
    [userId: string]: number;
  };
  createdAt: any;
}
