using System.ComponentModel.DataAnnotations;

namespace HostMusic.Identity.Core.Models.Requests;

public class VerifyEmailRequest
{
    [Required]
    public string Token { get; set; } = null!;
    
    [Required]
    public int AccountId { get; set; }
}