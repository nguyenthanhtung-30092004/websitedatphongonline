namespace DatPhongOnline.Services.CloudinaryService
{
    public interface ICloudinaryService
    {
        Task<(string Url, string PublicId)> UploadRoomImageAsync(IFormFile file);
        Task DeleteImageAsync(string publicId);
    }
}
