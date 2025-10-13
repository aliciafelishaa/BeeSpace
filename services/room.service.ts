import { db } from "@/config/firebaseConfig";
import { RoomEntry } from "@/types/room";
import { addDoc, collection } from "firebase/firestore";

export const createRoom = async (payload: RoomEntry) => {
  // if (!payload.fromUid) {
  //     throw new Error("Missing user UID");
  //   }
  try {
    const roomData = {
      // fromUid: payload.fromUid,
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
