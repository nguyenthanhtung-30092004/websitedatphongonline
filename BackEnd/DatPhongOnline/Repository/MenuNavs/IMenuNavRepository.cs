using DatPhongOnline.Data.Entities;

namespace DatPhongOnline.Repository.MenuNavs
{
    public interface IMenuNavRepository
    {
        Task<List<MenuNav>> GetAllAsync();
        Task<MenuNav?> GetByIdAsync(int id);
        Task AddAsync(MenuNav item);
        Task UpdateAsync(MenuNav item);
        Task DeleteAsync(int id);
    }
}
