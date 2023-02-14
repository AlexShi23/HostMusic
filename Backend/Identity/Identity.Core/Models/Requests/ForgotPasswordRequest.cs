using System.ComponentModel.DataAnnotations;

namespace HostMusic.Identity.Core.Models.Requests;

public class ForgotPasswordRequest
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = null!;
}