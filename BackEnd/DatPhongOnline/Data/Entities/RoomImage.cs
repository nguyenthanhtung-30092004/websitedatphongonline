using System.ComponentModel.DataAnnotations;

namespace DatPhongOnline.Data.Entities
{
    public class RoomImage
    {
        public int Id { get; set; }
        public string ImageUrl { get; set; }
        public string PublicId { get; set; } = null!;
        [Required]
        public int RoomId { get; set; }
        public Room Room { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
