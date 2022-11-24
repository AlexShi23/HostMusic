namespace HostMusic.AmazonS3.Models;

public class UpdateFileRequest
{
    public string BucketName { get; set; } = null!;
    public string ContentType { get; set; } = null!;
    public Guid FileId { get; set; }
    public Stream Data { get; set; } = null!;
}