using System;
using System.Collections.Generic;
using HostMusic.Releases.Data.Entities;
using Releases.Primitives;

namespace HostMusic.Releases.Core.Models
{
    public class ReleaseResponse
    {
        public Guid Id { get; set; }
        public ReleaseType Type { get; set; }
        public ReleaseStatus Status { get; set; }
        public int OwnerId { get; set; }
        public string Title { get; set; } = null!;
        public string? Subtitle { get; set; }
        public string Artist { get; set; } = null!;
        public string? Featuring { get; set; }
        public string Genre { get; set; } = null!;
        public string? Language { get; set; }
        public string Country { get; set; } = null!;
        public string CoverPath { get; set; } = null!;
        public List<Track> Tracks { get; set; } = null!;
        public TimeSpan Duration { get; set; }
        public bool? Explicit { get; set; }
        public DateTime ReleaseDate { get; set; }
        public int NumberOfTracks { get; set; }
        public int NumberOfPlays { get; set; }
    }
}