using System.ComponentModel.DataAnnotations;

namespace HostMusic.Identity.Core.Models.Requests;

public class ResetPasswordRequest
{
    [Required]
    public int AccountId { get; set; }
    
    [Required]
    public string Token { get; set; } = null!;

    [Required]
    [MinLength(6)]
    public string Password { get; set; } = null!;

    [Required]
    [Compare("Password")]
    public string ConfirmPassword { get; set; } = null!;
}