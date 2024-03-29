using HostMusic.Releases.Core.Models;

namespace HostMusic.Releases.Core.Services
{
    public interface ITrackService
    {
        Task<TrackResponse> GetById(Guid releaseId, Guid id);
        void Create(CreateTrackRequest request);
        Task<IEnumerable<TrackResponse>> GetAllInRelease(Guid releaseId);
        void Update(Guid releaseId, Guid id, UpdateTrackRequest request);
        Task Delete(Guid releaseId, Guid id);
    }
}