using DatPhongOnline.Dtos.Amenity;
using DatPhongOnline.Dtos.RoomType;
using DatPhongOnline.Repository.Ametities;

namespace DatPhongOnline.Services.AmenityService
{
    public class AmenityService : IAmenityService
    {
        private readonly IAmenityRepository _repository;

        public AmenityService(IAmenityRepository repository)
        {
            _repository = repository;
        }
        public async Task<List<AmenityDto>> GetAllAsync()
        {
            var data = await _repository.GetAllAsync();
            return data.Select(rt => new AmenityDto
            {
                Id = rt.Id,
                Name = rt.Name,
                Icon = rt.Icon,
            }).ToList();
        }

        public async Task<AmenityDto?> GetByIdAsync(int id)
        {
            var amenity = await _repository.GetByIdAsync(id);
            if (amenity == null) return null;
            return new AmenityDto
            {
                Id = amenity.Id,
                Name = amenity.Name,
                Icon = amenity.Icon,
            };
        }

        public async Task CreateAsync(CreateAmenityDto dto)
        {
            var amenity = new Data.Entities.Amenity
            {
                Name = dto.Name,
                Icon = dto.Icon,
            };
            await _repository.AddAsync(amenity);
        }

        public async Task<bool> UpdateAsync(int id, UpdateAmenityDto dto)
        {
            var amenity = await _repository.GetByIdAsync(id);
            if (amenity == null) return false;
            amenity.Name = dto.Name;
            amenity.Icon = dto.Icon;
            await _repository.UpdateAsync(amenity);
            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var exists = await _repository.ExistsAsync(id);
            if (!exists) return false;
            await _repository.DeleteAsync(id);
            return true;
        }
    }
}
