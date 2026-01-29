using DatPhongOnline.Data.Entities;
using DatPhongOnline.Dtos.Auth;
namespace DatPhongOnline.Services
{
    public interface IAuthService
    {
        Task<UserDto> GetCurrentUserAsync(string token);
        Task<UserDto?> GetByIdAsync(int id);
        Task<UserDto?> GetByEmailAsync(string email);
        Task<List<UserDto>> GetAllAsync();
        Task<bool> UpdateAsync(int id, UpdateUserDto dto);
        Task<bool> ActivateAsync(int id);
        Task<bool> DeactivateAsync(int id);
        Task<List<UserDto>> GetFilteredAsync(FilterUserDto filter);


        Task<User> RegisterAsync(RegisterRequestDto registerRequestDto);
        Task<AuthResponseDto> LoginAsync(LoginRequestDto dto);
        Task<bool> ForgotPasswordAsync(string email);
        Task<bool> ResetPasswordAsync(ResetPasswordDto dto);
        Task<AuthResponseDto> GoogleLoginAsync(string idToken);
    }
}
