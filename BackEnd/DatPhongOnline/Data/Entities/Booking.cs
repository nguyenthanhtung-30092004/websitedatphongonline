using System.ComponentModel.DataAnnotations.Schema;

namespace DatPhongOnline.Data.Entities
{
    public class Booking
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public User User { get; set; }
        public DateTime CheckInDate { get; set; }
        public DateTime CheckOutDate { get; set; }
        public int Adults { get; set; }
        public int Children { get; set; }
        public int TotalDays { get; set; }
        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalPrice { get; set; }
        public BookingStatus Status { get; set; }
        public DateTime Createdat { get; set; } = DateTime.UtcNow;

        public ICollection<BookingDetail> BookingDetails { get; set; }
        
    }
}
