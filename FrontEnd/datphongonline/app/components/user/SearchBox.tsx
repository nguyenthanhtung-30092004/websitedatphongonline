"use client";

export default function SearchBox() {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 grid grid-cols-1 md:grid-cols-4 gap-4">
      <input className="input" placeholder="Ngày nhận phòng" />
      <input className="input" placeholder="Ngày trả phòng" />
      <input className="input" placeholder="Số người" />
      <button className="bg-[#b8955a] text-white rounded-xl font-semibold">
        Tìm phòng
      </button>
    </div>
  );
}
