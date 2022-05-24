using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using HostMusic.Releases.Core.Models;
using HostMusic.Releases.Data;
using HostMusic.Releases.Data.Entities;
using Microsoft.EntityFrameworkCore;
using Releases.Primitives;

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

        public void Create(CreateReleaseRequest request, int creatorId)
        {
            var release = new Release
            {
                Id = Guid.NewGuid(),
                Type = request.Type,
                Status = ReleaseStatus.Draft,
                OwnerId = creatorId,
                Title = request.Title,
                Subtitle = request.Subtitle,
                Artist = request.Artist,
                Featuring = request.Featuring,
                Genre = request.Genre,
                Language = request.Language,
                Country = request.Country,
                CoverPath = request.CoverPath,
                ReleaseDate = request.ReleaseDate,
                NumberOfPlays = 0,
                CreatedAt = DateTime.Today.ToUniversalTime()
            };
            _context.Releases.Add(release);
            _context.SaveChanges();
        }

        public async Task<IEnumerable<ReleaseResponse>> GetAll(int ownerId)
        {
            var releases = await _context.Releases.Where(r => r.OwnerId == ownerId).ToListAsync();
            return _mapper.Map<IList<ReleaseResponse>>(releases);
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
    }
}