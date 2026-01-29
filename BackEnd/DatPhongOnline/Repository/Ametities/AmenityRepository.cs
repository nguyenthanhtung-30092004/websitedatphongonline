using DatPhongOnline.Data;
using DatPhongOnline.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace DatPhongOnline.Repository.Ametities
{
    public class AmenityRepository : IAmenityRepository
    {
        private AppDbContext context;

        public AmenityRepository(AppDbContext context) {
            this.context = context;
        }

        public async Task<List<Amenity>> GetAllAsync()
        {
            return await context.Amenities.ToListAsync();
        }

        public async Task<Amenity?> GetByIdAsync(int id)
        {
            return await context.Amenities.FindAsync(id);
        }

        public async Task AddAsync(Amenity amenity)
        {
            await context.Amenities.AddAsync(amenity);
            await context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Amenity amenity)
        {
            context.Amenities.Update(amenity);
            await context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var amenity = await context.Amenities.FindAsync(id);
            if (amenity == null) return;
            context.Amenities.Remove(amenity);
            await context.SaveChangesAsync();
        }

        public async Task<bool> ExistsAsync(int id)
        {
            return await context.Amenities.AnyAsync(a => a.Id == id);
        }
    }
}
