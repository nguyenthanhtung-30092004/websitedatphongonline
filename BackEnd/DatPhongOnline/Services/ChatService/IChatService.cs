using DatPhongOnline.Dtos.ChatMessage;

namespace DatPhongOnline.Services.ChatService
{
    public interface IChatService
    {
        Task<string> ProcessChatAsync(int userId, ChatMessageDto chatDto);
    }
}
