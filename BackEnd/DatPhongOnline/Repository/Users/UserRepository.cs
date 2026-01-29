using DatPhongOnline.Data;
using DatPhongOnline.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace DatPhongOnline.Repository.Users
{
    public class UserRepository : IUserRepository
    {
        private readonly AppDbContext _context;

        public UserRepository(AppDbContext context) {
            _context = context;
        }

        public async Task<List<User>> GetAllAsync()
        {
            return await _context.Users.ToListAsync();
        }


        public async Task<User?> GetByEmailAsync(string email)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
        }


        public async Task<User?> GetByIdAsync(int id)
        {
            var user = await _context.Users.FindAsync(id);
            return user;
        }

        public async Task<bool> ExistsByEmailAsync(string email)
        {
            return await _context.Users.AnyAsync(X => X.Email == email);
        }

        public async Task AddAsync(User user)
        {
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(User user)
        {
            _context.Users.Update(user);
            await _context.SaveChangesAsync();
        }

        public async Task SetLockedAsync(int id, bool isLocked)
        {
            var user = await GetByIdAsync(id);
            if (user == null) return;
            user.IsLocked = isLocked;
            await UpdateAsync(user);
        }

        public async Task<List<User>> GetFilteredAsync(bool? isLocked, string? role)
        {
            IQueryable<User> query = _context.Users;
            if (isLocked.HasValue)
                query = query.Where(u => u.IsLocked == isLocked);

            if(!string.IsNullOrEmpty(role))
                query = query.Where(u => u.Role == role);

            return await query.ToListAsync();
        }

    }
}
