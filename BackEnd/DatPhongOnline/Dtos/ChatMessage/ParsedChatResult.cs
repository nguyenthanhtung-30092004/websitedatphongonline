namespace DatPhongOnline.Dtos.ChatMessage
{
    public class ParsedChatResult
    {
        public string Intent { get; set; } = "other";

        public DateTime? CheckIn { get; set; }
        public DateTime? CheckOut { get; set; }

        // để mở rộng sau
        public int? Guests { get; set; }
        public string? RoomType { get; set; }
    }
}
