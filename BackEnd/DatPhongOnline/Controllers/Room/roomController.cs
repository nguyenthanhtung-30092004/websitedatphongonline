using CloudinaryDotNet.Actions;
using DatPhongOnline.Dtos.Room;
using DatPhongOnline.Services.RoomSerive;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace DatPhongOnline.Controllers.Room
{
    [Route("api/[controller]")]
    [ApiController]
    public class roomController : ControllerBase
    {
        private readonly IRoomService _service;
        public roomController(IRoomService service)
        {
            _service = service;
        }
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var data = await _service.GetAllAsync();
            return Ok(data);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            return Ok(await _service.GetByIdAsync(id));
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> Create([FromForm] CreateRoomDto dto)
        {
            await _service.CreateAsync(dto);
            return Ok("Created Successfully!");
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromForm] UpdateRoomDto dto)
        {
            await _service.UpdateAsync(id, dto);
            return Ok("Updated Successfully!");
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _service.DeleteAsync(id);
            return Ok("Deleted Successfull!");
        }
    }
}
