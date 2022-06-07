using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using HostMusic.Releases.Core.Models;
using HostMusic.Releases.Data;
using HostMusic.Releases.Data.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace HostMusic.Releases.Core.Services
{
    public class TrackService : ITrackService
    {
        private readonly ReleasesContext _context;
        private readonly IMapper _mapper;

        public TrackService(ReleasesContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<TrackResponse> GetById(Guid releaseId, Guid id)
        {
            var release = await _context.Releases.SingleAsync(x => x.Id == releaseId);
            var track = release.Tracks.First(x => x.Id == id);
            return _mapper.Map<TrackResponse>(track);
        }

        public void Create(Guid releaseId, CreateTrackRequest request)
        {
            var release = _context.Releases.First(x => x.Id == releaseId);
            var track = new Track
            {
                ReleaseId = releaseId,
                Index = request.Index,
                Title = request.Title,
                Subtitle = request.Subtitle,
                Artist = request.Artist,
                Featuring = request.Featuring,
                Explicit = request.Explicit,
                Path = "111",
                Lyrics = request.Lyrics,
                NumberOfPlays = 0
            };

            release.Tracks.Add(track);
            _context.Releases.Update(release);
            _context.SaveChanges();
        }

        public async Task<IEnumerable<TrackResponse>> GetAllInRelease(Guid releaseId)
        {
            var release = await _context.Releases.SingleAsync(x => x.Id == releaseId);
            var tracks = release.Tracks.ToList();
            return _mapper.Map<IList<TrackResponse>>(tracks);
        }

        public void Update(Guid releaseId, Guid id, UpdateTrackRequest request)
        {
            var release = _context.Releases.Single(x => x.Id == releaseId);
            var track = release.Tracks.FirstOrDefault(x => x.Id == id);
            if (track != null)
            {
                release.Tracks.Remove(track);
                _mapper.Map(request, track);
                release.Tracks.Add(track);
                _context.Releases.Update(release);
                _context.SaveChanges();
            }
        }

        public async Task Delete(Guid releaseId, Guid id)
        {
            var release = await _context.Releases.SingleAsync(x => x.Id == releaseId);
            var track = release.Tracks.FirstOrDefault(x => x.Id == id);
            if (track != null)
            {
                release.Tracks.Remove(track);
                _context.Releases.Update(release);
                await _context.SaveChangesAsync();
            }
        }
    }
}