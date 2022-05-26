using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using HostMusic.Releases.Core.Models;
using HostMusic.Releases.Data;
using HostMusic.Releases.Data.Entities;
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

        public void Create(Guid releaseId, CreateTrackRequest request, int creatorId)
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
                Lyrics = request.Lyrics
            };
            release.Tracks.Add(track);
            _context.Releases.Update(release);
            _context.Tracks.Add(track);
            _context.SaveChanges();
        }
        
        public async Task<IEnumerable<TrackResponse>> GetAllInRelease(Guid releaseId)
        {
            var release = await _context.Releases.FirstOrDefaultAsync(x => x.Id == releaseId);
            var tracks = release.Tracks.ToList();
            return _mapper.Map<IList<TrackResponse>>(tracks);
        }

        public async Task<TrackResponse> GetById(Guid id)
        {
            var track = await _context.Tracks.FirstOrDefaultAsync(x => x.Id == id);
            return _mapper.Map<TrackResponse>(track);
        }

        public void Update(Guid id, UpdateTrackRequest request)
        {
            var track = _context.Tracks.FirstOrDefault(x => x.Id == id);
            if (track != null)
            {
                _mapper.Map(request, track);
                _context.Tracks.Update(track);
                _context.SaveChanges();
            }
        }

        public async Task Delete(Guid id)
        {
            var track = _context.Tracks.FirstOrDefault(x => x.Id == id);
            if (track != null)
            {
                _context.Tracks.Remove(track);
                await _context.SaveChangesAsync();
            }
        }
    }
}