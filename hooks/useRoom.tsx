import {
  createRoom,
  deleteRoomService,
  getAllRoom,
  getRoombyId,
  updateRoomService,
} from "@/services/room.service";
import { RoomEntry } from "@/types/myroom/room";
import { useState } from "react";

export function useRoom() {
  const [loading, setLoading] = useState(false);

  const addRoom = async (data: RoomEntry) => {
    setLoading(true);
    try {
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

  const getRoom = async () => {
    setLoading(true);
    try {
      const room = await getAllRoom();
      return { success: true, data: room };
    } catch (err: any) {
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };
  const getRoomId = async (id: string) => {
    setLoading(true);
    try {
      const room = await getRoombyId(id);
      return { success: true, data: room ?? [] };
    } catch (err: any) {
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  const updateRoom = async (id: string, data: Partial<RoomEntry>) => {
    setLoading(true);
    try {
      await updateRoomService(id, data);
      return { success: true };
    } catch (err: any) {
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  const deleteRoom = async (id: string) => {
    setLoading(true);
    try {
      await deleteRoomService(id);
      return { success: true };
    } catch (err: any) {
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  return { addRoom, getRoom, getRoomId, updateRoom, deleteRoom };
}
