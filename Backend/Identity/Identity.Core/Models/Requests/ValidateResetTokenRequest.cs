using System.ComponentModel.DataAnnotations;

namespace HostMusic.Identity.Core.Models.Requests;

public class ValidateResetTokenRequest
{
    [Required]
    public int AccountId { get; set; }
    [Required]
    public string Token { get; set; } = null!;
}