namespace DatPhongOnline.Dtos.Booking
{
    public class RoomMatrixDto
    {
        public int RoomId { get; set; }
        public string RoomName { get; set; } = default!;
        public List<RoomDayStatusDto> Days { get; set; } = new();
    }
}
