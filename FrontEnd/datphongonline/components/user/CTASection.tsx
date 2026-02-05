import Link from "next/link";

export default function CTASection() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto bg-[#1E3932] rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden">
        {/* Decorative Circles */}
        <div className="absolute -top-20 -left-20 w-64 h-64 border-[40px] border-white/5 rounded-full" />
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-[#D4E9E2] opacity-10 rounded-full" />

        <div className="relative z-10">
          <h2 className="text-4xl md:text-6xl font-serif text-white mb-8 leading-tight">
            Sẵn sàng cho <br /> kỳ nghỉ trong mơ?
          </h2>
          <p className="text-[#D4E9E2] mb-12 text-lg max-w-xl mx-auto font-light">
            Tham gia cùng hàng nghìn khách hàng khác để nhận được ưu đãi phòng
            lên tới 30% trong mùa hè này.
          </p>

          <Link
            href="/rooms"
            className="inline-block bg-[#C9A96A] hover:bg-[#B8955A] text-[#1E3932] px-12 py-5 rounded-2xl font-bold transition-all duration-300 shadow-xl active:scale-95"
          >
            Khám phá phòng ngay
          </Link>
        </div>
      </div>
    </section>
  );
}
