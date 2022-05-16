using HostMusic.Releases.Core.Models;

namespace HostMusic.Releases.Core.Services
{
    public interface IReleaseService
    {
        Task Create(CreateReleaseRequest request);
        IEnumerable<ReleaseResponse> GetAll(int ownerId);
        ReleaseResponse GetById(Guid id);
        void Update(Guid id, UpdateReleaseRequest request);
        void Delete(Guid id);
    }
}