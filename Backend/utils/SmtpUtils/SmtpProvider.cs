using System.Threading.Tasks;
using MailKit.Net.Smtp;
using Microsoft.Extensions.Options;
using MimeKit;
using MimeKit.Text;

namespace SmtpUtils
{
    public class SmtpProvider : ISmtpProvider
    {
        private readonly SmtpClient _client;
        private readonly SmtpOptions _options;

        public SmtpProvider(SmtpClient client, IOptions<SmtpOptions> options)
        {
            _client = client;
            _options = options.Value;
        }
        
        public async Task SendEmailAsync(string email, string subject, string message)
        {
            var letter = new MimeMessage
            {
                Sender = MailboxAddress.Parse(_options.Email),
                Subject = subject,
                Body = new TextPart(TextFormat.Html) { Text = message }
            };
            letter.From.Add(letter.Sender);
            letter.To.Add(MailboxAddress.Parse(email));
            await _client.SendAsync(letter);
        }
    }
}