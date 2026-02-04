namespace DatPhongOnline.Dtos.ChatMessage
{
    public class ChatResponseDto
    {
        public string Role { get; set; } = "bot";
        public string Content { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }
}
