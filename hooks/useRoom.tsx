import {
  createRoom,
  deleteRoomService,
  getAllRoom,
  getRoombyId,
  updateRoomService,
} from "@/services/room.service";
import { RoomEntry } from "@/types/myroom/room";
import { useState } from "react";
import { useAuthState } from "./useAuthState";

export function useRoom() {
  const [loading, setLoading] = useState(false);
  const { user } = useAuthState();
  const uid = user?.uid;

  const addRoom = async (data: RoomEntry) => {
    setLoading(true);
    try {
      if (!uid) {
        throw new Error("User is not logged in");
      }

      const result = await createRoom({ ...data, fromUid: uid });
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

  const getRoom = async (uid: string) => {
    try {
      if (!uid) {
        throw new Error("User is not logged in");
      }
      setLoading(true);

      const room = await getAllRoom(uid);
      return { success: true, data: room };
    } catch (err: any) {
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };
  const getRoomId = async (id: string, uid: string) => {
    setLoading(true);
    try {
      const room = await getRoombyId(id, uid);
      return { success: true, data: room ?? [] };
    } catch (err: any) {
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  const updateRoom = async (
    id: string,
    data: Partial<RoomEntry>,
    uid: string
  ) => {
    setLoading(true);
    try {
      await updateRoomService(id, data, uid);
      return { success: true };
    } catch (err: any) {
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  const deleteRoom = async (id: string, uid: string) => {
    setLoading(true);
    try {
      await deleteRoomService(id, uid);
      return { success: true };
    } catch (err: any) {
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  return { addRoom, getRoom, getRoomId, updateRoom, deleteRoom };
}
