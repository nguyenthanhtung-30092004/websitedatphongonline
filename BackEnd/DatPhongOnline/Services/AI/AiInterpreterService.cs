using DatPhongOnline.Dtos.ChatMessage;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Text;

namespace DatPhongOnline.Services.AI
{
    public class AiInterpreterService
    {
        private readonly HttpClient _http;
        private readonly IConfiguration _config;

        public AiInterpreterService(HttpClient http, IConfiguration config)
        {
            _http = http;
            _config = config;
        }

        public async Task<ParsedChatResult?> ParseIntentAsync(string userMessage)
        {
            string prompt = $@"
Bạn là AI phân tích câu hỏi đặt phòng khách sạn.

INTENT HỢP LỆ (CHỈ CHỌN 1):
- list_room (đưa ra, liệt kê, xem các phòng)
- check_availability (hỏi còn phòng, kiểm tra ngày)
- ask_room_info (hỏi mô tả, giá, tư vấn)
- greeting
- other

QUY TẮC:
- Nếu người dùng yêu cầu xem / liệt kê phòng → intent = list_room
- Không được suy đoán

CÂU NGƯỜI DÙNG:
""{userMessage}""

CHỈ TRẢ VỀ JSON:

{{
  ""intent"": ""list_room | check_availability | ask_room_info | greeting | other"",
  ""checkIn"": ""YYYY-MM-DD hoặc null"",
  ""checkOut"": ""YYYY-MM-DD hoặc null""
}}
";


            var body = new
            {
                model = _config["Groq:Model"],
                temperature = 0,
                messages = new[]
                {
                    new { role = "system", content = "Bạn là bộ phân tích tiếng Việt, không được suy đoán." },
                    new { role = "user", content = prompt }
                }
            };

            var req = new HttpRequestMessage(
                HttpMethod.Post,
                "https://api.groq.com/openai/v1/chat/completions"
            );

            req.Headers.Authorization =
                new System.Net.Http.Headers.AuthenticationHeaderValue(
                    "Bearer", _config["Groq:ApiKey"]);

            req.Content = new StringContent(
                JsonConvert.SerializeObject(body),
                Encoding.UTF8,
                "application/json");

            var res = await _http.SendAsync(req);
            var text = await res.Content.ReadAsStringAsync();

            if (!res.IsSuccessStatusCode) return null;

            var raw = JObject.Parse(text)
                ["choices"]![0]!["message"]!["content"]!.ToString();

            var clean = raw.Replace("```json", "").Replace("```", "").Trim();

            return JsonConvert.DeserializeObject<ParsedChatResult>(clean);
        }
    }
}
