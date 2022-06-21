using System;
using System.Collections.Generic;
using Releases.Primitives;

namespace HostMusic.Releases.Core.Models
{
    public class UpdateReleaseRequest
    {
        public ReleaseType Type { get; set; }
        public bool IsDraft { get; set; }
        public string Title { get; set; } = null!;
        public string? Subtitle { get; set; }
        public string Artist { get; set; } = null!;
        public string? Featuring { get; set; }
        public string Genre { get; set; } = null!;
        public string? Language { get; set; } = null!;
        public string Country { get; set; } = null!;
        public string Cover { get; set; } = null!;
        public List<UpdateTrackRequest> Tracks { get; set; }
        public DateTime ReleaseDate { get; set; }
    }
}