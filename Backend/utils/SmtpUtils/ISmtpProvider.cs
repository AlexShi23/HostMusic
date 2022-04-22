using System.Threading.Tasks;

namespace SmtpUtils
{
    public interface ISmtpProvider
    {
        Task SendEmailAsync(string email, string subject, string message);
    }
}