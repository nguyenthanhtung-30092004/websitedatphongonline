using DatPhongOnline.Data.Entities;
using System.ComponentModel.DataAnnotations.Schema;

namespace DatPhongOnline.Dtos.Booking
{
    public class BookingDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public DateTime CheckInDate { get; set; }
        public DateTime CheckOutDate { get; set; }
        public int Adults { get; set; }
        public int Children { get; set; }
        public int TotalDays { get; set; }
        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalPrice { get; set; }
        public BookingStatus Status { get; set; }
        public List<BookingDetailDto>? BookingDetails { get; set; }
    }
}
