using System.ComponentModel.DataAnnotations;

namespace HostMusic.Identity.Core.Models
{
    public class ForgotPasswordRequest
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }
    }
}