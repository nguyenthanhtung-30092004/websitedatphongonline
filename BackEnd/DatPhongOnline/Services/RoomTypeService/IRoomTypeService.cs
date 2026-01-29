using DatPhongOnline.Dtos.RoomType;

namespace DatPhongOnline.Services.RoomType
{
    public interface IRoomTypeService
    {
        public Task<List<RoomTypeDto>> GetAllAsync();
        public Task<RoomTypeDto?> GetByIdAsync(int id);
        public Task CreateAsync(CreateRoomTypeDto createRoomTypeDto);
        public Task<bool> UpdateAsync(int id, UpdateRoomTypeDto updateRoomTypeDto);
        public Task<bool> DeleteAsync(int id);
    }
}
