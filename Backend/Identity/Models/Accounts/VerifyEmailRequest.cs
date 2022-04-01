using System.ComponentModel.DataAnnotations;

namespace Identity.Models.Accounts
{
    public class VerifyEmailRequest
    {
        [Required]
        public string Token { get; set; }
    }
}