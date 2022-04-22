using System.ComponentModel.DataAnnotations;

namespace HostMusic.Identity.Core.Models
{
    public class ValidateResetTokenRequest
    {
        [Required]
        public string Token { get; set; }
    }
}