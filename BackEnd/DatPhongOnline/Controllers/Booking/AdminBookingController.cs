using DatPhongOnline.Dtos.Booking;
using DatPhongOnline.Services.BookingService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace DatPhongOnline.Controllers.Booking
{
    [Route("api/admin/booking")]
    [ApiController]
    public class AdminBookingController : ControllerBase
    {
        private readonly IBookingService _service;

        public AdminBookingController(IBookingService service)
        {
            this._service = service;
        }
        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var result = await _service.GetAllBookAsync();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        [Authorize(Roles = "Admin")]
        [HttpPatch("{id}/pending")]
        public async Task<IActionResult> Pending(int id)
        {
            try
            {
                await _service.AdminUpdateStatusAsync(id, Data.Entities.BookingStatus.Pending);
                return Ok(new { message = "Chờ xác nhận đặt phòng" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        [Authorize(Roles = "Admin")]
        [HttpPatch("{id}/cancel")]
        public async Task<IActionResult> Cancel(int id)
        {
            try
            {
                await _service.AdminUpdateStatusAsync(id, Data.Entities.BookingStatus.Canceled);
                return Ok(new { message = "Hủy đặt phòng thành công" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        [Authorize(Roles = "Admin")]
        [HttpPatch("{id}/confirm")]
        public async Task<IActionResult> Confirm(int id)
        {
            try
            {
                await _service.AdminUpdateStatusAsync(id, Data.Entities.BookingStatus.Confirmed);
                return Ok(new { message = "Xác nhận đặt phòng thành công" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        [Authorize(Roles = "Admin")]
        [HttpPatch("{id}/complete")]
        public async Task<IActionResult> Complete(int id)
        {
            try
            {
                await _service.AdminUpdateStatusAsync(id, Data.Entities.BookingStatus.Completed);
                return Ok(new { message = "Hoàn tất đặt phòng" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("matrix")]
        public async Task<ActionResult<List<RoomMatrixDto>>> GetMatrix([FromQuery] DateTime start, [FromQuery] DateTime end)
        {
            if (start > end) return BadRequest("Ngày bắt đầu phải nhỏ hơn ngày kết thúc.");

            var matrix = await _service.GetRoomMatrixAsync(start, end);
            return Ok(matrix);
        }
    }
}
