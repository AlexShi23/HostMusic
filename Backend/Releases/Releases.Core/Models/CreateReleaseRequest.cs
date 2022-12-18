using System;
using System.Collections.Generic;
using HostMusic.Releases.Primitives;

namespace HostMusic.Releases.Core.Models
{
    public class CreateReleaseRequest
    {
        public Guid Id { get; set; }
        public ReleaseType Type { get; set; }
        public bool IsDraft { get; set; }
        public string Title { get; set; } = null!;
        public string? Subtitle { get; set; }
        public string Artist { get; set; } = null!;
        public string? Featuring { get; set; }
        public string Genre { get; set; } = null!;
        public string Country { get; set; } = null!;
        public List<CreateTrackRequest> Tracks { get; set; }
        public DateTime ReleaseDate { get; set; }
    }
}