import { db } from "@/config/firebaseConfig";
import { RoomEntry } from "@/types/myroom/room";
import {
  addDoc,
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
    };
    console.log("payload:", roomData);
    const reqRef = await addDoc(collection(db, "roomEvents"), roomData);
    return { success: true, id: reqRef.id };
  } catch (err) {
    return { success: false, message: err };
  }
};

export const getAllRoom = async (uid: string) => {
  const roomcol = collection(db, "roomEvents");
  const q = query(roomcol, where("fromUid", "==", uid));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => {
    const data = doc.data();

    return {
      id: doc.id,
      ...data,
      date: data.date instanceof Timestamp ? data.date.toDate() : data.date,
    } as RoomEntry & { id: string };
  });
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
    return { success: true, message: "Room deleted successfully" };
  } catch (error) {
    console.error("Error deleting room:", error);
    return { success: false, message: "Failed to delete room" };
  }
};
