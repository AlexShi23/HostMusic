using System;
using Releases.Primitives;

namespace HostMusic.Releases.Core.Models
{
    public class CreateReleaseRequest
    {
        public ReleaseType Type { get; set; }
        public string Title { get; set; } = null!;
        public string? Subtitle { get; set; }
        public string Artist { get; set; } = null!;
        public string? Featuring { get; set; }
        public string Genre { get; set; } = null!;
        public string? Language { get; set; } = null!;
        public string Country { get; set; } = null!;
        public string CoverPath { get; set; } = null!;
        public DateTime ReleaseDate { get; set; }
    }
}