namespace DatPhongOnline.Data.Entities
{
    public class ChatMessage
    {
        public int Id { get; set; }
        public int UserId { get; set; } 
        public string Content { get; set; } = string.Empty;
        public string Role { get; set; } = "user";
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public int? BookingId { get; set; }
    }
}
