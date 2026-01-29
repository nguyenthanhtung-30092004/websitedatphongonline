using System.ComponentModel.DataAnnotations.Schema;

namespace DatPhongOnline.Data.Entities
{
    public class BookingDetail
    {
        public int Id { get; set; }
        public int BookingId { get; set; }
        public int RoomId { get; set; }
        [Column(TypeName = "decimal(18,2)")]
        public decimal PricePerNight { get; set; }
        public Booking? Booking { get; set; }
        public Room? Room { get; set; }

    }
}
