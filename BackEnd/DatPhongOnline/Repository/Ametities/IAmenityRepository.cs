using DatPhongOnline.Data.Entities;

namespace DatPhongOnline.Repository.Ametities
{
    public interface IAmenityRepository
    {
        Task<List<Amenity>> GetAllAsync();
        Task<Amenity?> GetByIdAsync(int id);
        Task AddAsync(Amenity amenity);
        Task UpdateAsync(Amenity amenity);
        Task DeleteAsync(int id);
        Task<bool> ExistsAsync(int id);
    }
}
