using System.ComponentModel.DataAnnotations;

namespace Identity.Models.Accounts
{
    public class ValidateResetTokenRequest
    {
        [Required]
        public string Token { get; set; }
    }
}