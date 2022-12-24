namespace HostMusic.MinioUtils.Models;

public class UpdateFileRequest
{
    public string BucketName { get; set; } = null!;
    public string ContentType { get; set; } = null!;
    public string FileName { get; set; } = null!;
    public Stream Data { get; set; } = null!;
}