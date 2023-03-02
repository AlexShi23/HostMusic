using System.Threading.Tasks;
using MailKit.Net.Smtp;
using Microsoft.Extensions.Options;
using MimeKit;
using MimeKit.Text;

namespace SmtpUtils
{
    public class SmtpProvider : ISmtpProvider
    {
        private readonly SmtpOptions _options;

        public SmtpProvider(IOptions<SmtpOptions> options)
        {
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
            
            using var client = new SmtpClient();
            await client.ConnectAsync(_options.Address, _options.Port);
            await client.AuthenticateAsync(_options.Username, _options.Password);
            await client.SendAsync(letter);
            await client.DisconnectAsync(true);
        }
    }
}