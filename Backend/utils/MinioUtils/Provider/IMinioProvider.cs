using HostMusic.MinioUtils.Models;

namespace HostMusic.MinioUtils.Provider;

public interface IMinioProvider
{
    Task<Stream> GetFileStream(MinioFile file, CancellationToken cancellationToken);
    Task UpdateFile(UpdateFileRequest request, CancellationToken cancellationToken);
    Task DeleteFile(MinioFile file, CancellationToken cancellationToken);
    Task<string> GetPreSignedUrl(string bucketName, string objectKey, int duration);
    Task<string> GetPreSignedUrlForUpload(string bucketName, string objectKey, int duration);
    Task CreateDefaultBuckets(IEnumerable<string> buckets, CancellationToken cancellationToken);

}