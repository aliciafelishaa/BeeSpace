import { db } from "@/config/firebaseConfig";
import { RoomEntry } from "@/types/myroom/room";
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { updateRoomStats } from "./userService";

export const createRoom = async (payload: RoomEntry) => {
  if (!payload.fromUid) {
    throw new Error("Missing user UID");
  }
  try {
    const roomData = {
      fromUid: payload.fromUid,
      cover: payload.cover,
      category: payload.category,
      date: payload.date,
      description: payload.description,
      enableChat: payload.enableChat,
      locationDetail: payload.locationDetail,
      maxMember: payload.maxMember,
      minMember: payload.minMember,
      openPublic: payload.openPublic,
      place: payload.place,
      planName: payload.planName,
      timeEnd: payload.timeEnd,
      timeStart: payload.timeStart,
      joinedUids: [],
      status: "active",
      userUniv: payload.userUniv,
    };

    console.log("payload:", roomData);
    const reqRef = await addDoc(collection(db, "roomEvents"), roomData);

    await updateRoomStats(payload.fromUid, {
      hostedRooms: 1,
      activeRooms: 1,
    });

    return { success: true, id: reqRef.id };
  } catch (err) {
    return { success: false, message: err };
  }
};
export const reportRoomApi = async (roomId: string) => {
  const res = await fetch(`https://myapp.local/rooms/${roomId}/report`, {
    method: "POST",
  });
  return res.json();
};

export const getAllRoom = async (uid: string) => {
  const roomcol = collection(db, "roomEvents");
  const snapshot = await getDocs(roomcol);

  return snapshot.docs.map((doc) => {
    const data = doc.data();

    return {
      id: doc.id,
      ...data,
      date: data.date instanceof Timestamp ? data.date.toDate() : data.date,
    } as RoomEntry & { id: string };
  });
};

export const getJoinedRooms = async (uid: string) => {
  try {
    const roomsCol = collection(db, "roomEvents");
    const q = query(roomsCol, where("joinedUids", "array-contains", uid));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        date: data.date instanceof Timestamp ? data.date.toDate() : data.date,
      } as RoomEntry & { id: string };
    });
  } catch (error) {
    console.error("Error getting joined rooms:", error);
    return [];
  }
};

export const getHostedRooms = async (uid: string) => {
  try {
    const roomsCol = collection(db, "roomEvents");
    const q = query(roomsCol, where("fromUid", "==", uid));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        date: data.date instanceof Timestamp ? data.date.toDate() : data.date,
      } as RoomEntry & { id: string };
    });
  } catch (error) {
    console.error("Error getting hosted rooms:", error);
    return [];
  }
};

export const getRoombyId = async (id: string, uid: string) => {
  try {
    const docRef = doc(db, "roomEvents", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return { success: false, message: "Room not found" };
    }

    const data = docSnap.data() as Partial<RoomEntry>;

    if (data.fromUid !== uid) {
      return { success: false, message: "Unauthorized access" };
    }

    const roomData: RoomEntry & { id: string } = {
      id: docSnap.id,
      fromUid: data.fromUid,
      cover: data.cover || "",
      category: data.category || "",
      date:
        data.date instanceof Timestamp
          ? data.date.toDate()
          : data.date || new Date(),
      description: data.description || "",
      enableChat: data.enableChat ?? false,
      locationDetail: data.locationDetail || "",
      maxMember: data.maxMember || "",
      minMember: data.minMember || "",
      openPublic: data.openPublic ?? false,
      place: data.place || "",
      planName: data.planName || "",
      timeEnd: data.timeEnd || "",
      timeStart: data.timeStart || "",
      userUniv: data.userUniv || "",
    };

    return roomData;
  } catch (error) {
    console.error("❌ Error fetching room by ID:", error);
    return { success: false, message: (error as Error).message };
  }
};

export const updateRoomService = async (
  id: string,
  updatedData: Partial<RoomEntry>,
  uid: string
) => {
  try {
    const docRef = doc(db, "roomEvents", id);

    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return { success: false, message: "Room not found" };
    }

    const data = docSnap.data() as RoomEntry;
    if (data.fromUid !== uid) {
      return { success: false, message: "Unauthorized access" };
    }

    await updateDoc(docRef, updatedData);
    return { success: true, message: "Room updated successfully" };
  } catch (error) {
    console.error("Error updating room:", error);
    return { success: false, message: "Failed to update room" };
  }
};

export const deleteRoomService = async (id: string, uid: string) => {
  try {
    const docRef = doc(db, "roomEvents", id);

    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return { success: false, message: "Room not found" };
    }

    const data = docSnap.data() as RoomEntry;
    if (data.fromUid !== uid) {
      return { success: false, message: "Unauthorized access" };
    }

    await deleteDoc(docRef);

    await updateRoomStats(uid, {
      hostedRooms: -1,
      activeRooms: -1,
    });

    return { success: true, message: "Room deleted successfully" };
  } catch (error) {
    console.error("Error deleting room:", error);
    return { success: false, message: "Failed to delete room" };
  }
};

export const joinRoom = async (
  roomId: string,
  userId: string
): Promise<boolean> => {
  try {
    const roomRef = doc(db, "roomEvents", roomId);

    const roomDoc = await getDoc(roomRef);
    if (!roomDoc.exists()) {
      throw new Error("Room not found");
    }

    const roomData = roomDoc.data();

    if (roomData.joinedUids?.includes(userId)) {
      console.log("User already joined this room");
      return true;
    }

    await updateDoc(roomRef, {
      joinedUids: arrayUnion(userId),
    });

    await updateRoomStats(userId, {
      totalJoined: 1,
      activeRooms: 1,
    });

    console.log("✅ User joined room successfully");
    return true;
  } catch (err) {
    console.error("Error joining room:", err);
    return false;
  }
};

export const leaveRoom = async (
  roomId: string,
  userId: string
): Promise<boolean> => {
  try {
    const roomRef = doc(db, "roomEvents", roomId);

    await updateDoc(roomRef, {
      joinedUids: arrayRemove(userId),
    });

    await updateRoomStats(userId, {
      totalJoined: -1,
    });

    console.log("✅ User left room successfully");
    return true;
  } catch (err) {
    console.error("Error leaving room:", err);
    return false;
  }
};
