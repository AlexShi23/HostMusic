using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using HostMusic.Releases.Core.Models;

namespace HostMusic.Releases.Core.Services
{
    public interface IReleaseService
    {
        Guid Create(CreateReleaseRequest request, int creatorId);
        Task<ReleasesPageResponse> GetAll(int ownerId, int page);
        Task<ReleasesPageResponse> GetAllOnModeration(int page);
        Task<ReleaseResponse> GetById(Guid id);
        void Update(Guid id, UpdateReleaseRequest request);
        Task Delete(Guid id);
        Task<ReleasesPageResponse> Search(string query, int ownerId, int page);
        Task Moderate(Guid id, ModerationRequest request);
    }
}