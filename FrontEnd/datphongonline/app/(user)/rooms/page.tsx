"use client";

import Link from "next/link";
import { useState } from "react";
import { Pagination, Card } from "antd";
import { useRoom } from "@/hooks/useRoom";

/* ================= CONFIG ================= */

const PAGE_SIZE = 6;
const FEATURED_COUNT = 3;

/* ================= PAGE ================= */

export default function RoomsPage() {
  const { rooms } = useRoom();
  const [page, setPage] = useState(1);

  if (!rooms || rooms.length === 0) return null;

  const featuredRooms = rooms.slice(0, FEATURED_COUNT);

  const pagedRooms = rooms.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <main className="bg-[#f3f1ee]">
      {/* ================= HERO ================= */}
      <section className="relative h-[55vh] flex items-center justify-center">
        {rooms[0]?.imageUrls?.[0] && (
          <img
            src={rooms[0].imageUrls[0]}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black/40" />

        <div className="relative z-10 text-center text-white">
          <p className="uppercase tracking-widest text-sm mb-3">Our Rooms</p>
          <h1 className="text-4xl md:text-5xl font-semibold">Rooms & Suites</h1>
        </div>
      </section>

      {/* ================= FILTER BAR ================= */}
      <section className="relative z-20 -mt-12">
        <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-6 grid grid-cols-4 gap-4 text-sm">
          <FilterItem label="Check in" value="22 Jan" />
          <FilterItem label="Check out" value="28 Jan" />
          <FilterItem label="Guests" value="02 Adults" />
          <button className="bg-[#b89655] text-white rounded-lg font-medium">
            Check Availability
          </button>
        </div>
      </section>

      {/* ================= FEATURED ROOMS ================= */}
      <section className="max-w-7xl mx-auto px-6 py-24 space-y-24">
        {featuredRooms.map((room, index) => {
          const reverse = index % 2 === 1;

          return (
            <div
              key={room.id}
              className="grid lg:grid-cols-2 gap-12 items-center"
            >
              {!reverse && <RoomImage src={room.imageUrls[0]} />}
              <RoomContent room={room} />
              {reverse && <RoomImage src={room.imageUrls[0]} />}
            </div>
          );
        })}
      </section>

      {/* ================= ALL ROOMS ================= */}
      <section className="max-w-7xl mx-auto px-6 pb-32">
        <h2 className="text-2xl font-semibold mb-12 text-center">All Rooms</h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {pagedRooms.map((room) => (
            <Card
              key={room.id}
              hoverable
              className="rounded-2xl overflow-hidden"
              cover={
                <img src={room.imageUrls[0]} className="h-56 object-cover" />
              }
            >
              <h3 className="text-lg font-medium mb-2">{room.roomName}</h3>

              <p className="text-gray-500 mb-4">
                From {room.basePrice.toLocaleString()}đ / night
              </p>

              <Link
                href={`/room-detail/${room.id}`}
                className="text-[#b89655] font-medium text-sm"
              >
                View details →
              </Link>
            </Card>
          ))}
        </div>

        <div className="flex justify-center mt-16">
          <Pagination
            current={page}
            pageSize={PAGE_SIZE}
            total={rooms.length}
            onChange={setPage}
            showSizeChanger={false}
          />
        </div>
      </section>
    </main>
  );
}

/* ================= COMPONENTS ================= */

function FilterItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-gray-400">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}

function RoomImage({ src }: { src: string }) {
  return (
    <div className="rounded-2xl overflow-hidden">
      <img src={src} className="w-full h-[420px] object-cover" />
    </div>
  );
}

function RoomContent({ room }: { room: any }) {
  return (
    <div className="bg-[#f7f5f2] p-10 rounded-2xl">
      <div className="flex items-center gap-1 mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} className="text-[#c9a96a]">
            ★
          </span>
        ))}
      </div>

      <h2 className="text-2xl font-semibold mb-4">{room.roomName}</h2>

      <p className="text-gray-600 mb-6 leading-relaxed">
        Không gian phòng sang trọng, đầy đủ tiện nghi, phù hợp cho kỳ nghỉ dưỡng
        và công tác.
      </p>

      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-6">
        <div>👤 Max guests: 2</div>
        <div>🛏 Bed: King Size</div>
        <div>📐 Size: 35m²</div>
        <div>🌆 View: City</div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-2xl font-semibold">
          {room.basePrice.toLocaleString()}đ
          <span className="text-sm text-gray-400"> / night</span>
        </div>

        <Link
          href={`/room-detail/${room.id}`}
          className="px-6 py-3 rounded-full bg-[#b89655] text-white text-sm font-medium hover:bg-[#a38345] transition"
        >
          View details
        </Link>
      </div>
    </div>
  );
}
