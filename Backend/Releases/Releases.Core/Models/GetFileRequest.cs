using HostMusic.Releases.Primitives;

namespace HostMusic.Releases.Core.Models;

public class GetFileRequest
{
    public Guid FileId { get; set; }
    public FileType FileType { get; set; }
    public bool Compressed { get; set; }
}