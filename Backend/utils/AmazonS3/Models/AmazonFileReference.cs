namespace HostMusic.AmazonS3.Models;

public class AmazonFileReference
{
    public string BucketName { get; set; }
    public Guid FileId { get; set; }
    
    public AmazonFileReference(string bucketName, Guid fileId)
    {
        BucketName = bucketName;
        FileId = fileId;
    }
}