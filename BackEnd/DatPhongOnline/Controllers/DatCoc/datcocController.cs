using DatPhongOnline.Data.Entities;
using DatPhongOnline.Dtos.Datcoc;
using DatPhongOnline.Services.DatCocService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace DatPhongOnline.Controllers.DatCoc
{
    [Route("api/[controller]")]
    [ApiController]
    public class datcocController : ControllerBase
    {
        private readonly IDatCocService _service;

        public datcocController(IDatCocService service)
        {
            _service = service;
        }
        [Authorize]
        [HttpPost]
        public async Task<IActionResult> TaoDatCoc(TaoDatCocDto dto)
        {
            int userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            string url = await _service.TaoDatCocAsync(userId, dto);
            return Ok(new { urlThanhToan = url });
        }

        [HttpGet("vnpay-return")]
        public async Task<IActionResult> VNPayReturn()
        {
            await _service.XuLyKetQuaVNPayAsync(Request.Query);
            return Ok("Thanh toan thanh cong");
        }

        [HttpGet("booking/{bookingId}")]
        public async Task<IActionResult> LayTheoBooking(int bookingId)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
                return Unauthorized("Token không hợp lệ");

            int userId = int.Parse(userIdClaim.Value);
            var datCoc = await _service
                .LayDatCocTheoBookingAsync(bookingId, userId);

            if (datCoc == null)
                return NotFound("Không tìm thấy giao dịch");

            return Ok(new
            {
                datCoc.Id,
                datCoc.BookingId,
                datCoc.SoTienDatCoc,
                TrangThai = datCoc.TrangThai.ToString(),
                datCoc.ThoiGianThanhToan,
                datCoc.MaGiaoDichVNPay
            });

        }
    }
}
