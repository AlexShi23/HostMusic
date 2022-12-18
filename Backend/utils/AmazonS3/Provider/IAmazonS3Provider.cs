using HostMusic.AmazonS3.Models;

namespace HostMusic.AmazonS3.Provider;

public interface IAmazonS3Provider
{
    Task CreateDefaultBuckets(IEnumerable<string> buckets, CancellationToken cancellationToken);
    Task DeleteFile(AmazonFileReference file, CancellationToken cancellationToken);
    Task<bool> Exists(AmazonFileReference file, CancellationToken cancellationToken);
    Task<byte[]> GetFile(string bucketName, Guid fileId, CancellationToken cancellationToken);
    Task<Stream> GetFileStream(AmazonFileReference file, CancellationToken cancellationToken);
    Task UploadFile(AmazonFileReference file, Stream data, string mimeType,
        CancellationToken cancellationToken);
    Task UpdateFile(UpdateFileRequest request, CancellationToken cancellationToken);
    string GetPreSignedUrl(string bucketName, string objectKey, string contentType, double duration);
}