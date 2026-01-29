using DatPhongOnline.Dtos.RoomType;
using DatPhongOnline.Repository.RoomTypes;

namespace DatPhongOnline.Services.RoomType
{
    public class RoomTypeService : IRoomTypeService
    {
        private readonly IRoomTypeRepository _roomTypeRepository;
        public RoomTypeService(IRoomTypeRepository roomTypeRepository)
        {
            _roomTypeRepository = roomTypeRepository;
        }
        public async Task<List<RoomTypeDto>> GetAllAsync()
        {
            var data = await _roomTypeRepository.GetAllAsync();
            return data.Select(rt => new RoomTypeDto
            {
                Id = rt.Id,
                Name = rt.Name,
                MaxGuests = rt.MaxGuests,
                Description = rt.Description
            }).ToList();
        }

        public async Task<RoomTypeDto?> GetByIdAsync(int id)
        {
            var roomType = await _roomTypeRepository.GetByIdAsync(id);
            if(roomType == null)
            {
                return null;
            }
            return new RoomTypeDto
            {
                Id = roomType.Id,
                Name = roomType.Name,
                MaxGuests = roomType.MaxGuests,
                Description = roomType.Description
            };
        }

        public async Task CreateAsync(CreateRoomTypeDto dto)
        {
            var roomType = new Data.Entities.RoomType
            {
                Name = dto.Name,
                MaxGuests = dto.MaxGuests,
                Description = dto.Description
            };
            await _roomTypeRepository.AddAsync(roomType);
        }
        public async Task<bool> UpdateAsync(int id, UpdateRoomTypeDto dto)
        {
            var roomType = await _roomTypeRepository.GetByIdAsync(id);
            if (roomType == null)
            {
                return false;
            }
            roomType.Name = dto.Name;
            roomType.MaxGuests = dto.MaxGuests;
            roomType.Description = dto.Description;
            await _roomTypeRepository.UpdateAsync(roomType);
            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var roomType = await _roomTypeRepository.ExistsAsync(id);
            if (!roomType)
            {
                return false;
            }
            await _roomTypeRepository.DeleteAsync(id);
            return true;
        }


    }
}
