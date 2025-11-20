import { auth, db } from "@/config/firebaseConfig";
import {
  arrayUnion,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { useCallback } from "react";

interface UseMessageStatusProps {
  chatId: string | null;
  isGroupChat: boolean;
  groupMembers?: string[];
}

export const useMessageStatus = ({
  chatId,
  isGroupChat,
  groupMembers = [],
}: UseMessageStatusProps) => {
  const currentUserId = auth.currentUser?.uid;

  const getMessageRef = (messageId: string) => {
    const collectionPath = isGroupChat ? "groupChats" : "chats";
    return doc(db, collectionPath, chatId!, "messages", messageId);
  };

  const markAsDelivered = useCallback(
    async (messageIds: string[]) => {
      if (!chatId || !messageIds.length) return;

      try {
        for (const messageId of messageIds) {
          const messageRef = getMessageRef(messageId);
          await updateDoc(messageRef, {
            status: "delivered",
            deliveredAt: serverTimestamp(),
          });
        }
      } catch (err) {
        console.log(err);
      }
    },
    [chatId, isGroupChat]
  );

  const markAsRead = useCallback(
    async (messageIds: string[]) => {
      if (!chatId || !currentUserId || !messageIds.length) return;

      try {
        for (const messageId of messageIds) {
          const messageRef = getMessageRef(messageId);

          if (isGroupChat) {
            await updateDoc(messageRef, {
              readBy: arrayUnion(currentUserId),
            });
          } else {
            await updateDoc(messageRef, {
              status: "read",
              readBy: arrayUnion(currentUserId),
              readAt: serverTimestamp(),
            });
          }
        }
      } catch (err) {
        console.log(err);
      }
    },
    [chatId, isGroupChat, currentUserId]
  );

  return {
    markAsDelivered,
    markAsRead,
  };
};
