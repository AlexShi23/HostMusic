namespace HostMusic.AmazonS3.Models;

public class DownloadFileInfo
{
    public Stream Stream { get; set; } = null!;
    public string MimeType { get; set; } = null!;
}