using DatPhongOnline.Data.Entities;

namespace DatPhongOnline.Repository.Users
{
    public interface IUserRepository
    {
        Task<User?> GetByEmailAsync(string email);
        Task<User?> GetByIdAsync(int id);

        Task<List<User>> GetAllAsync();
        Task<bool> ExistsByEmailAsync(string email);

        Task AddAsync(User user);

        Task UpdateAsync(User user);
        Task SetLockedAsync(int id, bool isLocked);
        Task<List<User>> GetFilteredAsync(bool? isLocked, string? role);

    }
}
