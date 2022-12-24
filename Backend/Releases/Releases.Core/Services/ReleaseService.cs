using AutoMapper;
using HostMusic.Releases.Core.Models;
using HostMusic.Releases.Data;
using HostMusic.Releases.Data.Entities;
using HostMusic.Releases.Primitives;
using Microsoft.EntityFrameworkCore;

namespace HostMusic.Releases.Core.Services
{
    public class ReleaseService : IReleaseService
    {
        private readonly ReleasesContext _context;
        private readonly IMapper _mapper;
        public ReleaseService(ReleasesContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public Guid Create(CreateReleaseRequest request, int creatorId)
        {
            var release = new Release
            {
                Id = request.Id,
                Type = request.Type,
                Status = request.IsDraft ? ReleaseStatus.Draft : ReleaseStatus.Moderation,
                OwnerId = creatorId,
                Title = request.Title,
                Subtitle = request.Subtitle,
                Artist = request.Artist,
                Featuring = request.Featuring,
                Genre = request.Genre,
                Country = request.Country,
                ReleaseDate = request.ReleaseDate.ToUniversalTime(),
                NumberOfTracks = request.Tracks.Count,
                NumberOfPlays = 0,
                CreatedAt = DateTime.Today.ToUniversalTime()
            };

            var tracks = request.Tracks.Select(track => new Track
                {
                    Id = track.Id,
                    Index = track.Index,
                    ReleaseId = release.Id,
                    Title = track.Title,
                    Subtitle = track.Subtitle,
                    Artist = track.Artist,
                    Featuring = track.Featuring,
                    Duration = default,
                    Explicit = track.Explicit,
                    Lyrics = track.Lyrics,
                    NumberOfPlays = 0
                })
                .ToList();

            release.Tracks = tracks;
            
            _context.Releases.Add(release);
            _context.SaveChanges();

            return release.Id;
        }

        public async Task<ReleasesPageResponse> GetAll(int ownerId, int page)
        {
            const float itemsOnPageCount = 10f;
            var pagesCount = Math.Ceiling(
                _context.Releases.Count(r => r.OwnerId == ownerId) / itemsOnPageCount);
            
            var releases = await _context.Releases
                .Where(r => r.OwnerId == ownerId)
                .OrderByDescending(r => r.Status)
                .ThenByDescending(r => r.CreatedAt)
                .Skip((page - 1) * (int)itemsOnPageCount)
                .Take((int)itemsOnPageCount)
                .ToListAsync();
            var releasesResponse = _mapper.Map<List<ReleaseResponse>>(releases);

            return new ReleasesPageResponse(releasesResponse, (int)pagesCount);
        }

        public async Task<ReleasesPageResponse> GetAllOnModeration(int page)
        {
            const float itemsOnPageCount = 10f;
            var pagesCount = Math.Ceiling(
                _context.Releases.Count(r => r.Status == ReleaseStatus.Moderation) / itemsOnPageCount);
            
            var releases = await _context.Releases
                .Where(r => r.Status == ReleaseStatus.Moderation)
                .Skip((page - 1) * (int)itemsOnPageCount)
                .Take((int)itemsOnPageCount)
                .ToListAsync();
            var releasesResponse = _mapper.Map<List<ReleaseResponse>>(releases);

            return new ReleasesPageResponse(releasesResponse, (int)pagesCount);
        }

        public async Task<ReleaseResponse> GetById(Guid id)
        {
            var release = await _context.Releases.FirstOrDefaultAsync(r => r.Id == id);
            return _mapper.Map<ReleaseResponse>(release);
        }

        public void Update(Guid id, UpdateReleaseRequest request)
        {
            var release =  _context.Releases.FirstOrDefault(r => r.Id == id);
            if (release != null)
            {
                _mapper.Map(request, release);
                release.UpdatedAt = DateTime.UtcNow;
                release.Status = request.IsDraft ? ReleaseStatus.Draft : ReleaseStatus.Moderation;
                _context.Releases.Update(release);
                _context.SaveChanges();
            }
        }

        public async Task Delete(Guid id)
        {
            var release = await _context.Releases.FirstOrDefaultAsync(r => r.Id == id);
            if (release != null)
            {
                _context.Releases.Remove(release);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<ReleasesPageResponse> Search(string query, int ownerId, int page)
        {
            const float itemsOnPageCount = 5f;
            var pagesCount = Math.Ceiling(
                _context.Releases.Count(r => 
                    r.OwnerId == ownerId &&
                    (r.Title.ToLower().Contains(query.ToLower()) ||
                    r.Artist.ToLower().Contains(query.ToLower()))) / itemsOnPageCount);
            
            var releases = await _context.Releases.Where(r => r.OwnerId == ownerId &&
                (r.Title.ToLower().Contains(query.ToLower()) ||
                r.Artist.ToLower().Contains(query.ToLower())))
                .Skip((page - 1) * (int)itemsOnPageCount)
                .Take((int)itemsOnPageCount)
                .ToListAsync();
            var releasesResponse = _mapper.Map<List<ReleaseResponse>>(releases);

            return new ReleasesPageResponse(releasesResponse, (int)pagesCount);
        }

        public async Task Moderate(Guid id, ModerationRequest request)
        {
            var release = await _context.Releases.FindAsync(id);
            
            if (release != null)
            {
                release.ModerationPassed = request.ModerationPassed;
                release.ModerationComment = request.ModerationComment;
                release.Status = request.ModerationPassed ? ReleaseStatus.ModerationDone : ReleaseStatus.Correcting;
            }

            await _context.SaveChangesAsync();
        }
    }
}