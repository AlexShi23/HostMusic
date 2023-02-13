using System.Text.Json.Serialization;

namespace HostMusic.Identity.Core.Models.Responses;

public class LoginResponse
{
    public int Id { get; set; }
    public string Nickname { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string Role { get; set; } = null!;
    public bool IsVerified { get; set; }
    public string JwtToken { get; set; } = null!;
    
    [JsonIgnore]
    public string? RefreshToken { get; set; }
}