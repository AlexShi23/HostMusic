using System.ComponentModel.DataAnnotations;

namespace HostMusic.Identity.Core.Models
{
    public class RegisterRequest
    {
        [Required]
        public string FirstName { get; set; } = null!;

        [Required]
        public string LastName { get; set; } = null!;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = null!;

        [Required]
        [MinLength(6)]
        public string Password { get; set; } = null!;

        [Required]
        [Compare("Password")]
        public string ConfirmPassword { get; set; } = null!;

        [Range(typeof(bool), "true", "true")]
        public bool AcceptTerms { get; set; }
    }
}