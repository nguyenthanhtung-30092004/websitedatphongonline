using DatPhongOnline.Data.Entities;

namespace DatPhongOnline.Repository.RoomTypes
{
    public interface IRoomTypeRepository
    {
        Task<List<RoomType>> GetAllAsync();
        Task<RoomType?> GetByIdAsync(int id);
        Task AddAsync(RoomType roomType);
        Task UpdateAsync(RoomType roomType);
        Task DeleteAsync(int id);
        Task<bool> ExistsAsync(int id);
    }
}
