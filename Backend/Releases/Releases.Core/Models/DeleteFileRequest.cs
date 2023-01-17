using HostMusic.Releases.Primitives;

namespace HostMusic.Releases.Core.Models;

public class DeleteFileRequest
{
    public string FileId { get; set; } = null!;
    public FileType FileType { get; set; }
}