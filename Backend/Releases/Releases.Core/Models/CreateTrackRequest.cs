namespace HostMusic.Releases.Core.Models
{
    public class CreateTrackRequest
    {
        public Guid Id { get; set; }
        public int Index { get; set; }
        public string Title { get; set; } = null!;
        public string? Subtitle { get; set; }
        public string Artist { get; set; } = null!;
        public string? Featuring { get; set; }
        public bool? Explicit { get; set; }
        public string? Lyrics { get; set; } = null!;
    }
}