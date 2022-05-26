using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using HostMusic.Releases.Core.Models;

namespace HostMusic.Releases.Core.Services
{
    public interface ITrackService
    {
        void Create(Guid releaseId, CreateTrackRequest request, int creatorId);
        Task<IEnumerable<TrackResponse>> GetAllInRelease(Guid releaseId);
        Task<TrackResponse> GetById(Guid id);
        void Update(Guid id, UpdateTrackRequest request);
        Task Delete(Guid id);
    }
}