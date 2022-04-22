namespace SmtpUtils
{
    public class SmtpOptions
    {
        public string Address { get; set; } = null!;
        public int Port { get; set; }
        public string Email { get; set; } = null!;
        public string Username { get; set; } = null!;
        public string Password { get; set; } = null!;
    }
}