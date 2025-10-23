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
