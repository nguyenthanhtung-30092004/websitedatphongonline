using DatPhongOnline.Dtos.Auth;
using DatPhongOnline.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DatPhongOnline.Controllers.Auth
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IAuthService _authService;
        public UserController(IAuthService authService) {
            _authService = authService;
        }



        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, UpdateUserDto dto)
        {
            await _authService.UpdateAsync(id, dto);
            return Ok("Cập nhật thành công");
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}/activate")]
        public async Task<IActionResult> SetActivate(int id)
        {
            await _authService.ActivateAsync(id);
            return Ok("Kích hoạt thành công");
        }

        [HttpPut("{id}/deactivate")]
        public async Task<IActionResult> SetDeActivate(int id)
        {
            await _authService.DeactivateAsync(id);
            return Ok("Khóa tài khỏan thành công");
        }

        [HttpGet]
        public async Task<IActionResult> GetUsers (
            [FromQuery] bool? isLocked, [FromQuery] string? role)
        {
            var result = await _authService.GetFilteredAsync(new FilterUserDto
            {
                IsLocked = isLocked,
                Role = role
            });
            return Ok(result);
        }
    }
}
