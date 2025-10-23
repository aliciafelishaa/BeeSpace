import { db } from "@/config/firebaseConfig";
import { Message } from "@/types/directmessage/dm";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
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

// Bales chat
export const sendMessage = async (
  chatId: string,
  text: string,
  senderId: string
) => {
  if (!text.trim()) return;

  const newMsg = {
    text: text.trim(),
    senderId,
    read: false,
    type: "text",
    status: "sent",
    createdAt: serverTimestamp(),
  };

  await addDoc(collection(db, "chats", chatId, "messages"), newMsg);
};
