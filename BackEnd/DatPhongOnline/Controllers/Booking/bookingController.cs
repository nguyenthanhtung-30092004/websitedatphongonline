using DatPhongOnline.Dtos.Booking;
using DatPhongOnline.Services.BookingService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace DatPhongOnline.Controllers.Booking
{

    [Route("api/[controller]")]
    [ApiController]
    public class bookingController : ControllerBase
    {
        private readonly IBookingService _service;

        public bookingController(IBookingService service)
        {
            _service = service;
        }

        [Authorize(Roles = "User")]
        [HttpPost]
        public async Task<IActionResult> Create(CreateBookingDto dto)
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);

                if (userIdClaim == null)
                    return Unauthorized("Token không chứa userId");

                int userId = int.Parse(userIdClaim.Value);

                var result = await _service.CreateBookingAsync(userId, dto);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPatch("{id}/cancel")]
        public async Task<IActionResult> Cancel(int id)
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);

                if (userIdClaim == null)
                    return Unauthorized("Token không chứa userId");

                int userId = int.Parse(userIdClaim.Value);
                await _service.CancelBooking(id, userId);
                return Ok(new { message = "Hủy thành công" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("my-bookings")]
        public async Task<IActionResult> GetMyBookings()
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);

                if (userIdClaim == null)
                    return Unauthorized("Token không chứa userId");

                int userId = int.Parse(userIdClaim.Value);
                var result = await _service.GetUserBookingsAsync(userId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        [HttpGet("my-bookings/{id:int}")]
        public async Task<IActionResult> GetBookingById([FromRoute] int id)
        {
            var booking = await _service.GetBookingByIdAsync(id);
            return Ok(booking);
        }


        [HttpPost("search-rooms")]
        public async Task<IActionResult> SearchAvailableRooms([FromBody] SearchRoomDto dto)
        {
            try
            {
                var result = await _service.SearchRoomsAsync(dto);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
