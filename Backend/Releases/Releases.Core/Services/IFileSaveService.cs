using System.Threading.Tasks;
using tusdotnet.Models.Configuration;

namespace HostMusic.Releases.Core.Services
{
    public interface IFileSaveService
    {
        Task SaveFileUsingTus(FileCompleteContext eventContext);
    }
}