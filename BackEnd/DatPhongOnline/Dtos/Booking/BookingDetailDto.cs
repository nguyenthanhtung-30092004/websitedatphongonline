namespace DatPhongOnline.Dtos.Booking
{
    public class BookingDetailDto
    {
        public int RoomId { get; set; }
        public string RoomName { get; set; }
        public string Address { get; set; }
        public decimal BasePrice { get; set; }
        public decimal PricePerNight { get; set; }
    }
}
