using Amazon.S3;

namespace HostMusic.AmazonS3.Factory;

public interface IAmazonS3ClientFactory
{
    IAmazonS3 Create();
}