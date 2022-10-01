using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using HostMusic.Releases.Core.Models;

namespace HostMusic.Releases.Core.Services
{
    public interface IReleaseService
    {
        Guid Create(CreateReleaseRequest request, int creatorId);
        Task<IEnumerable<ReleaseResponse>> GetAll(int ownerId);
        Task<ReleaseResponse> GetById(Guid id);
        void Update(Guid id, UpdateReleaseRequest request);
        Task Delete(Guid id);
        Task<IEnumerable<ReleaseResponse>> Search(string query, int ownerId);
        Task Moderate(Guid id, ModerationRequest request);
    }
}