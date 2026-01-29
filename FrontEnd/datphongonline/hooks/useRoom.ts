"use client";
import { useEffect, useState } from "react";
import { message } from "antd";
import { Room } from "@/types/room";
import { RoomApi } from "@/services/api/room.api";

export function useRoom() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const res = await RoomApi.getRooms();
      setRooms(res.data);
      console.log(res.data);
    } catch {
      message.error("Không tải được danh sách phòng");
    } finally {
      setLoading(false);
    }
  };

  const createRoom = async (data: any) => {
    if (submitting) return;

    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("roomName", data.roomName);
      formData.append("address", data.address ?? "");
      formData.append("basePrice", data.basePrice.toString());
      formData.append("roomTypeId", data.roomTypeId.toString());

      data.amenityIds?.forEach((id: number) =>
        formData.append("amenityIds", id.toString()),
      );

      data.images?.forEach((file: File) => formData.append("images", file));

      await RoomApi.createRoom(formData);

      message.success("Thêm phòng thành công");
      fetchRooms();
    } catch (err) {
      message.error("Lỗi tạo phòng");
      throw err;
    } finally {
      setSubmitting(false); // 👈 HẾT XOAY
    }
  };

  const updateRoom = async (id: number, data: any) => {
    if (submitting) return;

    try {
      setSubmitting(true);

      const formData = new FormData();
      formData.append("roomName", data.roomName);
      formData.append("address", data.address ?? "");
      formData.append("basePrice", data.basePrice.toString());
      formData.append("roomTypeId", data.roomTypeId.toString());

      data.images?.forEach((file: File) => {
        formData.append("images", file);
      });

      data.amenityIds?.forEach((id: number) => {
        formData.append("amenityIds", id.toString());
      });

      await RoomApi.updateRoom(id, formData);
      message.success("Cập nhật phòng thành công");
      await fetchRooms();
    } finally {
      setSubmitting(false);
    }
  };

  const deleteRoom = async (id: number) => {
    await RoomApi.deleteRoom(id);
    message.success("Xóa phòng thành công");
    fetchRooms();
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  return {
    rooms,
    loading,
    submitting,
    reload: fetchRooms,
    createRoom,
    updateRoom,
    deleteRoom,
  };
}
