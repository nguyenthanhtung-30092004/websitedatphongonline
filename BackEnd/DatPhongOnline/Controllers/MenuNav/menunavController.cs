using DatPhongOnline.Dtos.MenuNav;
using DatPhongOnline.Services.MenuNavService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace DatPhongOnline.Controllers.MenuNav
{
    [Route("api/[controller]")]
    [ApiController]
    public class menunavController : ControllerBase
    {
        private readonly IMenuNavService service;
        public menunavController (IMenuNavService menuNavService)
        {
            service = menuNavService;
        }


        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var data = await service.GetAllAsync();
            return Ok(data);
        }

        [Authorize(Roles ="Admin")]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var item = await service.GetByIdAsync(id);
            return Ok(item);
        }


        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> Create(CreateMenuNavDto dto)
        {
            await service.CreateAsync(dto);
            return Ok("Created Successfull!");
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, UpdateMenuNavDto dto)
        {
            await service.UpdateAsync(id,dto);
            return Ok("Updated Successfull!");
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await service.DeleteAsync(id);
            return Ok("Deleted Successfull!");
        }
    }
}
