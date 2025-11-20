import { db } from "@/config/firebaseConfig";
import { Message } from "@/types/directmessage/dm";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

// Dapat chat
export const listenMessages = (
  chatId: string,
  onUpdate: (messages: Message[]) => void
) => {
  const q = query(
    collection(db, "chats", chatId, "messages"),
    orderBy("createdAt", "asc")
  );

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const messages: Message[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().createdAt?.toDate?.() || new Date(),
    })) as Message[];
    onUpdate(messages);
  });

  return unsubscribe;
};

// Group Chat
export const listenGroupMessages = (
  groupId: string,
  onUpdate: (messages: Message[]) => void
) => {
  const q = query(
    collection(db, "groupChats", groupId, "messages"),
    orderBy("createdAt", "asc")
  );

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const messages: Message[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().createdAt?.toDate?.() || new Date(),
    })) as Message[];
    onUpdate(messages);
  });

  return unsubscribe;
};

// Bales chat
export const sendMessage = async (
  chatId: string,
  text: string,
  senderId: string,
  type: "text" | "image" = "text",
  mediaUrl?: string
) => {
  if (!text.trim() && type === "text") return;

  const newMsg = {
    text: text.trim(),
    senderId,
    read: false,
    type: type,
    mediaUrl: mediaUrl || null,
    status: "sent" as const,
    readBy: [],
    createdAt: serverTimestamp(),
  };

  const docRef = await addDoc(
    collection(db, "chats", chatId, "messages"),
    newMsg
  );

  await updateChatLastMessage(chatId, {
    id: docRef.id,
    ...newMsg,
    timestamp: new Date(),
  } as Message);
};

// Bales group chat
export const sendGroupMessage = async (
  groupId: string,
  text: string,
  senderId: string,
  senderName: string,
  type: "text" | "image" = "text",
  mediaUrl?: string
) => {
  if (!text.trim() && type === "text") return;

  const newMsg = {
    text: text.trim(),
    senderId,
    senderName,
    read: false,
    type: type,
    mediaUrl: mediaUrl || null,
    status: "sent" as const,
    readBy: [],
    createdAt: serverTimestamp(),
  };

  const docRef = await addDoc(
    collection(db, "groupChats", groupId, "messages"),
    newMsg
  );

  await updateGroupLastMessage(groupId, {
    id: docRef.id,
    ...newMsg,
    timestamp: new Date(),
  } as Message);
};

// Last Message
export const updateChatLastMessage = async (
  chatId: string,
  message: Message
) => {
  try {
    await updateDoc(doc(db, "chats", chatId), {
      lastMessage: {
        text: message.text,
        timestamp: serverTimestamp(),
        senderId: message.senderId,
        read: false,
        type: message.type,
        mediaUrl: message.mediaUrl,
      },
      lastUpdated: serverTimestamp(),
    });
  } catch (err) {
    console.error("Error:", err);
  }
};

// Last Group Message
export const updateGroupLastMessage = async (
  groupId: string,
  message: Message
) => {
  try {
    await updateDoc(doc(db, "groupChats", groupId), {
      lastMessage: {
        text: message.text,
        timestamp: serverTimestamp(),
        senderId: message.senderId,
        senderName: message.senderName,
        read: false,
        type: message.type,
        mediaUrl: message.mediaUrl,
      },
      lastUpdated: serverTimestamp(),
    });
  } catch (err) {
    console.error("Error:", err);
  }
};
