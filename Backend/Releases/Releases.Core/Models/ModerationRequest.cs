namespace HostMusic.Releases.Core.Models;

public class ModerationRequest
{
    public bool ModerationPassed { get; set; }
    public string? ModerationComment { get; set; }
}