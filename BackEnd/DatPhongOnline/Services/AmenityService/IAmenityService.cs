using DatPhongOnline.Dtos.Amenity;

namespace DatPhongOnline.Services.AmenityService
{
    public interface IAmenityService
    {
        public Task<List<AmenityDto>> GetAllAsync();
        public Task<AmenityDto?> GetByIdAsync(int id);
        public Task CreateAsync(CreateAmenityDto createAmenityDto);
        public Task<bool> UpdateAsync(int id, UpdateAmenityDto updateAmenityDto);
        public Task<bool> DeleteAsync(int id);
    }
}
