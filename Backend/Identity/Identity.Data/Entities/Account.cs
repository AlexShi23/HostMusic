using Microsoft.AspNetCore.Identity;

namespace HostMusic.Identity.Data.Entities;

public class Account : IdentityUser<int>
{
    public string Nickname { get; set; } = null!;
    public List<RefreshToken> RefreshTokens { get; set; }
}