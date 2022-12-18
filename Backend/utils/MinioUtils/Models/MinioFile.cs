namespace HostMusic.MinioUtils.Models;

public class MinioFile
{
    public string BucketName { get; set; }
    public string FileName { get; set; }
    
    public MinioFile(string bucketName, string fileName)
    {
        BucketName = bucketName;
        FileName = fileName;
    }
}