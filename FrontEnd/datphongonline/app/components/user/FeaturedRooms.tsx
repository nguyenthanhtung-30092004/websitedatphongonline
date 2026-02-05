"use client";

import { useEffect, useState } from "react";
import { useAmenity } from "@/hooks/useAmenity";
import { useBooking } from "@/hooks/useBooking";
import { Room } from "@/types/room";
import RoomCard from "./RoomCard";

export default function FeaturedRooms() {
  const { amenities } = useAmenity();
  const { getBestSellingBooking, loading } = useBooking();
  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => {
    const fetchBestSelling = async () => {
      try {
        const data = await getBestSellingBooking(6);
        setRooms(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchBestSelling();
  }, []);

  return (
    <section className="bg-white py-24 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-40 -right-20 w-80 h-80 bg-[#D4E9E2] rounded-full blur-[120px] opacity-30" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="space-y-4">
            <h2 className="text-4xl font-serif text-[#1E3932]">
              Những căn phòng <br />{" "}
              <span className="text-[#C9A96A]">tuyệt vời nhất</span>
            </h2>
            <div className="w-20 h-1 bg-[#C9A96A] rounded-full" />
          </div>
          <p className="text-stone-500 max-w-sm text-sm leading-relaxed">
            Được tuyển chọn kỹ lưỡng dựa trên đánh giá của hàng ngàn khách hàng
            đã trải nghiệm dịch vụ.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-96 rounded-[2rem] bg-stone-50 animate-pulse"
              />
            ))}
          </div>
        ) : rooms.length === 0 ? (
          <div className="text-center py-20 bg-stone-50 rounded-[2rem] text-stone-400 italic">
            Chưa có dữ liệu phòng nổi bật
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-10">
            {rooms.map((room) => (
              <RoomCard key={room.id} room={room} amenities={amenities} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
