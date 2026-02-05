"use client";

import Link from "next/link";
import Image from "next/image";
import * as AntdIcons from "@ant-design/icons";
import { Room } from "@/types/room";
import { Amenity } from "@/types/amenity";

interface RoomCardProps {
  room: Room;
  amenities: Amenity[];
}

export default function RoomCard({ room, amenities }: RoomCardProps) {
  return (
    <Link
      href={`/room-detail/${room.id}`}
      className="group bg-white rounded-[2rem] overflow-hidden border border-stone-100 hover:border-[#D4E9E2] hover:shadow-2xl hover:shadow-stone-200 transition-all duration-500 flex flex-col h-full"
    >
      {/* IMAGE CONTAINER */}
      <div className="relative h-64 overflow-hidden">
        <Image
          src={room.imageUrls?.[0] || "/images/room-placeholder.jpg"}
          alt={room.roomName}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-700"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-[#1E3932] uppercase tracking-wider">
          Premium
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#1E3932]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      {/* CONTENT AREA */}
      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-xl font-serif text-[#1E3932] group-hover:text-[#2D4F3C] transition-colors">
          {room.roomName}
        </h3>
        <p className="text-sm text-stone-400 mt-2 flex items-center gap-1 italic">
          <AntdIcons.EnvironmentOutlined className="text-[#C9A96A]" />
          {room.address}
        </p>

        {/* AMENITIES PILLS */}
        <div className="flex flex-wrap gap-2 mt-5">
          {room.amenities?.slice(0, 3).map((ameName) => {
            const amenity = amenities.find((a) => a.name === ameName);
            if (!amenity) return null;
            const Icon = (AntdIcons as any)[amenity.icon];

            return (
              <div
                key={amenity.id}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-50 border border-stone-100 text-stone-600 text-[11px] font-medium"
              >
                {Icon && <Icon className="text-[#C9A96A]" />}
                <span>{amenity.name}</span>
              </div>
            );
          })}
        </div>

        <div className="mt-auto pt-8 flex justify-between items-center border-t border-stone-50">
          <div>
            <span className="block text-[10px] uppercase tracking-tighter text-stone-400 font-bold">
              Giá mỗi đêm
            </span>
            <span className="text-2xl font-bold text-[#1E3932]">
              {room.basePrice.toLocaleString()}đ
            </span>
          </div>
          <div className="w-12 h-12 rounded-full bg-[#D4E9E2] group-hover:bg-[#1E3932] flex items-center justify-center transition-colors duration-300">
            <AntdIcons.ArrowRightOutlined className="text-[#1E3932] group-hover:text-white transition-colors" />
          </div>
        </div>
      </div>
    </Link>
  );
}
