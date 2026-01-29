import { useEffect, useState } from "react";
import { message } from "antd";
import { Amenity } from "@/types/amenity";
import { AmenityApi } from "@/services/api/amenity.api";

export function useAmenity() {
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchAmenity = async () => {
    try {
      setLoading(true);
      const res = await AmenityApi.getAmenitys();
      setAmenities(res.data);
    } catch {
      message.error("Không tải được danh sách tiện tích");
    } finally {
      setLoading(false);
    }
  };

  const createAmenity = async (data: any) => {
    try {
      await AmenityApi.createAmenity(data);
      message.success("Thêm loại phòng thành công");
      fetchAmenity();
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

  const updateAmenity = async (id: number, data: Partial<Amenity>) => {
    await AmenityApi.updateAmenity(id, data);
    message.success("Cập nhật thành công");
    fetchAmenity();
  };

  const deleteAmenity = async (id: number) => {
    await AmenityApi.deleteAmenity(id);
    message.success("Xóa thành công");
    fetchAmenity();
  };

  useEffect(() => {
    fetchAmenity();
  }, []);

  return {
    amenities,
    loading,
    reload: fetchAmenity,
    createAmenity,
    updateAmenity,
    deleteAmenity,
  };
}
