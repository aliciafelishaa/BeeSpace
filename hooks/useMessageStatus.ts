import { auth, db } from "@/config/firebaseConfig";
import {
  arrayUnion,
  doc,
  getDoc,
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

  const markAsDelivered = useCallback(
    async (messageIds: string[]) => {
      if (!chatId || !messageIds.length || !currentUserId) return;

      try {
        const updates = messageIds.map(async (messageId) => {
          const messageRef = doc(
            db,
            isGroupChat ? "groupChats" : "chats",
            chatId,
            "messages",
            messageId
          );

          const messageDoc = await getDoc(messageRef);
          if (!messageDoc.exists() || messageDoc.data().status !== "sent")
            return null;

          return updateDoc(messageRef, {
            status: "delivered",
            deliveredAt: serverTimestamp(),
          });
        });

        await Promise.all(updates.filter((update) => update !== null));
      } catch (err) {
        console.error(err);
      }
    },
    [chatId, isGroupChat, currentUserId]
  );

  const markAsRead = useCallback(
    async (messageIds: string[]) => {
      if (!chatId || !currentUserId || !messageIds.length) {
        return;
      }

      const getMessageRef = (messageId: string) => {
        const collectionPath = isGroupChat ? "groupChats" : "chats";
        return doc(db, collectionPath, chatId, "messages", messageId);
      };

      try {
        for (const messageId of messageIds) {
          const messageRef = getMessageRef(messageId);

          const messageDoc = await getDoc(messageRef);
          if (!messageDoc.exists()) continue;

          const messageData = messageDoc.data();

          if (isGroupChat) {
            const currentReadBy = messageData.readBy || [];

            if (!currentReadBy.includes(currentUserId)) {
              await updateDoc(messageRef, {
                readBy: arrayUnion(currentUserId),
              });
            }
          } else {
            if (
              messageData.status === "delivered" ||
              messageData.status === "sent"
            ) {
              await updateDoc(messageRef, {
                status: "read",
                readBy: arrayUnion(currentUserId),
                readAt: serverTimestamp(),
              });
            }
          }
        }
      } catch (err) {
        console.error(err);
      }
    },
    [chatId, isGroupChat, currentUserId, groupMembers]
  );

  return {
    markAsDelivered,
    markAsRead,
  };
};
