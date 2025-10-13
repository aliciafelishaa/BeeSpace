import { createRoom } from "@/services/room.service";
import { RoomEntry } from "@/types/myroom/room";
import { useState } from "react";

export function useRoom() {
  const [loading, setLoading] = useState(false);

  const addRoom = async (data: RoomEntry) => {
    setLoading(true);
    try {
      console.log("hello");
      console.log(data);
      const result = await createRoom({ ...data });
      if (result.success) {
        return { success: true, id: result.id };
      } else {
        return { success: false, message: result.message };
      }
    } catch (err: any) {
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  return { addRoom };
}
