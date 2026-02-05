namespace DatPhongOnline.Dtos.Booking
{
    public class RoomDayStatusDto
    {
        public DateOnly Date { get; set; }
        public string Status { get; set; } = default!;
    }
}
