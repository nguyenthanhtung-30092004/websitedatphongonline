using DatPhongOnline.Data.Entities;
using DatPhongOnline.Dtos.Auth;
using DatPhongOnline.Helpers;
using DatPhongOnline.Repository.Users;
using DatPhongOnline.Services;
using DatPhongOnline.Services.Auth;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;


namespace DatPhongOnline.Controllers.Auth
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService authService;
        private readonly JwtService _service;
        private readonly IUserRepository repo;

        public AuthController(IAuthService authService, JwtService service, IUserRepository repo)
        {
            this.authService = authService;
            _service = service;
            this.repo = repo;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterRequestDto dto)
        {
            return Ok(await authService.RegisterAsync(dto));
        }


        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginRequestDto dto)
        {
            try
            {

                var result = await authService.LoginAsync(dto);

                Response.Cookies.Append("jwt", result.Token, new CookieOptions
                {
                    HttpOnly = true,
                    Secure = false,
                    SameSite = SameSiteMode.Lax,
                    Path = "/"
                });

                return Ok(result);
            }
            catch (UnauthorizedAccessException ex)

            {
                return Unauthorized(new { message = ex.Message });
            }

        }

        [HttpGet("me")]
        public async Task<IActionResult> GetUser()
        {
            var token = Request.Cookies["jwt"];
            if (string.IsNullOrEmpty(token))
                return Unauthorized();

            var user = await authService.GetCurrentUserAsync(token);
            return Ok(user);
        }

        [HttpPost("logout")]
        public IActionResult Logout()
        {
            Response.Cookies.Delete("jwt");
            return Ok(new { message = "Đăng xuất thành công" });
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword(ForgotPasswordDto dto)
        {
            await authService.ForgotPasswordAsync(dto.Email);
            return Ok("Đã gửi mã xác nhận về email");
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword(ResetPasswordDto dto)
        {
            await authService.ResetPasswordAsync(dto);
            return Ok("Đổi mật khẩu thành công");
        }

        [HttpPost("google-login")]
        public async Task<IActionResult> GoogleLogin(GoogleLoginDto dto, [FromServices] IAuthService authService 
            )
        {
            try
            {
                var result = await authService.GoogleLoginAsync(dto.IdToken);
                Response.Cookies.Append("jwt", result.Token, new CookieOptions
                {
                    HttpOnly = true,
                    Secure = false,
                    SameSite = SameSiteMode.Lax,
                    Path = "/"
                });

                return Ok(result);
            }
            catch(UnauthorizedAccessException ex)
            {
                return Unauthorized(new
                {
                    message = ex.Message,
                });
            }
        }

    }
}
