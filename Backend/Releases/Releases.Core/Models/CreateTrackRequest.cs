using System;
using HostMusic.Releases.Data.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace HostMusic.Releases.Core.Models
{
    public class CreateTrackRequest
    {
        public int Index { get; set; }
        public string Title { get; set; } = null!;
        public string? Subtitle { get; set; }
        public string Artist { get; set; } = null!;
        public string? Featuring { get; set; }
        public string TrackPath { get; set; } = null!;
        public bool? Explicit { get; set; }
        public string? Lyrics { get; set; } = null!;
    }
}