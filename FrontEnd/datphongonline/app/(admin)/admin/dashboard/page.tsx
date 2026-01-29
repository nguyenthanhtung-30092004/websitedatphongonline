export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-3xl text-black font-semibold mb-6">
        Dashboard quản trị
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-gray-500">Tổng loại phòng</p>
          <p className="text-3xl font-bold text-[#b8955a]">12</p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-gray-500">Tổng phòng</p>
          <p className="text-3xl font-bold text-[#b8955a]">48</p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-gray-500">Người dùng</p>
          <p className="text-3xl font-bold text-[#b8955a]">120</p>
        </div>
      </div>
    </div>
  );
}
