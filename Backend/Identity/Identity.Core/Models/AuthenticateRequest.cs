using System.ComponentModel.DataAnnotations;

namespace HostMusic.Identity.Core.Models
{
    public class AuthenticateRequest
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = null!;
        
        [Required]
        public string Password { get; set; } = null!;
    }
}