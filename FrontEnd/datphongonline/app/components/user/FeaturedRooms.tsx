"use client";

import { useAmenity } from "@/hooks/useAmenity";
import { useRoom } from "@/hooks/useRoom";
import * as AntdIcons from "@ant-design/icons";
import Link from "next/link";

export default function FeaturedRooms() {
  const { rooms } = useRoom();
  const { amenities } = useAmenity();

  return (
    <section className="bg-[#fafafa] py-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* HEADER */}
        <div className="mb-12">
          <h2 className="text-3xl font-semibold text-gray-900">
            Phòng nổi bật
          </h2>
          <p className="text-gray-500 mt-2 text-sm">
            Những lựa chọn được khách hàng yêu thích nhất
          </p>
        </div>

        {/* GRID */}
        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
          {rooms.map((room) => (
            <Link
              href={`/room-detail/${room.id}`}
              key={room.id}
              className="
                group
                bg-white
                rounded-2xl
                overflow-hidden
                shadow-md
                hover:shadow-xl
                transition-all duration-300
                flex flex-col
              "
            >
              {/* IMAGE */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={room.imageUrls[0]}
                  alt={room.roomName}
                  className="
                    w-full h-full object-cover
                    group-hover:scale-105
                    transition-transform duration-500
                  "
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>

              {/* CONTENT */}
              <div className="p-5 flex flex-col flex-1">
                <h3 className="text-lg font-semibold text-gray-900">
                  {room.roomName}
                </h3>
                <p className="text-xs text-gray-500 mt-1">{room.address}</p>

                {/* AMENITIES */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {room.amenities.slice(0, 3).map((ameName) => {
                    const amenity = amenities.find((a) => a.name === ameName);
                    if (!amenity) return null;

                    const Icon = (AntdIcons as any)[amenity.icon];

                    return (
                      <div
                        key={amenity.id}
                        className="
                          flex items-center gap-2
                          px-2.5 py-1
                          rounded-full
                          bg-gray-50
                          border border-gray-200
                          text-gray-700
                          text-xs
                        "
                      >
                        {Icon && (
                          <span
                            className="
                              w-6 h-6
                              flex items-center justify-center
                              rounded-full
                              bg-gradient-to-br from-[#c9a96a] to-[#9f7c3f]
                              text-white
                            "
                          >
                            <Icon className="text-xs" />
                          </span>
                        )}
                        <span>{amenity.name}</span>
                      </div>
                    );
                  })}
                </div>

                {/* PRICE + CTA */}
                <div className="flex justify-between items-end mt-auto pt-5">
                  <div>
                    <span className="text-[10px] uppercase tracking-wide text-gray-400">
                      Giá từ
                    </span>
                    <div className="text-xl font-semibold text-gray-900">
                      {room.basePrice.toLocaleString()}đ
                      <span className="text-sm font-normal text-gray-400">
                        {" "}
                        / đêm
                      </span>
                    </div>
                  </div>

                  <button
                    className="
                      px-5 py-2.5
                      rounded-full
                      text-xs font-medium
                      text-white
                      bg-gray-900
                      hover:bg-[#c9a96a]
                      transition-all duration-300 hover:cursor-pointer
                    "
                  >
                    Đặt phòng
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
