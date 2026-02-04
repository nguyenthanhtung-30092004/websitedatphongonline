using DatPhongOnline.Data.Entities;

namespace DatPhongOnline.Repository.ChatMessages
{
    public interface IChatRepository
    {
        Task SaveMessageAsync(ChatMessage message);
        Task<List<ChatMessage>> GetSessionHistoryAsync(int userId, int limit = 10);
    }
}
