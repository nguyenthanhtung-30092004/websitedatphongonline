using DatPhongOnline.Data;
using DatPhongOnline.Data.Entities;
using DatPhongOnline.Dtos.MenuNav;
using Microsoft.EntityFrameworkCore;

namespace DatPhongOnline.Repository.MenuNavs
{
    public class MenuNavRepository :IMenuNavRepository
    {
        private readonly AppDbContext _context;
        public MenuNavRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<MenuNav>> GetAllAsync()
        {
            return await _context.MenuNavs.ToListAsync();
        }

        public async Task<MenuNav?> GetByIdAsync(int id) {
            return await _context.MenuNavs.FindAsync(id);
        }

        public async Task AddAsync(MenuNav item)
        {
            _context.MenuNavs.Add(item);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(MenuNav item)
        {
            _context.MenuNavs.Update(item);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var item = await _context.MenuNavs.FindAsync(id);
            if (item == null) return;
            _context.Remove(item);
            await _context.SaveChangesAsync();
        }

    }
}
