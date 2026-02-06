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
            var today = DateTime.Now;
            var apiKey = _config["Gemini:ApiKey"];
            var baseUrl = _config["Gemini:Url"];
            var url = $"{baseUrl}?key={apiKey}";
            string prompt = $@"
Hôm nay là: {today:yyyy-MM-dd} (Thứ {today.DayOfWeek}).
NHIỆM VỤ: Phân tích ý định và ngày tháng từ câu hỏi của khách.
QUY TẮC NGÀY THÁNG:
1. ""Ngày 15"", ""15/10"" -> CheckIn = Năm nay-10-15.
2. NẾU CHỈ CÓ NGÀY ĐẾN (thiếu ngày đi) -> TỰ ĐỘNG CỘNG THÊM 1 NGÀY làm ngày CheckOut.
3. ""Ngày mai"" -> CheckIn = {today.AddDays(1):yyyy-MM-dd}, CheckOut = {today.AddDays(2):yyyy-MM-dd}.
CÂU HỎI: ""{userMessage}""
TRẢ VỀ JSON:
{{
  ""intent"": ""check_availability (nếu có ngày) | list_room (hỏi danh sách/tiện ích) | other"",
  ""checkIn"": ""YYYY-MM-DD"" (null nếu ko có),
  ""checkOut"": ""YYYY-MM-DD"" (null nếu ko có)
}}
";

            var body = new
            {
                contents = new[]
                {
            new { parts = new[] { new { text = prompt } } }
        },
                generationConfig = new
                {
                    response_mime_type = "application/json"
                }
            };

            var req = new HttpRequestMessage(HttpMethod.Post, url);
            req.Content = new StringContent(
                JsonConvert.SerializeObject(body),
                Encoding.UTF8,
                "application/json");

            var res = await _http.SendAsync(req);
            var text = await res.Content.ReadAsStringAsync();

            dynamic json = JsonConvert.DeserializeObject(text)!;

            if (json.error != null)
            {
                // Ghi log lỗi nếu cần, ở đây trả về null để fallback
                Console.WriteLine($"Gemini Error: {json.error.message}");
                return null;
            }

            if (json.candidates == null) return null;

            string clean = json.candidates[0].content.parts[0].text;
            clean = clean.Replace("```json", "").Replace("```", "").Trim();

            try
            {
                return JsonConvert.DeserializeObject<ParsedChatResult>(clean);
            }
            catch
            {
                return null;
            }
        }


    }
}
