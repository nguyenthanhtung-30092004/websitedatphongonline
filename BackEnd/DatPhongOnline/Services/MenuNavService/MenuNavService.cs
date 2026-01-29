using DatPhongOnline.Dtos.Amenity;
using DatPhongOnline.Dtos.MenuNav;
using DatPhongOnline.Repository.MenuNavs;
using Microsoft.AspNetCore.Http.HttpResults;

namespace DatPhongOnline.Services.MenuNavService
{
    public class MenuNavService : IMenuNavService
    {
        private readonly IMenuNavRepository repo;

        public MenuNavService(IMenuNavRepository repo) {
            this.repo = repo;
        }

        public async Task<List<MenuNavDto>> GetAllAsync()
        {
            var data = await repo.GetAllAsync();
            return data.Select(r => new MenuNavDto
            {
                Id = r.Id,
                Title = r.Title,
                Icon = r.Icon,
            }).ToList();
        }

        public async Task<MenuNavDto?> GetByIdAsync(int id)
        {
            var item = await repo.GetByIdAsync(id);
            if (item == null) return null;
            return new MenuNavDto
            {
                Id = item.Id,
                Title = item.Title,
                Icon = item.Icon,
            };
        }

        public async Task CreateAsync(CreateMenuNavDto dto)
        {
            var item = new Data.Entities.MenuNav
            {
                Title = dto.Title,
                Icon = dto.Icon,
            };
            await repo.AddAsync(item);
        }

        public async Task<bool> UpdateAsync(int id, UpdateMenuNavDto dto)
        {
            var item = await repo.GetByIdAsync(id);
            if (item == null) return false;
            item.Title = dto.Title;
            item.Icon = dto.Icon;
            await repo.UpdateAsync(item);
            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var item = await repo.GetByIdAsync(id);
            if (item == null) return false;
            await repo.DeleteAsync(id);
            return true;
        }

    }
}
