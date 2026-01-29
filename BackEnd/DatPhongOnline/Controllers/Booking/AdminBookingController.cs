using DatPhongOnline.Services.BookingService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace DatPhongOnline.Controllers.Booking
{
    [Route("api/admin/booking")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class AdminBookingController : ControllerBase
    {
        private readonly IBookingService _service;

        public AdminBookingController(IBookingService service)
        {
            this._service = service;
        }

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
    }
}
