using DatPhongOnline.Dtos.Amenity;

namespace DatPhongOnline.Dtos.Room
{
    public class RoomDto
    {
        public int Id { get; set; }
        public string RoomName { get; set; }
        public string Address { get; set; }
        public decimal BasePrice { get; set; }

        public int RoomTypeId { get; set; }      
        public string RoomTypeName { get; set; }  

        public List<string> ImageUrls { get; set; } = new();
        public List<string> Amenities { get; set; } = new();
    }

}
