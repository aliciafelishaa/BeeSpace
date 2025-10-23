import { db } from "@/config/firebaseConfig";
import { Chat, Message } from "@/types/directmessage/dm";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

export const listenUserChats = (
  userId: string,
  onUpdate: (chats: Chat[]) => void
) => {
  // Search DB
  const q = query(
    collection(db, "chats"),
    where("participants", "array-contains", userId),
    orderBy("lastUpdated", "desc")
  );

  const unsubscribe = onSnapshot(q, async (snapshot) => {
    const chats: Chat[] = [];

    for (const docSnap of snapshot.docs) {
      const data = docSnap.data();
      const participants = data.participants || [];
      const otherUserId = participants.find((id: string) => id !== userId);

      //  Dapetin user
      if (otherUserId) {
        try {
          const userDoc = await getDoc(doc(db, "users", otherUserId));
          const userData = userDoc.exists() ? userDoc.data() : null;

          const lastMessageText = data.lastMessage?.text
            ? data.lastMessage.text
            : "";

          chats.push({
            id: docSnap.id,
            userId: otherUserId,
            user: userData
              ? {
                  id: otherUserId,
                  name: userData.fullName || "Unknown User",
                  avatar: userData.avatar || null,
                }
              : undefined,
            lastMessage: {
              id: data.lastMessage?.id || "",
              text: lastMessageText,
              timestamp: data.lastMessage?.timestamp || new Date(),
              senderId: data.lastMessage?.senderId || "",
              read: data.lastMessage?.read || true,
              type: data.lastMessage?.type || "text",
            },
            unreadCount: data.unreadCount?.[userId] || 0,
            isGroupChat: false,
          });
        } catch (err) {
          console.error("Error:", err);
        }
      }
    }
    onUpdate(chats);
  });

  return unsubscribe;
};

// Chat
export const createChat = async (
  currentUserId: string,
  otherUserId: string
) => {
  const chatsRef = collection(db, "chats");

  const newChat = {
    participants: [currentUserId, otherUserId],
    lastMessage: {
      text: "",
      timestamp: new Date(),
      senderId: currentUserId,
      read: false,
      type: "text",
    },
    lastUpdated: new Date(),
    unreadCount: {
      [currentUserId]: 0,
      [otherUserId]: 0,
    },
  };

  const docRef = await addDoc(chatsRef, newChat);
  return docRef.id;
};

export const updateChatLastMessage = async (
  chatId: string,
  message: Partial<Message>
) => {
  const chatRef = doc(db, "chats", chatId);

  await updateDoc(chatRef, {
    lastMessage: {
      ...message,
      text: message.text || "",
    },
    lastUpdated: new Date(),
  });
};

export const checkExistingChat = async (
  user1Id: string,
  user2Id: string
): Promise<string | null> => {
  try {
    const q = query(
      collection(db, "chats"),
      where("participants", "array-contains", user1Id)
    );

    const snapshot = await getDocs(q);

    for (const docSnap of snapshot.docs) {
      const data = docSnap.data();
      const participants = data.participants || [];

      if (participants.includes(user2Id) && participants.includes(user1Id)) {
        return docSnap.id;
      }
    }
    return null;
  } catch (err) {
    console.error("Error:", err);
    return null;
  }
};

export const initiateChat = async (
  currentUserId: string,
  otherUserId: string
): Promise<string> => {
  const existingChatId = await checkExistingChat(currentUserId, otherUserId);

  if (existingChatId) {
    return existingChatId;
  }

  return await createChat(currentUserId, otherUserId);
};

// GROUP CHATS
export const listenUserGroupChats = (
  userId: string,
  callback: (chats: Chat[]) => void
): (() => void) => {
  console.log("🔍 [listenUserGroupChats] Starting for user:", userId);

  // ✅ KONSISTEN PAKAI createdAt
  const q = query(
    collection(db, "groupChats"),
    where("memberUids", "array-contains", userId),
    orderBy("createdAt", "desc")
  );

  const unsubscribe = onSnapshot(
    q,
    (querySnapshot) => {
      console.log(
        "📦 [listenUserGroupChats] Docs found:",
        querySnapshot.docs.length
      );

      const chats: Chat[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        console.log("📄 Group found:", data.name);

        chats.push({
          id: doc.id,
          userId: data.hostUid,
          lastMessage: {
            id: "",
            text: data.lastMessage || "Group created",
            timestamp: data.createdAt?.toDate?.() || new Date(), // ✅ PAKAI createdAt
            senderId: data.hostUid || "",
            read: true,
            type: "text",
          },
          unreadCount: 0,
          isGroupChat: true,
          groupData: {
            name: data.name,
            memberUids: data.memberUids || [],
            roomId: data.roomId,
          },
        });
      });

      callback(chats);
    },
    (error) => {
      console.error("❌ [listenUserGroupChats] Error:", error);
      // Error ini akan kasih tau link untuk buat index
    }
  );

  return unsubscribe;
};
export const listenAllUserChats = (
  userId: string,
  callback: (chats: Chat[]) => void
): (() => void) => {
  console.log("🎯 [listenAllUserChats] STARTED for user:", userId);

  let privateChats: Chat[] = [];
  let groupChats: Chat[] = [];

  const onCombinedUpdate = () => {
    const allChats = [...privateChats, ...groupChats];
    allChats.sort(
      (a, b) =>
        new Date(b.lastMessage.timestamp).getTime() -
        new Date(a.lastMessage.timestamp).getTime()
    );

    console.log("🔄 [listenAllUserChats] COMBINED UPDATE:", {
      private: privateChats.length,
      group: groupChats.length,
      total: allChats.length,
    });

    callback(allChats);
  };

  console.log("🔸 [listenAllUserChats] Setting up private chat listener...");
  const unsubscribePrivate = listenUserChats(userId, (chats) => {
    console.log("💬 [listenAllUserChats] PRIVATE update:", chats.length);
    privateChats = chats;
    onCombinedUpdate();
  });

  console.log("🔸 [listenAllUserChats] Setting up group chat listener...");
  const unsubscribeGroup = listenUserGroupChats(userId, (chats) => {
    console.log("👥 [listenAllUserChats] GROUP update:", chats.length);
    groupChats = chats;
    onCombinedUpdate();
  });

  return () => {
    console.log("🛑 [listenAllUserChats] CLEANUP");
    unsubscribePrivate();
    unsubscribeGroup();
  };
};
