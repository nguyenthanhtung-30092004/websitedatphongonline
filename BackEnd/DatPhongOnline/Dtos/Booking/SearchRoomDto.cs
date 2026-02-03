namespace DatPhongOnline.Dtos.Booking
{
    public class SearchRoomDto
    {
        public DateTime CheckIn { get; set; }
        public DateTime CheckOut { get; set; }
        public int Adults { get; set; }
        public int Children { get; set; }

    }
}
