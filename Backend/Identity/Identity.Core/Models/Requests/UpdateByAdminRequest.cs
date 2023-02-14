using System.ComponentModel.DataAnnotations;
using HostMusic.Identity.Core.Enums;

namespace HostMusic.Identity.Core.Models.Requests;

public class UpdateByAdminRequest
{
    public string Nickname { get; set; } = null!;
    
    [EmailAddress]
    public string Email { get; set; } = null!;
    
    [EnumDataType(typeof(Role))]
    public string Role { get; set; } = null!;
}