using System.ComponentModel.DataAnnotations;

namespace HostMusic.Identity.Core.Models.Requests;

public class LoginRequest
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = null!;
        
    [Required]
    public string Password { get; set; } = null!;
}