using Microsoft.AspNetCore.Http;
using Releases.Primitives;

namespace HostMusic.Releases.Core.Models;

public class UploadFileRequest
{
    public Guid FileId { get; set; }
    public FileType FileType { get; set; }
    public IFormFile FileData { get; set; } = null!;
}