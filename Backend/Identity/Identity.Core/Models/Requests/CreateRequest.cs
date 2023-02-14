using System.ComponentModel.DataAnnotations;
using HostMusic.Identity.Core.Enums;

namespace HostMusic.Identity.Core.Models.Requests;

public class CreateRequest
{
    [Required]
    public string Nickname { get; set; } = null!;

    [Required]
    [EmailAddress]
    public string Email { get; set; } = null!;

    [Required]
    public string Password { get; set; } = null!;
    
    [Required]
    [EnumDataType(typeof(Role))]
    public string Role { get; set; } = null!;
}