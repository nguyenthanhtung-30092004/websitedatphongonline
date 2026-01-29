using DatPhongOnline.Dtos.Amenity;
using DatPhongOnline.Services.AmenityService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace DatPhongOnline.Controllers.Amenity
{
    [Route("api/[controller]")]
    [ApiController]
    public class amenityController : ControllerBase
    {
        private readonly IAmenityService _amenityService;
        public amenityController(IAmenityService amenityService)
        {
            _amenityService = amenityService;
        }

        [HttpGet]
        public async Task<IActionResult> Get() {
            var data = await _amenityService.GetAllAsync();
            return Ok(data);  
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var amenity = await _amenityService.GetByIdAsync(id);
            if(amenity == null)
            {
                return NotFound();
            }
            return Ok(amenity);
        }

        [Authorize(Roles ="Admin")]
        [HttpPost]
        public async Task<IActionResult> Create(CreateAmenityDto dto)
        {
            await _amenityService.CreateAsync(dto);
            return Ok("Created successfully ");
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id,UpdateAmenityDto dto) { 
            await _amenityService.UpdateAsync(id, dto);
            return Ok("Updated successfully");
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id) { 
            await _amenityService.DeleteAsync(id);
            return Ok("Deleted successfully");
        }

    }
}
