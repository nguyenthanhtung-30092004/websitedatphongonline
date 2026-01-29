"use client";

import { useParams } from "next/navigation";
import * as AntdIcons from "@ant-design/icons";
import { useRoom } from "@/hooks/useRoom";
import { useAmenity } from "@/hooks/useAmenity";

export default function RoomDetailPage() {
  const { id } = useParams();
  const { rooms } = useRoom();
  const { amenities } = useAmenity();

  const room = rooms.find((r) => r.id === Number(id));

  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Không tìm thấy phòng
      </div>
    );
  }

  return (
    <main className="bg-[#f7f5f2]">
      {/* HERO */}
      {/* <section className="relative h-[60vh]">
        <img
          src={room.imageUrls[0]}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 h-full flex items-center justify-center">
          <h1 className="text-4xl md:text-5xl font-semibold text-white tracking-wide">
            {room.roomName}
          </h1>
        </div>
      </section> */}

      {/* CONTENT */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-3 gap-14">
          {/* LEFT */}
          <div className="lg:col-span-2">
            {/* GALLERY */}
            <div className="grid grid-cols-4 grid-rows-2 gap-4 mb-12">
              <div className="col-span-2 row-span-2 rounded-xl overflow-hidden">
                <img
                  src={room.imageUrls[0]}
                  className="w-full h-full object-cover"
                />
              </div>
              {room.imageUrls.slice(1, 5).map((img, idx) => (
                <div key={idx} className="rounded-xl overflow-hidden">
                  <img src={img} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>

            {/* DESCRIPTION */}
            <div className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">More information</h2>
              <p className="text-gray-600 leading-relaxed max-w-3xl">
                Không gian nghỉ dưỡng cao cấp với thiết kế tinh tế, tận hưởng sự
                yên bình và tiện nghi đẳng cấp dành cho khách hàng.
              </p>
            </div>

            {/* AMENITIES */}
            <div>
              <h2 className="text-2xl font-semibold mb-6">Facilities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                {room.amenities.map((ameName) => {
                  const amenity = amenities.find((a) => a.name === ameName);
                  if (!amenity) return null;
                  const Icon = (AntdIcons as any)[amenity.icon];

                  return (
                    <div
                      key={amenity.id}
                      className="flex items-center gap-4 bg-white rounded-xl px-5 py-4 shadow-sm"
                    >
                      {Icon && (
                        <span className="w-10 h-10 flex items-center justify-center rounded-full bg-[#c9a96a] text-white">
                          <Icon />
                        </span>
                      )}
                      <span className="text-gray-700 text-sm">
                        {amenity.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <aside className="bg-[#fdfbf8] border rounded-xl p-8 h-fit sticky top-24">
            <h3 className="text-xl font-semibold mb-2">Luxury Room</h3>
            <p className="text-sm text-gray-500 mb-6">From</p>
            <div className="text-3xl font-semibold mb-6">
              {room.basePrice.toLocaleString()}đ
              <span className="text-base font-normal text-gray-400">
                {" "}
                / night
              </span>
            </div>

            <button className="w-full py-3 rounded-full bg-[#c9a96a] text-white font-medium hover:bg-[#b89655] transition">
              Book now
            </button>

            {/* <div className="mt-8 text-sm text-gray-500 space-y-3">
              <div>✔ Check-in: 14:00</div>
              <div>✔ Check-out: 12:00</div>
              <div>✔ Free cancellation</div>
            </div> */}
          </aside>
        </div>
      </section>
    </main>
  );
}
