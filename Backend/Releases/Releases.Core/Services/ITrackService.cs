using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using HostMusic.Releases.Core.Models;
using Microsoft.AspNetCore.Http;

namespace HostMusic.Releases.Core.Services
{
    public interface ITrackService
    {
        Task<TrackResponse> GetById(Guid releaseId, Guid id);
        void Create(Guid releaseId, CreateTrackRequest request);
        Task<IEnumerable<TrackResponse>> GetAllInRelease(Guid releaseId);
        void Update(Guid releaseId, Guid id, UpdateTrackRequest request);
        Task Delete(Guid releaseId, Guid id);
    }
}