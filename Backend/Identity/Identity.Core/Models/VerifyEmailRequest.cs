using System.ComponentModel.DataAnnotations;

namespace HostMusic.Identity.Core.Models
{
    public class VerifyEmailRequest
    {
        [Required]
        public string Token { get; set; }
    }
}