using Azure;
using BCrypt.Net;
using DatPhongOnline.Data.Entities;
using DatPhongOnline.Dtos.Auth;
using DatPhongOnline.Helpers;
using DatPhongOnline.Repository.Users;
using Google.Apis.Auth;
using System.IdentityModel.Tokens.Jwt;

namespace DatPhongOnline.Services.Auth
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepo;

        private readonly JwtService _jwtService;
        private readonly SendEmailService sendEmailService;
        private readonly IConfiguration config;

        public AuthService(IUserRepository userRepo,IConfiguration config, JwtService jwtService, SendEmailService sendEmailService)
        {
            _userRepo = userRepo;
            _jwtService = jwtService;
            this.sendEmailService = sendEmailService;
            this.config = config;
        }

        // Dành cho Admin

        public async Task<List<UserDto>> GetAllAsync()
        {
            var data = await _userRepo.GetAllAsync();
            return data.Select(r => new UserDto
            {
                Id = r.Id,
                Email= r.Email,
                FullName= r.FullName,
                Phone = r.Phone,
                IsLocked = r.IsLocked,
                Role = r.Role,
                ResetCodeExpired = r.ResetCodeExpired,
            }).ToList();
        }

        public async Task<bool> UpdateAsync(int id, UpdateUserDto dto)
        {
            var user = await _userRepo.GetByIdAsync(id);
            if (user == null) return false;

            if (!string.IsNullOrEmpty(dto.FullName))
                user.FullName = dto.FullName;

            if (!string.IsNullOrEmpty(dto.Phone))
                user.Phone = dto.Phone;

            if (!string.IsNullOrEmpty(dto.Role))
                user.Role = dto.Role;

            await _userRepo.UpdateAsync(user);
            return true;
        }

        public async Task<bool> ActivateAsync(int id)
        {
            await _userRepo.SetLockedAsync(id, false);
            return true;
        }
        public async Task<bool> DeactivateAsync(int id)
        {
            await _userRepo.SetLockedAsync(id, true);
            return true;
        }

        public async Task<List<UserDto>> GetFilteredAsync(FilterUserDto filter)
        {
            var users = await _userRepo.GetFilteredAsync(
                filter.IsLocked, filter.Role);

            return users.Select(u => new UserDto
            {
                Id = u.Id,
                FullName = u.FullName,
                Email = u.Email,
                Phone = u.Phone,
                Role = u.Role,
                IsLocked = u.IsLocked,
            }).ToList();
        }

        public async Task<UserDto?> GetByIdAsync(int id)
        {
            var user = await _userRepo.GetByIdAsync(id);
            if(user == null) { return null; }
            if(user.IsLocked == true ) { return null; }

            return new UserDto
            {
                FullName = user.FullName,
                Email = user.Email,
                Phone = user.Phone,
                IsLocked = user.IsLocked,
            };
        }

        public async Task<UserDto?> GetByEmailAsync(string email)
        {
            var user = await _userRepo.GetByEmailAsync(email);
            if (user == null) { return null; }
            if (user.IsLocked == true) return null;
            return new UserDto
            {
                FullName = user.FullName,
                Email = user.Email,
                Phone = user.Phone,
                IsLocked = user.IsLocked,
            };
        }


        // Dánh cho user
        public async Task<User> RegisterAsync(RegisterRequestDto dto)
        {
            var userCheck = await _userRepo.ExistsByEmailAsync(dto.Email);
            if (userCheck != null)
            {
                throw new BadHttpRequestException("Email already exists!");
            }

            var user = new User
            {
                FullName = dto.FullName,
                Email = dto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                Phone = dto.Phone,
                Role = "User"
            };
            await _userRepo.AddAsync(user);
            return user;

        }

        public async Task<AuthResponseDto> LoginAsync(LoginRequestDto dto)
        {
            var user = await _userRepo.GetByEmailAsync(dto.Email)
             ?? throw new UnauthorizedAccessException("Email hoặc mật khẩu không đúng");

            if (user.IsLocked)
                throw new UnauthorizedAccessException("Tài khoản đã bị khóa");

            if (!BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
                throw new UnauthorizedAccessException("Email hoặc mật khẩu không đúng");
            var token = _jwtService.Generate(user.Id, user.Role);
            return new AuthResponseDto
            {
                Token = token,
                User = new UserDto
                {
                    FullName = user.FullName,
                    Email = user.Email,
                    Phone = user.Phone,
                    Role = user.Role
                }
            };
        }

        public async Task<UserDto> GetCurrentUserAsync(string token)
        {
            var princial = _jwtService.Verify(token)
                ?? throw new UnauthorizedAccessException("Token không hợp lệ");

            var userId = int.Parse(
                princial.Claims.First(c => c.Type == JwtRegisteredClaimNames.Sub).Value);

            var user = await _userRepo.GetByIdAsync(userId)
                ?? throw new UnauthorizedAccessException("User không tồn tại");
            return new UserDto
            {
                FullName = user.FullName
               ,
                Email = user.Email,
                Phone = user.Phone,
                Role = user.Role,
                IsLocked = user.IsLocked,
            };
        }

        public async Task<bool> ForgotPasswordAsync(string email)
        {
            var user = await _userRepo.GetByEmailAsync(email);
            if(user == null)
            {
                return false;
            }
            var code = new Random().Next(100000, 999999).ToString();
            user.ResetCode = code;
            user.ResetCodeExpired = DateTime.UtcNow.AddMinutes(5);
            await _userRepo.UpdateAsync(user);
            await sendEmailService.SendAsync(email, "Mã xác nhận đặt lại mật khẩu", $"Mã OTP của bạn là: {code} (hết hạn sau 5 phút)");
            return true;
        }
        public async Task<bool> ResetPasswordAsync(ResetPasswordDto dto)
        {
            var user = await _userRepo.GetByEmailAsync(dto.Email)
                ?? throw new UnauthorizedAccessException("Email không tồn tại");
            Console.WriteLine(user.ResetCode);
            Console.WriteLine(user);
            if (user.ResetCode != dto.Code || user.ResetCodeExpired < DateTime.UtcNow)
                throw new UnauthorizedAccessException("Mã xác nhận không hợp lệ");

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
            user.ResetCode = null;
            user.ResetCodeExpired = null;

            await _userRepo.UpdateAsync(user);
            return true;
        }

        public async Task<AuthResponseDto> GoogleLoginAsync(string idToken)
        {
            var payload = await GoogleJsonWebSignature.ValidateAsync(
                idToken, new GoogleJsonWebSignature.ValidationSettings
                {
                    Audience = new[] { config["GoogleAuth:ClientId"] }
                });

            var user = await _userRepo.GetByEmailAsync(payload.Email);

            if(user == null)
            {
                user = new User
                {
                    Email = payload.Email,
                    FullName = payload.Name,
                    Role = "User",
                    IsLocked = false,
                    PasswordHash = null
                };

                await _userRepo.AddAsync(user);
            }

            if (user.IsLocked)
                throw new UnauthorizedAccessException("Tài khoản đã bị khóa");

            var token = _jwtService.Generate(user.Id, user.Role);

            return new AuthResponseDto
            {
                Token = token,
                User = new UserDto
                {
                    Email = user.Email,
                    FullName = user.FullName,
                    Role = user.Role
                }
            };
        }
    }
}
