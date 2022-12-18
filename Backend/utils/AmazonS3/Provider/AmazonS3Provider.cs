using System.Net;
using Amazon.S3;
using Amazon.S3.Model;
using Amazon.S3.Transfer;
using HostMusic.AmazonS3.Exceptions;
using HostMusic.AmazonS3.Models;

namespace HostMusic.AmazonS3.Provider;

public class AmazonS3Provider : IAmazonS3Provider
{
    private const string MimeTypeHeader = "x-amz-meta-mimetype";
    
    private readonly IAmazonS3 _client;
    private readonly ITransferUtility _transferUtility;

    public AmazonS3Provider(IAmazonS3 client, ITransferUtility transferUtility)
    {
        _client = client;
        _transferUtility = transferUtility;
    }

    public async Task CreateDefaultBuckets(IEnumerable<string> buckets, CancellationToken cancellationToken)
    {
        var bucketsList = await _client.ListBucketsAsync(cancellationToken);
        foreach (var bucket in buckets)
        {
            if (bucketsList.Buckets.Exists(b => b.BucketName == bucket))
            {
                continue;
            }
            await _client.PutBucketAsync(new PutBucketRequest { BucketName = bucket }, cancellationToken);
        }
    }

    public async Task DeleteFile(AmazonFileReference file, CancellationToken cancellationToken)
    {
        await _client.DeleteObjectAsync(file.BucketName, file.FileName, cancellationToken);
    }

    public async Task<bool> Exists(AmazonFileReference file, CancellationToken cancellationToken)
    {
        try
        {
            await _client.GetObjectMetadataAsync(new GetObjectMetadataRequest
            {
                Key = file.FileName,
                BucketName = file.BucketName
            }, cancellationToken);

            return true;
        }
        catch (AmazonS3Exception ex)
        {
            if (ex.StatusCode == HttpStatusCode.NotFound)
            {
                return false;
            }

            throw;
        }
    }

    public async Task<byte[]> GetFile(string bucketName, Guid fileId, CancellationToken cancellationToken)
    {
        var fileObject = await _client.GetObjectAsync(bucketName, fileId.ToString(), cancellationToken);
        if (fileObject.ResponseStream == null)
        {
            throw new FileNotFoundInS3Exception(fileId.ToString());
        }

        var batch = new byte[16 * 1024];
        await using var stream = new MemoryStream();
        int read;
        while ((read = await fileObject.ResponseStream.ReadAsync(batch, cancellationToken)) > 0)
        {
            stream.Write(batch, 0, read);
        }

        return stream.ToArray();
    }

    public async Task<Stream> GetFileStream(AmazonFileReference file, CancellationToken cancellationToken)
    {
        var fileObject = await _client.GetObjectAsync(file.BucketName, file.FileName, cancellationToken);
        if (fileObject.ResponseStream != null)
        {
            return fileObject.ResponseStream;
        }
        
        throw new FileNotFoundInS3Exception(file.FileName);
    }

    public async Task UploadFile(AmazonFileReference file, Stream data, string mimeType,
        CancellationToken cancellationToken)
    {
        var transferRequest = new TransferUtilityUploadRequest
        {
            BucketName = file.BucketName,
            Key = file.FileName,
            ContentType = mimeType,
            InputStream = data,
            StorageClass = S3StorageClass.Standard,
            PartSize = data.Length,
            CannedACL = S3CannedACL.PublicRead
        };
        
        transferRequest.Metadata.Add(MimeTypeHeader, mimeType);

        await _transferUtility.UploadAsync(transferRequest, cancellationToken);
    }

    public async Task UpdateFile(UpdateFileRequest request, CancellationToken cancellationToken)
    {
        var amazonFile = new AmazonFileReference(request.BucketName, request.FileName);

        if (await Exists(amazonFile, cancellationToken))
        {
            await DeleteFile(amazonFile, cancellationToken);
        }

        await UploadFile(amazonFile, request.Data, request.ContentType, cancellationToken);
    }

    public string GetPreSignedUrl(string bucketName, string objectKey, string contentType, double duration)
    {
        var request = new GetPreSignedUrlRequest
        {
            BucketName = bucketName,
            Key = objectKey,
            Expires = DateTime.UtcNow.AddHours(duration),
            ContentType = contentType
        };
        return _client.GetPreSignedURL(request);
    }
}