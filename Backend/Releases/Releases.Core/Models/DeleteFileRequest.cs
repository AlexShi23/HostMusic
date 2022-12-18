using HostMusic.Releases.Primitives;

namespace HostMusic.Releases.Core.Models;

public class DeleteFileRequest
{
    public Guid FileId { get; set; }
    public FileType FileType { get; set; }
}