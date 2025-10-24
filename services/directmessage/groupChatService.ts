import { db } from "@/config/firebaseConfig";
import {
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";

export interface GroupChat {
  id: string;
  roomId: string;
  name: string;
  hostUid: string;
  memberUids: string[];
  createdAt: Date;
  lastMessage?: string;
  lastMessageTime?: Date;
  createdBy?: string;
}

export const initiateGroupChat = async (
  roomId: string,
  hostUid: string,
  roomName: string,
  initiatorUid?: string
): Promise<string> => {
  try {
    const chatId = `group_${roomId}`;

    const initialMembers: string[] = [hostUid];
    if (initiatorUid && initiatorUid !== hostUid) {
      initialMembers.push(initiatorUid);
    }

    const groupChat: GroupChat = {
      id: chatId,
      roomId: roomId,
      name: roomName,
      hostUid: hostUid,
      memberUids: initialMembers,
      createdAt: new Date(),
      createdBy: initiatorUid || hostUid,
    };

    await setDoc(doc(db, "groupChats", chatId), groupChat);
    return chatId;
  } catch (err) {
    console.error("Error:", err);
    throw new Error("Failed to create group chat");
  }
};

export const joinGroupChat = async (
  chatId: string,
  userId: string
): Promise<boolean> => {
  try {
    const chatRef = doc(db, "groupChats", chatId);
    await updateDoc(chatRef, {
      memberUids: arrayUnion(userId),
    });
    return true;
  } catch (err) {
    console.error("Error:", err);
    return false;
  }
};

export const getGroupChat = async (
  chatId: string
): Promise<GroupChat | null> => {
  try {
    const chatDoc = await getDoc(doc(db, "groupChats", chatId));
    if (chatDoc.exists()) {
      return chatDoc.data() as GroupChat;
    }
    return null;
  } catch (err) {
    console.error("Error:", err);
    return null;
  }
};

export const leaveGroupChat = async (
  chatId: string,
  userId: string
): Promise<boolean> => {
  try {
    const chatRef = doc(db, "groupChats", chatId);

    await updateDoc(chatRef, {
      memberUids: arrayRemove(userId),
    });

    return true;
  } catch (err) {
    console.error("Error:", err);
    return false;
  }
};
