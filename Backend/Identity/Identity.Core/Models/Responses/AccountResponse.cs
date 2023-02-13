namespace HostMusic.Identity.Core.Models.Responses;

public class AccountResponse
{
    public int Id { get; set; }
    public string Nickname { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string Role { get; set; } = null!;
    public bool IsVerified { get; set; }
}