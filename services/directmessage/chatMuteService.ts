import { db } from "@/config/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export const muteChat = async (
  chatId: string,
  userId: string
): Promise<boolean> => {
  try {
    const isGroupChat = chatId.startsWith("group_");
    const collectionName = isGroupChat ? "groupChats" : "chats";

    const chatRef = doc(db, collectionName, chatId);
    const chatDoc = await getDoc(chatRef);

    const currentData = chatDoc.data();
    const currentMuteStatus =
      currentData?.muteSettings?.[userId]?.muted || false;
    const newMuteStatus = !currentMuteStatus;

    await updateDoc(chatRef, {
      [`muteSettings.${userId}`]: {
        muted: newMuteStatus,
        mutedAt: newMuteStatus ? new Date() : null,
      },
    });

    return newMuteStatus;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const getChatMuteStatus = async (chatId: string, userId: string) => {
  try {
    const isGroupChat = chatId.startsWith("group_");
    const collectionName = isGroupChat ? "groupChats" : "chats";

    const chatDoc = await getDoc(doc(db, collectionName, chatId));
    if (!chatDoc.exists()) {
      return { muted: false };
    }

    const data = chatDoc.data();
    return data?.muteSettings?.[userId] || { muted: false };
  } catch (err) {
    console.error(err);
    return { muted: false };
  }
};
