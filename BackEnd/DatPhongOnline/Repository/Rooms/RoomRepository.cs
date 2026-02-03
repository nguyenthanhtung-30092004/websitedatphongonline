using DatPhongOnline.Data;
using DatPhongOnline.Data.Entities;
using DatPhongOnline.Dtos.Booking;
using DatPhongOnline.Dtos.Room;
using Microsoft.EntityFrameworkCore;
using System.Runtime.CompilerServices;

namespace DatPhongOnline.Repository.Rooms
{
    public class RoomRepository : IRoomRepository
    {
        private readonly AppDbContext _context;
        public RoomRepository(AppDbContext context)
        {
            _context = context;
        }
        public async Task<List<Room>> GetAllAsync()
        {
            return await _context.Rooms
                .Include(r => r.RoomType)
                .Include(r => r.RoomImages)
                .Include(r => r.RoomAmenities)
                    .ThenInclude(ra => ra.Amenity)
                .ToListAsync();
        }

        public async Task<Room?> GetByIdAsync(int id)
        {
            return await _context.Rooms
                .Include(r => r.RoomType)
                .Include(r => r.RoomImages)
                .Include(r => r.RoomAmenities)
                .ThenInclude(ra => ra.Amenity)
                .FirstOrDefaultAsync(r => r.Id == id);
        }

        public async Task AddAsync(Room room)
        {
            _context.Rooms.Add(room);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Room room)
        {
            _context.Rooms.Update(room);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var room = await _context.Rooms.FindAsync(id);
            if (room == null) return;
            _context.Remove(room);
            await _context.SaveChangesAsync();
        }

        public async Task AddImagesAsync(List<RoomImage> images)
        {
            _context.RoomImages.AddRange(images);
            await _context.SaveChangesAsync();
        }


        public async Task<Room?> GetRoomForUpdateAsync(int id)
        {
            return await _context.Rooms
                .FirstOrDefaultAsync(r => r.Id == id);
        }

        public async Task<List<RoomImage>> GetImagesByRoomIdAsync(int roomId)
        {
            var data = await _context.RoomImages
                .Where(x => x.RoomId == roomId)
                .ToListAsync();
            if (data == null) return null;
            return data;
        }

        public async Task RemoveImagesAsync(int id)
        {
            var images = await _context.RoomImages.Where(x => x.RoomId == id).ToListAsync();
            _context.RoomImages.RemoveRange(images);
            await _context.SaveChangesAsync();
        }

        public async Task ReplaceAmenitiesAsync(int roomId, List<int> amenityIds)
        {
            var old = _context.RoomAmenities.Where(x => x.RoomId == roomId);
            _context.RoomAmenities.RemoveRange(old);

            var news = amenityIds.Select(id => new RoomAmenity
            {
                RoomId = roomId,
                AmenityId = id
            });

            _context.RoomAmenities.AddRange(news);
            await _context.SaveChangesAsync();
        }
    }
}
