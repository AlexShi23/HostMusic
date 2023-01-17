using HostMusic.Releases.Primitives;

namespace HostMusic.Releases.Core.Models;

public class GetFileRequest
{
    public string FileId { get; set; } = null!;
    public FileType FileType { get; set; }
    public bool Compressed { get; set; }
}