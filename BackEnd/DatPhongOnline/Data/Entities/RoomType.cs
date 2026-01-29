using System.ComponentModel.DataAnnotations;

namespace DatPhongOnline.Data.Entities
{
    public class RoomType
    {
        public int Id { get; set; }
        [Required]
        [MaxLength(100)]
        public string Name { get; set; }
        public int MaxGuests { get; set; }
        public string Description { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public ICollection<Room> Rooms { get; set; }
    }
}
