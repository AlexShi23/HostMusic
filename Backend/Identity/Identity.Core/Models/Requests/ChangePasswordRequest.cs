using System.ComponentModel.DataAnnotations;

namespace HostMusic.Identity.Core.Models.Requests;

public class ChangePasswordRequest
{
    [Required]
    [MinLength(6)]
    public string Password { get; set; } = null!;
}