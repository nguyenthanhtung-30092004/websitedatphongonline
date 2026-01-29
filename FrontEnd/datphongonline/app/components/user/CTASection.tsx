import Link from "next/link";

export default function CTASection() {
  return (
    <section className="py-20 text-center">
      <h2 className="text-4xl font-semibold mb-6">
        Sẵn sàng cho kỳ nghỉ của bạn?
      </h2>
      <p className="text-gray-600 mb-10">
        Đặt phòng ngay hôm nay với giá tốt nhất
      </p>

      <Link
        href="/rooms"
        className="inline-block bg-[#b8955a] text-white px-10 py-4 rounded-xl font-semibold"
      >
        Xem phòng ngay
      </Link>
    </section>
  );
}
