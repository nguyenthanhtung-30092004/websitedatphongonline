namespace DatPhongOnline.Dtos.Room
{
    public class CreateRoomDto
    {
        public string RoomName { get; set; }
        public string? Address { get; set; }
        public decimal BasePrice { get; set; }
        public int RoomTypeId { get; set; }
        public List<IFormFile>? Images { get; set; }
        public List<int>? AmenityIds { get; set; } 

    }
}
