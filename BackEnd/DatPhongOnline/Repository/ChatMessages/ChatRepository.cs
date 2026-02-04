using DatPhongOnline.Data;
using DatPhongOnline.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace DatPhongOnline.Repository.ChatMessages
{
    public class ChatRepository : IChatRepository
    {
        private readonly AppDbContext _context;
        public ChatRepository(AppDbContext context) => _context = context;

        public async Task SaveMessageAsync(ChatMessage message)
        {
            _context.ChatMessages.Add(message);
            await _context.SaveChangesAsync();
        }

        public async Task<List<ChatMessage>> GetSessionHistoryAsync(int userId, int limit = 10)
        {
            return await _context.ChatMessages
                .Where(m => m.UserId == userId)
                .OrderByDescending(m => m.CreatedAt)
                .Take(limit)
                .Reverse()
                .ToListAsync();
        }
    }
}
