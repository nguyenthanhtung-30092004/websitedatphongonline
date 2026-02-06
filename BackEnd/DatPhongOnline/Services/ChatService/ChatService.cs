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
            // 1. Lưu tin nhắn người dùng
            await _chatRepo.SaveMessageAsync(new ChatMessage { UserId = userId, Content = chatDto.Content, Role = "user" });

            // 2. Phân tích ý định (Intent)
            var parsed = await _aiInterpreter.ParseIntentAsync(chatDto.Content);
            string reply = "";

            // ---------------------------------------------------------
            // KỊCH BẢN A: CHECK PHÒNG TRỐNG (Có ngày cụ thể)
            // ---------------------------------------------------------
            if (parsed?.Intent == "check_availability" && parsed.CheckIn.HasValue && parsed.CheckOut.HasValue)
            {
                var availableRooms = await _bookingRepo.SearchAvailableRoomsAsync(parsed.CheckIn.Value, parsed.CheckOut.Value, 2);

                if (!availableRooms.Any())
                {
                    reply = $"Rất tiếc 😔 từ {parsed.CheckIn:dd/MM} đến {parsed.CheckOut:dd/MM} bên em đã hết phòng.";
                }
                else
                {
                    // Gom dữ liệu CHI TIẾT để AI hiểu
                    var roomData = string.Join("\n", availableRooms.Select(r =>
                        $"- Phòng {r.RoomName} ({r.RoomType.Name}) | Sức chứa: {r.RoomType.MaxGuests} người | Giá: {r.BasePrice:N0}đ | Mô tả: {r.RoomType.Description}"));

                    string prompt = $@"
DỮ LIỆU PHÒNG TRỐNG ({parsed.CheckIn:dd/MM} - {parsed.CheckOut:dd/MM}):
{roomData}

CÂU HỎI CỦA KHÁCH: ""{chatDto.Content}""

NHIỆM VỤ CỦA BẠN (LỄ TÂN):
1. Trả lời câu hỏi dựa trên dữ liệu trên.
2. NẾU KHÁCH HỎI SỐ NGƯỜI (Ví dụ: 'phòng cho 5 người'):
   - Hãy tìm phòng có 'Sức chứa' >= số khách.
   - Nếu không có 1 phòng đủ lớn, hãy gợi ý thuê nhiều phòng (Ví dụ: 'Bạn có thể thuê 2 phòng Deluxe...').
3. NẾU KHÁCH HỎI TIỆN ÍCH (Ví dụ: 'có bồn tắm không'):
   - Đọc kỹ phần 'Mô tả' để trả lời.
4. Trả lời ngắn gọn, có tâm, dùng Emoji 🌸.
";
                    reply = await CallGeminiAsync(prompt);
                }
            }
            // ---------------------------------------------------------
            // KỊCH BẢN B: HỎI THÔNG TIN / GIÁ / SỨC CHỨA (Chưa chốt ngày)
            // ---------------------------------------------------------
            else
            {
                // Lấy danh sách LOẠI PHÒNG (RoomType) đại diện
                var rooms = await _roomRepo.GetAllAsync();
                var distinctTypes = rooms
                    .GroupBy(r => r.RoomType.Name)
                    .Select(g => g.First())
                    .Select(r => $"- Loại: {r.RoomType.Name} | Sức chứa: {r.RoomType.MaxGuests} người | Giá từ: {r.BasePrice:N0}đ | Tiện ích: {r.RoomType.Description}")
                    .ToList();

                var infoData = string.Join("\n", distinctTypes);

                string prompt = $@"
DANH SÁCH LOẠI PHÒNG HIỆN CÓ:
{infoData}

CÂU HỎI CỦA KHÁCH: ""{chatDto.Content}""

NHIỆM VỤ:
1. Tư vấn loại phòng phù hợp nhất.
2. Nếu khách hỏi giá: Báo giá cụ thể.
3. Nếu khách hỏi sức chứa (5-6 người): Kiểm tra 'Sức chứa', nếu không đủ thì tư vấn thuê nhiều phòng.
4. Cuối câu luôn mời khách chọn ngày Check-in để kiểm tra phòng trống chính xác.
";
                reply = await CallGeminiAsync(prompt);
            }

            // 3. Lưu và trả về
            await _chatRepo.SaveMessageAsync(new ChatMessage { UserId = userId, Content = reply, Role = "bot" });
            return reply;
        }




        // ================= HANDLERS =================

        private async Task<string> HandleRoomInfoAsync()
        {
            var rooms = await _roomRepo.GetAllAsync();

            var roomList = string.Join("\n",
                rooms.Select(r => $"- {r.RoomName}: {r.BasePrice:N0}đ"));

            return await CallGeminiAsync($@"
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

        // Thay thế hàm CallGroqAsync cũ bằng hàm này:
        private async Task<string> CallGeminiAsync(string prompt)
        {
            var apiKey = _config["Gemini:ApiKey"];
            var baseUrl = _config["Gemini:Url"];
            // Dùng model flash cho nhanh
            var url = $"{baseUrl}?key={apiKey}";

            var body = new
            {
                contents = new[]
                {
            new
            {
                parts = new[]
                {
                    new { text = "Bạn là lễ tân khách sạn chuyên nghiệp. Trả lời ngắn gọn.\n" + prompt }
                }
            }
        }
            };

            var req = new HttpRequestMessage(HttpMethod.Post, url);
            req.Content = new StringContent(
                JsonConvert.SerializeObject(body),
                Encoding.UTF8,
                "application/json");

            var res = await _http.SendAsync(req);
            var text = await res.Content.ReadAsStringAsync();

            // Parse kết quả
            dynamic json = JsonConvert.DeserializeObject(text)!;

            // KẾT QUẢ THÀNH CÔNG
            if (json.candidates != null)
            {
                return json.candidates[0].content.parts[0].text;
            }

            // XỬ LÝ LỖI (Để bạn biết tại sao lỗi)
            if (json.error != null)
            {
                string errorMsg = json.error.message;
                return $"Lỗi API: {errorMsg}";
                // Ví dụ: "Lỗi API: API key not valid..."
            }

            return $"Lỗi không xác định: {text}";
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
