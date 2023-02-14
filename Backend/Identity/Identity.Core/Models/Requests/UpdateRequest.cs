using System.ComponentModel.DataAnnotations;

namespace HostMusic.Identity.Core.Models.Requests;

public class UpdateRequest
{
    public string Nickname { get; set; } = null!;
    
    [EmailAddress]
    public string Email { get; set; } = null!;
}