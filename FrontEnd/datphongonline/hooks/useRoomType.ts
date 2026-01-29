import { useEffect, useState } from "react";
import { message } from "antd";
import { RoomType } from "@/types/roomType";
import { roomTypeApi } from "@/services/api/roomType.api";

export function useRoomTypes() {
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchRoomTypes = async () => {
    try {
      setLoading(true);
      const res = await roomTypeApi.getRoomTypes();
      setRoomTypes(res.data);
      console.log(res.data);
    } catch {
      message.error("Không tải được danh sách loại phòng");
    } finally {
      setLoading(false);
    }
  };

  const createRoomType = async (data: any) => {
    try {
      await roomTypeApi.createRoomType(data);
      message.success("Thêm loại phòng thành công");
      fetchRoomTypes();
    } catch (err: any) {
      const status = err?.response?.status;

      if (status === 401) {
        message.error("Bạn chưa đăng nhập");
      } else if (status === 403) {
        message.error("Bạn không có quyền Admin");
      } else {
        message.error("Lỗi hệ thống");
      }

      throw err; // cho component biết
    }
  };

  const updateRoomType = async (id: number, data: Partial<RoomType>) => {
    await roomTypeApi.updateRoomType(id, data);
    message.success("Cập nhật thành công");
    fetchRoomTypes();
  };

  const deleteRoomType = async (id: number) => {
    await roomTypeApi.deleteRoomType(id);
    message.success("Xóa thành công");
    fetchRoomTypes();
  };

  useEffect(() => {
    fetchRoomTypes();
  }, []);

  return {
    roomTypes,
    loading,
    reload: fetchRoomTypes,
    createRoomType,
    updateRoomType,
    deleteRoomType,
  };
}
