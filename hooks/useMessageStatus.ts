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
      if (!chatId || !messageIds.length) return;

      const getMessageRef = (messageId: string) => {
        const collectionPath = isGroupChat ? "groupChats" : "chats";
        return doc(db, collectionPath, chatId!, "messages", messageId);
      };

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

      const getMessageRef = (messageId: string) => {
        const collectionPath = isGroupChat ? "groupChats" : "chats";
        return doc(db, collectionPath, chatId!, "messages", messageId);
      };

      try {
        for (const messageId of messageIds) {
          const messageRef = getMessageRef(messageId);

          if (isGroupChat) {
            await updateDoc(messageRef, {
              readBy: arrayUnion(currentUserId),
            });

            const messageDoc = await getDoc(messageRef);
            if (messageDoc.exists()) {
              const messageData = messageDoc.data();
              const currentReadBy = messageData.readBy || [];
              const allMembers = groupMembers;

              const allMembersRead = allMembers.every((member) =>
                currentReadBy.includes(member)
              );

              if (allMembersRead) {
                await updateDoc(messageRef, {
                  status: "read",
                });
              }
            }
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
    [chatId, isGroupChat, currentUserId, groupMembers]
  );

  return {
    markAsDelivered,
    markAsRead,
  };
};
