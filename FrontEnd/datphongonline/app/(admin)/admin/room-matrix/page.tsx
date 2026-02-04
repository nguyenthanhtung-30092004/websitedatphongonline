"use client";

export default function RoomMatrixPage() {
  const dates = [
    "2026-06-10",
    "2026-06-11",
    "2026-06-12",
    "2026-06-13",
    "2026-06-14",
    "2026-06-15",
    "2026-06-16",
  ];

  const roomMatrixData = [
    {
      roomId: 101,
      roomName: "Deluxe 101",
      days: [
        { date: "2026-06-10", status: "Occupied" },
        { date: "2026-06-11", status: "Occupied" },
        { date: "2026-06-12", status: "Available" },
        { date: "2026-06-13", status: "Available" },
        { date: "2026-06-14", status: "Available" },
        { date: "2026-06-15", status: "Available" },
        { date: "2026-06-16", status: "Available" },
      ],
    },
    {
      roomId: 102,
      roomName: "Standard 102",
      days: [
        { date: "2026-06-10", status: "Available" },
        { date: "2026-06-11", status: "Available" },
        { date: "2026-06-12", status: "Upcoming" },
        { date: "2026-06-13", status: "Occupied" },
        { date: "2026-06-14", status: "Occupied" },
        { date: "2026-06-15", status: "Available" },
        { date: "2026-06-16", status: "Available" },
      ],
    },
    {
      roomId: 103,
      roomName: "Family 103",
      days: [
        { date: "2026-06-10", status: "Available" },
        { date: "2026-06-11", status: "Upcoming" },
        { date: "2026-06-12", status: "Occupied" },
        { date: "2026-06-13", status: "Occupied" },
        { date: "2026-06-14", status: "Occupied" },
        { date: "2026-06-15", status: "Available" },
        { date: "2026-06-16", status: "Available" },
      ],
    },
  ];

  const statusStyle = (status: string) => {
    switch (status) {
      case "Available":
        return "bg-emerald-100 text-emerald-700";
      case "Occupied":
        return "bg-rose-100 text-rose-700";
      case "Upcoming":
        return "bg-amber-100 text-amber-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Room Matrix</h1>
        <p className="text-gray-500 mt-1">
          Theo dõi trạng thái phòng theo ngày
        </p>
      </div>

      {/* Legend */}
      <div className="flex gap-6 mb-6 text-sm">
        <Legend color="bg-emerald-100" text="Trống" />
        <Legend color="bg-rose-100" text="Có khách" />
        <Legend color="bg-amber-100" text="Sắp check-in" />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="sticky left-0 z-10 bg-gray-100 p-4 text-left">
                Phòng
              </th>
              {dates.map((date) => (
                <th key={date} className="p-4 text-center">
                  {new Date(date).toLocaleDateString("vi-VN", {
                    day: "2-digit",
                    month: "2-digit",
                  })}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {roomMatrixData.map((room) => (
              <tr key={room.roomId} className="hover:bg-gray-50 transition">
                <td className="sticky left-0 z-10 bg-white p-4 font-medium border-r">
                  {room.roomName}
                </td>

                {room.days.map((day) => (
                  <td key={day.date} className="p-4 text-center">
                    <span
                      className={`inline-flex items-center justify-center px-3 py-1 rounded-full font-medium ${statusStyle(
                        day.status,
                      )}`}
                      title={`${room.roomName} - ${day.status}`}
                    >
                      {day.status}
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Legend({ color, text }: { color: string; text: string }) {
  return (
    <span className="flex items-center gap-2">
      <span className={`w-3 h-3 rounded-full ${color}`} />
      <span className="text-gray-600">{text}</span>
    </span>
  );
}
