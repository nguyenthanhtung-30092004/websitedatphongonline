using DatPhongOnline.Dtos.Room;

namespace DatPhongOnline.Services.RoomSerive
{
    public interface IRoomService
    {
        Task<List<RoomDto>> GetAllAsync();
        Task<RoomDto> GetByIdAsync(int id);
        Task<int> CreateAsync(CreateRoomDto dto);
        Task<bool> UpdateAsync(int id, UpdateRoomDto dto);
        Task<bool> DeleteAsync(int id);
    }
}
