using DatPhongOnline.Data.Entities;

namespace DatPhongOnline.Repository.Rooms
{
    public interface IRoomRepository
    {
        Task<List<Room>> GetAllAsync();
        Task<Room?> GetByIdAsync(int id);
        Task AddAsync(Room room);
        Task UpdateAsync(Room room);
        Task DeleteAsync(int id);

        Task AddImagesAsync(List<RoomImage> images);
        Task<Room> GetRoomForUpdateAsync(int id);
        Task<List<RoomImage>> GetImagesByRoomIdAsync(int roomId);
        Task RemoveImagesAsync(int id);
        Task ReplaceAmenitiesAsync(int roomId, List<int> amenityIds);
    }
}
