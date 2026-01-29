using DatPhongOnline.Dtos.MenuNav;

namespace DatPhongOnline.Services.MenuNavService
{
    public interface IMenuNavService
    {
        Task<List<MenuNavDto>> GetAllAsync();
        Task<MenuNavDto?> GetByIdAsync(int id);
        Task CreateAsync(CreateMenuNavDto dto);
        Task<bool> UpdateAsync(int id, UpdateMenuNavDto dto);
        Task<bool> DeleteAsync(int id);

    }
}
