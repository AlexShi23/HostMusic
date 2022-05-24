using System;

namespace HostMusic.Releases.Data.Entities
{
    public class Track
    {
        public Guid Id { get; set; }
        public Guid ReleaseId { get; set; }
        public Release Release { get; set; } = null!;
        public int Index { get; set; }
        public string Title { get; set; } = null!;
        public string? Subtitle { get; set; }
        public string Artist { get; set; } = null!;
        public string? Featuring { get; set; } 
        public string Path { get; set; } = null!;
        public TimeSpan Duration { get; set; }
        public bool? Explicit { get; set; }
        public string? Lyrics { get; set; } = null!;
        public int NumberOfPlays { get; set; }
    }
}