using System.Security.Cryptography;
using HostMusic.MinioUtils.Models;
using Minio;
using Minio.DataModel;
using Minio.Exceptions;

namespace HostMusic.MinioUtils.Provider;

public class MinioProvider : IMinioProvider
{
    private readonly MinioClient _minioClient;

    public MinioProvider(MinioClient minioClient)
    {
        _minioClient = minioClient;
    }

    public async Task<Stream> GetFileStream(MinioFile file, CancellationToken cancellationToken)
    {
        var statObjectArgs = new StatObjectArgs()
            .WithBucket(file.BucketName)
            .WithObject(file.FileName);
        await _minioClient.StatObjectAsync(statObjectArgs, cancellationToken);

        var fileStream = new MemoryStream();
        var getObjectArgs = new GetObjectArgs()
            .WithBucket(file.BucketName)
            .WithObject(file.FileName)
            .WithCallbackStream(stream =>
            {
                stream.CopyTo(fileStream);
            });
        await _minioClient.GetObjectAsync(getObjectArgs, cancellationToken);

        return fileStream;
    }

    public async Task UpdateFile(UpdateFileRequest request, CancellationToken cancellationToken)
    {
        var file = new MinioFile(request.BucketName, request.FileName);
        if (await Exists(file, cancellationToken))
        {
            await DeleteFile(file, cancellationToken);
        }
        await UploadFile(request, cancellationToken);
    }

    public async Task DeleteFile(MinioFile file, CancellationToken cancellationToken)
    {
        var rmArgs = new RemoveObjectArgs()
            .WithBucket(file.BucketName)
            .WithObject(file.FileName);
        await _minioClient.RemoveObjectAsync(rmArgs, cancellationToken);
    }

    public async Task<string> GetPreSignedUrl(string bucketName, string objectKey, int duration)
    {
        var args = new PresignedGetObjectArgs()
            .WithBucket(bucketName)
            .WithObject(objectKey)
            .WithExpiry(duration);
        return await _minioClient.PresignedGetObjectAsync(args);
    }

    public async Task<string> GetPreSignedUrlForUpload(string bucketName, string objectKey, int duration)
    {
        var args = new PresignedPutObjectArgs()
            .WithBucket(bucketName)
            .WithObject(objectKey)
            .WithExpiry(duration);
        return await _minioClient.PresignedPutObjectAsync(args);
    }

    public async Task CreateDefaultBuckets(IEnumerable<string> buckets, CancellationToken cancellationToken)
    {
        foreach (var bucket in buckets)
        {
            var args = new BucketExistsArgs()
                .WithBucket(bucket);
            var found = await _minioClient.BucketExistsAsync(args, cancellationToken);
            if (found) continue;
            var makeArgs = new MakeBucketArgs()
                .WithBucket(bucket);
            await _minioClient.MakeBucketAsync(makeArgs, cancellationToken);
        }
    }

    private async Task<bool> Exists(MinioFile file, CancellationToken cancellationToken)
    {
        try
        {
            var statObjectArgs = new StatObjectArgs()
                .WithBucket(file.BucketName)
                .WithObject(file.FileName);
            await _minioClient.StatObjectAsync(statObjectArgs, cancellationToken);

            return true;
        }
        catch (MinioException)
        {
            return false;
        }
    }

    private async Task UploadFile(UpdateFileRequest request, CancellationToken cancellationToken)
    {
        var putObjectArgs = new PutObjectArgs()
            .WithBucket(request.BucketName)
            .WithObject(request.FileName)
            .WithObjectSize(request.Data.Length)
            .WithStreamData(request.Data)
            .WithContentType(request.ContentType);
        await _minioClient.PutObjectAsync(putObjectArgs, cancellationToken);
    }
}