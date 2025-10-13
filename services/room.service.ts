import { db } from "@/config/firebaseConfig";
import { RoomEntry } from "@/types/myroom/room";
import { addDoc, collection, getDocs, Timestamp } from "firebase/firestore";

export const createRoom = async (payload: RoomEntry) => {
  // if (!payload.fromUid) {
  //     throw new Error("Missing user UID");
  //   }
  try {
    const roomData = {
      // fromUid: payload.fromUid
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
    // Object.entries(roomData).forEach(([key, value]) => {
    //   if (value instanceof Date) {
    //     console.log(`${key}: Date ->`, value.toString());
    //   } else {
    //     console.log(`${key}: ${typeof value} ->`, value);
    //   }
    // });
    console.log("payload:", roomData);
    const reqRef = await addDoc(collection(db, "roomEvents"), roomData);
    return { success: true, id: reqRef.id };
  } catch (err) {
    return { success: false, message: err };
  }
};

export const getAllRoom = async () => {
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
