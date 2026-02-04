using DatPhongOnline.Data.Entities;
using DatPhongOnline.Dtos.ChatMessage;
using DatPhongOnline.Repository.Bookings;
using DatPhongOnline.Repository.ChatMessages;
using DatPhongOnline.Repository.Rooms;
using DatPhongOnline.Services.AI;
using Newtonsoft.Json;
using System.Net.Http;
using System.Text;

namespace DatPhongOnline.Services.ChatService
{
    public class ChatService : IChatService
    {
        private readonly IChatRepository _chatRepo;
        private readonly IRoomRepository _roomRepo;
        private readonly AiInterpreterService _aiInterpreter;
        private readonly IConfiguration _config;
        private readonly HttpClient _http;
        private readonly IBookingRepository _bookingRepo;

        public ChatService(
    IChatRepository chatRepo,
    IRoomRepository roomRepo,
    IBookingRepository bookingRepo,
    AiInterpreterService aiInterpreter,
    IConfiguration config,
    HttpClient httpClient)
        {
            _chatRepo = chatRepo;
            _roomRepo = roomRepo;
            _bookingRepo = bookingRepo;
            _config = config;
            _http = httpClient;
            _aiInterpreter = aiInterpreter;
        }

        public async Task<string> ProcessChatAsync(int userId, ChatMessageDto chatDto)
        {
            // 1. Save user message
            await _chatRepo.SaveMessageAsync(new ChatMessage
            {
                UserId = userId,
                Content = chatDto.Content,
                Role = "user"
            });

            var parsed = await _aiInterpreter.ParseIntentAsync(chatDto.Content);

            if (parsed?.Intent == "list_room")
            {
                var rooms = await _roomRepo.GetAllAsync();

                if (!rooms.Any())
                    return await SaveBotReply(userId, "Hiện tại khách sạn chưa có phòng nào.");

                var list = string.Join("\n",
                    rooms.Select(r =>
                        $"- {r.RoomName} ({r.RoomType.Name}) – {r.BasePrice:N0}đ"));

                var reply = $@"
Dạ, hiện tại khách sạn có các phòng sau:

{list}

Bạn muốn xem chi tiết hoặc đặt phòng nào không ạ?
";

                return await SaveBotReply(userId, reply);
            }


            // ===== CASE: CHECK AVAILABILITY =====
            if (parsed?.Intent == "check_availability"
                && parsed.CheckIn.HasValue
                && parsed.CheckOut.HasValue)
            {
                int guests = 2;

                var availableRooms =
                    await _bookingRepo.SearchAvailableRoomsAsync(
                        parsed.CheckIn.Value,
                        parsed.CheckOut.Value,
                        guests
                    );

                string reply;

                if (!availableRooms.Any())
                {
                    reply = $"Rất tiếc 😔 từ {parsed.CheckIn:dd/MM/yyyy} đến {parsed.CheckOut:dd/MM/yyyy} hiện không còn phòng trống.";
                }
                else
                {
                    var list = string.Join("\n",
                        availableRooms.Select(r =>
                            $"- {r.RoomName} ({r.RoomType.Name}) – {r.BasePrice:N0}đ"));

                    reply = $@"
Từ {parsed.CheckIn:dd/MM/yyyy} đến {parsed.CheckOut:dd/MM/yyyy}, khách sạn còn các phòng sau:

{list}

Bạn muốn đặt loại phòng nào để mình hỗ trợ tiếp không ạ?";
                }

                await _chatRepo.SaveMessageAsync(new ChatMessage
                {
                    UserId = userId,
                    Role = "bot",
                    Content = reply
                });

                return reply;
            }

            // ===== FALLBACK: các câu hỏi khác =====
            string fallbackReply = await CallGroqAsync($@"
Khách nói:
""{chatDto.Content}""

Hãy trả lời thân thiện như lễ tân khách sạn.
");

            await _chatRepo.SaveMessageAsync(new ChatMessage
            {
                UserId = userId,
                Role = "bot",
                Content = fallbackReply
            });

            return fallbackReply;
        }



        // ================= HANDLERS =================

        private async Task<string> HandleRoomInfoAsync()
        {
            var rooms = await _roomRepo.GetAllAsync();

            var roomList = string.Join("\n",
                rooms.Select(r => $"- {r.RoomName}: {r.BasePrice:N0}đ"));

            return await CallGroqAsync($@"
Danh sách phòng:
{roomList}

Hãy trả lời khách một cách tự nhiên, thân thiện như lễ tân khách sạn.
");
        }

        private async Task<string> HandleCheckAvailabilityAsync(
            DateTime? checkIn, DateTime? checkOut)
        {
            if (checkIn == null || checkOut == null)
                return "Bạn vui lòng cho tôi biết ngày nhận và trả phòng để kiểm tra chính xác nhé.";

            // (ở đây sau này bạn gắn logic check booking thật)
            return $"Tôi sẽ kiểm tra tình trạng phòng từ {checkIn:dd/MM/yyyy} đến {checkOut:dd/MM/yyyy} cho bạn ngay.";
        }

        // ================= AI CALL =================

        private async Task<string> CallGroqAsync(string prompt)
        {
            var body = new
            {
                model = _config["Groq:Model"],
                temperature = 0.4,
                messages = new[]
                {
                    new { role = "system", content = "Bạn là lễ tân khách sạn chuyên nghiệp." },
                    new { role = "user", content = prompt }
                }
            };

            var req = new HttpRequestMessage(
                HttpMethod.Post,
                "https://api.groq.com/openai/v1/chat/completions");

            req.Headers.Authorization =
                new System.Net.Http.Headers.AuthenticationHeaderValue(
                    "Bearer", _config["Groq:ApiKey"]);

            req.Content = new StringContent(
                JsonConvert.SerializeObject(body),
                Encoding.UTF8,
                "application/json");

            var res = await _http.SendAsync(req);
            var text = await res.Content.ReadAsStringAsync();

            dynamic json = JsonConvert.DeserializeObject(text)!;
            return json.choices[0].message.content;
        }

        private async Task<string> SaveBotReply(int userId, string reply)
        {
            await _chatRepo.SaveMessageAsync(new ChatMessage
            {
                UserId = userId,
                Content = reply,
                Role = "bot"
            });

            return reply;
        }
    }
}
