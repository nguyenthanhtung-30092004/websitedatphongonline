using DatPhongOnline.Dtos.RoomType;
using DatPhongOnline.Services.RoomType;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace DatPhongOnline.Controllers.RoomType
{
    [Route("api/[controller]")]
    [ApiController]
    public class roomtypeController : ControllerBase
    {
        private readonly IRoomTypeService _roomTypeService;
        public roomtypeController(IRoomTypeService roomTypeService)
        {
            _roomTypeService = roomTypeService;
        }
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
           var data = await _roomTypeService.GetAllAsync();
           return Ok(data);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var data = await _roomTypeService.GetByIdAsync(id);
            if(data == null)
            {
                return NotFound();
            }
            return Ok(data);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> Create(CreateRoomTypeDto dto)
        {
            await _roomTypeService.CreateAsync(dto);
            return Ok("Created successfully");
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, UpdateRoomTypeDto dto)
        {
            await _roomTypeService.UpdateAsync(id,dto);
            return Ok("Updated successfully");
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _roomTypeService.DeleteAsync(id);
            return Ok("Deleted successfully");
        }
    }
}
