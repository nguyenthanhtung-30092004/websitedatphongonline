using DatPhongOnline.Data.Entities;

namespace DatPhongOnline.Dtos.Datcoc
{
    public class DatCocDto
    {
        public int Id { get; set; }
        public int BookingId { get; set; }
        public decimal SoTienDatCoc { get; set; }
        public TrangThaiDatCoc TrangThai { get; set; }

        public string? MaGiaoDichVNPay { get; set; } = null;

        public DateTime ThoiGianTao { get; set; } = DateTime.UtcNow;
        public DateTime? ThoiGianThanhToan { get; set; }
    }
}
