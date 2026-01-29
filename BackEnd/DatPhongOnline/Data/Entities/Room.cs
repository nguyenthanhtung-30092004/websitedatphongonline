using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DatPhongOnline.Data.Entities
{
    public class Room
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string RoomName { get; set; } = string.Empty;
        [MaxLength(500)]
        public string Address { get; set; } = string.Empty;
        [Column(TypeName = "decimal(18,2)")]
        public decimal BasePrice { get; set; }
        [MaxLength(20)]
        public string Status { get; set; } = "Available";

        public int RoomTypeId { get; set; }
        public RoomType? RoomType { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public ICollection<RoomImage>? RoomImages { get; set; }
        public ICollection<RoomAmenity>? RoomAmenities { get; set; }
    }
}
