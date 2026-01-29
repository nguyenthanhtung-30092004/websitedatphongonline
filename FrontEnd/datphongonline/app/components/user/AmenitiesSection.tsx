export default function AmenitiesSection() {
  return (
    <section className="bg-[#f5f3f0] py-20">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-semibold mb-12">Tiện nghi nổi bật</h2>

        <div className="grid md:grid-cols-4 gap-8">
          {["Wifi", "Hồ bơi", "Gym", "Ăn sáng"].map((item) => (
            <div key={item} className="bg-white p-8 rounded-2xl shadow">
              <div className="text-[#b8955a] text-3xl mb-4">★</div>
              <h3 className="font-semibold">{item}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
