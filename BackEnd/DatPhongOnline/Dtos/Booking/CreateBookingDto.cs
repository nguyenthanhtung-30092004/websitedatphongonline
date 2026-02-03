using DatPhongOnline.Data.Entities;

namespace DatPhongOnline.Dtos.Booking
{
    public class CreateBookingDto
    {
        public DateTime CheckInDate { get; set; }
        public DateTime CheckOutDate { get; set; }
        public int Adults { get; set; }
        public int Children { get; set; }
        public List<int>? RoomIds { get; set; }

    }
}
