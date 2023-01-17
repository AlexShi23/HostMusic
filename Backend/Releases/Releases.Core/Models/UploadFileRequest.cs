using HostMusic.Releases.Primitives;
using Microsoft.AspNetCore.Http;

namespace HostMusic.Releases.Core.Models;

public class UploadFileRequest
{
    public string FileId { get; set; } = null!;
    public FileType FileType { get; set; }
    public IFormFile FileData { get; set; } = null!;
}