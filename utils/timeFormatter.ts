import { Message } from "@/types/directmessage/dm";

const convertToDate = (timestamp: Date | any): Date => {
  if (timestamp instanceof Date) {
    return timestamp;
  }
  
  if (timestamp && typeof timestamp.toDate === 'function') {
    return timestamp.toDate();
  }
  
  if (typeof timestamp === 'number') {
    return new Date(timestamp);
  }
  
  if (typeof timestamp === 'string') {
    return new Date(timestamp);
  }
  
  return new Date(timestamp);
};

export const formatDateSeparator = (timestamp: Date | any): string => {
  const messageDate = convertToDate(timestamp);
  const now = new Date();
  
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const messageDay = new Date(messageDate.getFullYear(), messageDate.getMonth(), messageDate.getDate());
  
  const diffTime = today.getTime() - messageDay.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return "Today";
  } else if (diffDays === 1) {
    return "Yesterday";
  } else if (diffDays > 1 && diffDays <= 6) {
    return `${diffDays} days ago`;
  } else if (diffDays === 7) {
    return "1 week ago";
  } else {
    return messageDate.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }
};

export const shouldShowDateSeparator = (
  currentMessage: Message, 
  previousMessage: Message | null
): boolean => {
  if (!previousMessage) return true;
  
  const currentDate = convertToDate(currentMessage.timestamp);
  const previousDate = convertToDate(previousMessage.timestamp);
  
  const currentDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
  const previousDay = new Date(previousDate.getFullYear(), previousDate.getMonth(), previousDate.getDate());
  
  return currentDay.getTime() !== previousDay.getTime();
};

export const formatMessageTime = (timestamp: Date | any): string => {
  const date = convertToDate(timestamp);
  return date.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
};