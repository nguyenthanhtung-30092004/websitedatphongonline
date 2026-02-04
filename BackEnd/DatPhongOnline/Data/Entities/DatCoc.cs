using System.ComponentModel.DataAnnotations.Schema;

namespace DatPhongOnline.Data.Entities
{
    public enum TrangThaiDatCoc
    {
        ChoThanhToan = 0,
        DaThanhToan = 1,
        ThatBai = 2,
        DaHuy = 3
    }
    public class DatCoc
    {
            public int Id { get; set; }

            public int BookingId { get; set; }
            public Booking Booking { get; set; }

            [Column(TypeName = "decimal(18,2)")]
            public decimal SoTienDatCoc { get; set; }

            public TrangThaiDatCoc TrangThai { get; set; }

            public string? MaGiaoDichVNPay { get; set; } = null;

            public DateTime ThoiGianTao { get; set; } = DateTime.UtcNow;
            public DateTime? ThoiGianThanhToan { get; set; }
        }
    
}
