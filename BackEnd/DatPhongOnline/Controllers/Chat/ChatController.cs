using DatPhongOnline.Dtos.ChatMessage;
using DatPhongOnline.Services.ChatService;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace DatPhongOnline.Controllers.Chat
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChatController : ControllerBase
    {
        private readonly IChatService _chatService;
        public ChatController(IChatService chatService) => _chatService = chatService;

        [HttpPost("send")]
        public async Task<IActionResult> SendMessage([FromBody] ChatMessageDto dto)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
                return Unauthorized("Token không hợp lệ");

            int userId = int.Parse(userIdClaim.Value);
            var reply = await _chatService.ProcessChatAsync(userId, dto);
            return Ok(new { reply });
        }
    }
}
