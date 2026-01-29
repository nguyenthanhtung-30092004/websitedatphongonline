using DatPhongOnline.Data.Entities;
using DatPhongOnline.Dtos.Room;
using DatPhongOnline.Repository.Rooms;
using DatPhongOnline.Services.CloudinaryService;

namespace DatPhongOnline.Services.RoomSerive
{
    public class RoomService : IRoomService
    {
        private readonly IRoomRepository _repo;
        private readonly ICloudinaryService _cloudinary;
        public RoomService(IRoomRepository repo, ICloudinaryService cloudinary)
        {
            _repo = repo;
            _cloudinary = cloudinary;
        }

        public async Task<List<RoomDto>> GetAllAsync()
        {
            var data = await _repo.GetAllAsync();
            if (data == null) return null;
            return data.Select(r => new RoomDto
            {
                Id = r.Id,
                RoomName = r.RoomName,
                Address = r.Address,
                BasePrice = r.BasePrice,

                RoomTypeId = r.RoomTypeId,                  
                RoomTypeName = r.RoomType?.Name,            

                ImageUrls = r.RoomImages?
                    .Select(img => img.ImageUrl)
                    .ToList() ?? new(),

                Amenities = r.RoomAmenities?
                    .Select(a => a.Amenity.Name)
                    .ToList() ?? new()
            }).ToList();
        }
        public async Task<RoomDto?> GetByIdAsync(int id)
        {
            var room = await _repo.GetByIdAsync(id);
            if (room == null) return null;

            return new RoomDto
            {
                Id = room.Id,
                RoomName = room.RoomName,
                Address = room.Address,
                BasePrice = room.BasePrice,

                ImageUrls = room.RoomImages
                    .Select(img => img.ImageUrl)
                    .ToList(),

                Amenities = room.RoomAmenities
                    .Select(a => a.Amenity.Name)
                    .ToList()
            };
        }

        public async Task<int> CreateAsync(CreateRoomDto dto)
        {
            var room = new Room
            {
                RoomName = dto.RoomName,
                Address = dto.Address,
                BasePrice = dto.BasePrice,
                RoomTypeId = dto.RoomTypeId
            };
            await _repo.AddAsync(room);
            if(dto.Images != null)
            {
                var images = new List<RoomImage>();
                foreach(var file in dto.Images){
                    var (url, publicId) = await _cloudinary.UploadRoomImageAsync(file);
                    images.Add(new RoomImage { RoomId = room.Id, ImageUrl = url, PublicId = publicId });
                }

                await _repo.AddImagesAsync(images);
            }
            if(dto.AmenityIds != null)
            {
                await _repo.ReplaceAmenitiesAsync(room.Id, dto.AmenityIds);
            }
            return room.Id;
        }
        public async Task<bool> UpdateAsync(int id, UpdateRoomDto dto)
        {
            var room = await _repo.GetRoomForUpdateAsync(id);
            if (room == null) return false;

            if (dto.Images != null && dto.Images.Any())
            {
                var oldImages = await _repo.GetImagesByRoomIdAsync(id);

                foreach (var img in oldImages)
                    await _cloudinary.DeleteImageAsync(img.PublicId);

                await _repo.RemoveImagesAsync(id);

                var newImages = new List<RoomImage>();

                foreach (var file in dto.Images)
                {
                    var (url, publicId) = await _cloudinary.UploadRoomImageAsync(file);
                    newImages.Add(new RoomImage
                    {
                        RoomId = id,
                        ImageUrl = url,
                        PublicId = publicId
                    });
                }

                await _repo.AddImagesAsync(newImages);
            }
            if (!string.IsNullOrEmpty(dto.RoomName))
                room.RoomName = dto.RoomName;

            if (dto.Address != null)
                room.Address = dto.Address;

            if (dto.BasePrice > 0)
                room.BasePrice = dto.BasePrice;

            room.RoomTypeId = dto.RoomTypeId; 
            await _repo.UpdateAsync(room);

            if (dto.AmenityIds != null)
            {
                await _repo.ReplaceAmenitiesAsync(id, dto.AmenityIds);
            }

            return true;
        }
        public async Task<bool> DeleteAsync(int id)
        {
            var room = await _repo.GetByIdAsync(id);
            if (room == null) return false;
            foreach(var img in room.RoomImages)
            {
                await _cloudinary.DeleteImageAsync(img.PublicId);
            }
            await _repo.DeleteAsync(id);
            return true;
        }


    }
}
