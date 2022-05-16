using HostMusic.Releases.Core.Models;
using HostMusic.Releases.Data;
using HostMusic.Releases.Data.Entities;
using Releases.Primitives;

namespace HostMusic.Releases.Core.Services
{
    public class ReleaseService : IReleaseService
    {
        private readonly ReleasesContext _context;
        public ReleaseService(ReleasesContext context)
        {
            _context = context;
        }

        public async Task Create(CreateReleaseRequest request)
        {
            var release = new Release
            {
                Id = Guid.NewGuid(),
                Type = request.Type,
                Status = ReleaseStatus.Draft,
                OwnerId = 123,
                Title = request.Title,
                Subtitle = request.Subtitle,
                Artist = request.Artist,
                Genre = request.Genre,
                Language = request.Language,
                Country = request.Country,
                CoverPath = request.CoverPath,
                Explicit = request.Explicit,
                ReleaseDate = request.ReleaseDate,
                NumberOfPlays = 0,
                CreatedAt = DateTime.Today
            };
            await _context.Releases.AddAsync(release);
            await _context.SaveChangesAsync();
        }

        public IEnumerable<ReleaseResponse> GetAll(int ownerId)
        {
            var releases = _context.Releases.Where(r => r.OwnerId == ownerId);
        }

        public ReleaseResponse GetById(Guid id)
        {
            var release = _context.Releases.Where(r => r.Id == id);
        }

        public void Update(Guid id, UpdateReleaseRequest request)
        {
            throw new NotImplementedException();
        }

        public void Delete(Guid id)
        {
            var release = _context.Releases.FirstOrDefault(r => r.Id == id);
            if (release != null)
            {
                _context.Releases.Remove(release);
                _context.SaveChanges();
            }
        }
    }
}