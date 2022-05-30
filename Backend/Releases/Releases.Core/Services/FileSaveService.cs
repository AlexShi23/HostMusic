using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using tusdotnet.Interfaces;
using tusdotnet.Models.Configuration;

namespace HostMusic.Releases.Core.Services
{
    public class FileSaveService : IFileSaveService
    {
        private readonly AppSettings _settings;

        public FileSaveService(IOptions<AppSettings> settings)
        {
            _settings = settings.Value;
        }

        public async Task SaveFileUsingTus(FileCompleteContext eventContext)
        {
            var file = await eventContext.GetFileAsync();

            var metadata = await file.GetMetadataAsync(eventContext.CancellationToken);
            var fileName = file.Id + "." + metadata["name"].GetString(System.Text.Encoding.UTF8).Split(".").Last();

            await using (var createdFile = File.Create(Path.Combine(_settings.FileSavePath, fileName)))
            await using (var stream = await file.GetContentAsync(eventContext.CancellationToken))
            {
                await stream.CopyToAsync(createdFile);
            }

            var terminationStore = (ITusTerminationStore)eventContext.Store;
            await terminationStore.DeleteFileAsync(file.Id, eventContext.CancellationToken);
        }
    }
}