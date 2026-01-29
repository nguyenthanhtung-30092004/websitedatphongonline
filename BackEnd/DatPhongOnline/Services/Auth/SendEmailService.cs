using System.Net;
using System.Net.Mail;

namespace DatPhongOnline.Services.Auth
{
    public class SendEmailService
    {
        private readonly IConfiguration _configuration;
        public SendEmailService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task SendAsync(string to, string subject, string body)
        {
            var smtp = new SmtpClient("smtp.gmail.com", 587)
            {
                Credentials = new NetworkCredential(
                    _configuration["Email:Username"],
                    _configuration["Email:Password"])
                ,
                EnableSsl = true
            };
            var mail = new MailMessage(
                _configuration["Email:Username"],
                to,
                subject, body);
            await smtp.SendMailAsync(mail);
        }
    }
}
