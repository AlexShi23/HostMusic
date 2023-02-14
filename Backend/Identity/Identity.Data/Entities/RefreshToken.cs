using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace HostMusic.Identity.Data.Entities;

[Owned]
public class RefreshToken
{
    [Key]
    public int Id { get; set; }
    public string Token { get; set; }
    public DateTime ExpiresOn { get; set; }
    public DateTime CreatedOn { get; set; }
    public string CreatedByIp { get; set; }
    public DateTime? RevokedOn { get; set; }
    public string RevokedByIp { get; set; }
    public string ReplacedByToken { get; set; }
    public string ReasonRevoked { get; set; }
    public bool IsExpired => DateTime.UtcNow >= ExpiresOn;
    public bool IsRevoked => RevokedOn != null;
    public bool IsActive => RevokedOn == null && !IsExpired;
}
